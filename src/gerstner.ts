import { LabColor, PixelArtAlgorithm, Palette, Canvas, Point, EventLoopReleaser } from './types'
import { array2d, dist, array1d, add, normEuclidian, gaussian, minWithIndex } from './util';


export class BilateralFilter {
  readonly kernelSize: number = 3
  readonly colorStd: number = 4
  readonly positionStd: number = 0.87
}

export class LaplaceSmoothFilter {
  readonly factor = 0.4
}


export default class GerstnerPixelArt implements PixelArtAlgorithm {
  readonly bilateralFilter: BilateralFilter
  readonly laplaceFilter: LaplaceSmoothFilter

  readonly slicTolerance: number
  readonly pixelSize: number
  readonly releaser: EventLoopReleaser
  readonly width: number
  readonly height: number
  readonly outWidth: number
  readonly outHeight: number
  readonly input: LabColor[][]

  region_map
  range_ // sqrt(N/M)
  superpixel_pos
  palette_assign
  region_list_
  palette: LabColor[]
  palette_maxed_flag_
  sub_superpixel_pairs
  prob_c
  superpixel_weights_
  input_weights_
  superpixel_color: LabColor[][]
  smooth_pos_factor_
  sigma_color_
  sigma_position_
  prob_co_
  temperature_: number
  converged_flag_
  max_palette_size_: number

  getAveragedPalette() {
    if (this.palette_maxed_flag_) return this.palette
    const averagedPalette = this.palette // TODO
    for (let i = 0; i < this.sub_superpixel_pairs.length; ++i) {
      const [index1, index2] = this.sub_superpixel_pairs[i]
      const color1 = this.palette[index1]
      const color2 = this.palette[index2]
      let weight1 = this.prob_c[index1]
      let weight2 = this.prob_c[index2]
      const totalWeight = weight1 + weight2
      weight1 /= totalWeight
      weight2 /= totalWeight
      const averagedColor = color1.map((c, i) => c * weight1 + color2[i] * weight2) as LabColor
      averagedPalette[index1] = averagedColor
      averagedPalette[index2] = averagedColor
    }
    return averagedPalette
  }

  vec2idx = ([x, y]) => x + this.outWidth * y

  async updateSuperPixelMapping() {
    this.region_map = array2d(this.width, this.height, () => [-1, 0])
    const averagedPalette = this.getAveragedPalette()
    const distance = array2d(this.width, this.height, () => -5)
    for (let y = 0; y < this.outHeight; ++y) {
      for (let x = 0; x < this.outWidth; ++x) {
        const pos = this.superpixel_pos[y][x]
        const minX = Math.max(0, Math.floor(pos[0] - this.range_))
        const minY = Math.max(0, Math.floor(pos[1] - this.range_))
        const maxX = Math.min(this.width - 1, pos[0] + this.range_)
        const maxY = Math.min(this.height - 1, pos[1] + this.range_)
        const superpixelColor = averagedPalette[this.palette_assign[y][x]]
        for (let yy = minY; yy <= maxY; ++yy) {
          for (let xx = minX; xx <= maxX; ++xx) {
            const colorError = dist(this.input[yy][xx], superpixelColor)
            const distError = dist(pos, [xx, yy])
            const error = colorError + this.slicTolerance / this.range_ * distError
            if(distance[yy][xx] < 0 || error < distance[yy][xx] ) {
              distance[yy][xx] = error
              this.region_map[yy][xx] = [x, y]
            }
          }
        }
      }
      await this.releaser.release()
    }
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        if (this.region_map[y][x][0] === -1) { // TODO
          const i = Math.floor(x / this.width * this.outWidth)
          const j = Math.floor(y / this.height * this.outHeight)
          this.region_map[y][x] = [i, j]
        }
      }
      await this.releaser.release()
    }
  }

  async updateSuperpixelMeans() {
    const colorSums = array2d(this.outWidth, this.outHeight, () => [0, 0, 0])
    const posSums = array2d(this.outWidth, this.outHeight, () => [0, 0])
    const weights = array2d(this.outWidth, this.outHeight, () => 0)
    this.superpixel_weights_ = array2d(this.outWidth, this.outHeight, () => 0)
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        const [sx, sy] = this.region_map[y][x]
        add(colorSums[sy][sx], this.input[y][x])
        add(posSums[sy][sx], [x, y])
        weights[sy][sx]++
        this.superpixel_weights_[sy][sx] += this.input_weights_[y][x]
      }
      await this.releaser.release()
    }
    let totalWeight = 0
    for (let y = 0; y < this.outHeight; ++y) {
      for (let x = 0; x < this.outWidth; ++x) {
        const w = weights[y][x]
        if (w === 0) {
          const inputX = Math.floor(x / this.outWidth * this.width)
          const inputY = Math.floor(y / this.outHeight * this.height)
          this.superpixel_color[y][x] = this.input[inputY][inputX]
        } else {
          this.superpixel_color[y][x] = colorSums[y][x].map(c => c / w) as LabColor
          this.superpixel_pos[y][x] = posSums[y][x].map(p => p / w)
          this.superpixel_weights_[y][x] /= w
          totalWeight += this.superpixel_weights_[y][x]
        }
      }
      await this.releaser.release()
    }
    for (let y = 0; y < this.outHeight; ++y) {
      for (let x = 0; x < this.outWidth; ++x)
        this.superpixel_weights_[y][x] /= totalWeight
    }
    await this.smoothSuperpixelPositions()
    await this.smoothSuperpixelColors()
  }

  async smoothSuperpixelColors() {
    const new_superpixel_colors = array2d(this.outWidth, this.outHeight, () => [0, 0, 0]) as LabColor[][]
    for (let i = 0; i < this.outWidth; ++i) {
      for (let j = 0; j < this.outHeight; ++j) {
        const min_x = Math.max(0, i - 1)
        const max_x = Math.min(this.outWidth - 1, i + 1)
        const min_y = Math.max(0, j - 1)
        const max_y = Math.min(this.outHeight - 1, j + 1)
        const sum = [0, 0, 0]
        let weight = 0
        const sc = this.superpixel_color[j][i]
        for(let ii = min_x; ii <= max_x; ++ii) {
          for(let jj = min_y; jj <= max_y; ++jj) {
            const c_n = this.superpixel_color[jj][ii]
            const w_color = gaussian(dist(sc, c_n), this.sigma_color_)
            const w_pos = gaussian(dist([i, j], [ii, jj]), this.sigma_position_)
            const w_total = w_color * w_pos
            add(sum, c_n.map(x => x * w_total))
            weight += w_total
          }
        }
        new_superpixel_colors[j][i] = sum.map(x => x / weight) as LabColor
      }
      await this.releaser.release()
    }
    this.superpixel_color = new_superpixel_colors
  }

  async associatePalette() {
    const new_prob_c = array1d(this.palette.length, () => 0)
    this.prob_co_ = array2d(this.outHeight * this.outWidth, this.palette.length, () => 0)
    const overT = -1 / this.temperature_
    for (let y = 0; y < this.outHeight; ++y) {
      for (let x = 0; x < this.outWidth; ++x) {
        const probs = []
        const pixel = this.superpixel_color[y][x]
        let sum_prob = 0
        const { index } = minWithIndex(this.palette.map((c, i) => {
          const color_error = dist(c, pixel)
          const prob = this.prob_c[i] * Math.exp(color_error * overT)
          probs.push(prob)
          sum_prob += prob
          return color_error
        }))
        this.palette_assign[y][x] = index
        const prob_sp = this.superpixel_weights_[y][x]
        probs.forEach((p, i) => {
          const normalized_prob = p / sum_prob
          this.prob_co_[i][this.vec2idx([x, y])] = normalized_prob
          new_prob_c[i] += prob_sp * normalized_prob
        })
      }
      await this.releaser.release()
    }
    this.prob_c = new_prob_c
  }

  async smoothSuperpixelPositions() {
    const new_superpixel_pos = array2d(this.outWidth, this.outHeight, () => [0, 0])
    for (let i = 0; i < this.outWidth; ++i) {
      for (let j = 0; j < this.outHeight; ++j) {
        const sum = [0, 0]
        let count = 0
        if (i > 0) {
          add(sum, this.superpixel_pos[j][i - 1])
          count++
        }
        if (i < this.outWidth - 1) {
          add(sum, this.superpixel_pos[j][i + 1])
          count++
        }
        if (j > 0) {
          add(sum, this.superpixel_pos[j - 1][i])
          count++
        }
        if (j < this.outHeight - 1) {
          add(sum, this.superpixel_pos[j + 1][i])
          count++
        }
        sum[0] /= count
        sum[1] /= count
        const orig = this.superpixel_pos[j][i]
        const nPos = [0, 0]
        if (i === 0 || i === this.outWidth - 1) {
          nPos[0] = orig[0]
        } else {
          nPos[0] = (1.0 - this.smooth_pos_factor_) * orig[0] + this.smooth_pos_factor_ * sum[0]
        }
        if (j === 0 || j === this.outHeight - 1) {
          nPos[1] = orig[1]
        } else {
          nPos[1] = (1.0 - this.smooth_pos_factor_) * orig[1] + this.smooth_pos_factor_ * sum[1]
        }
        new_superpixel_pos[j][i] = nPos
      }
      await this.releaser.release()
    }
    this.superpixel_pos = new_superpixel_pos
  }

  async refinePalette(): Promise<number> {
    const color_sums = array1d(this.palette.length, () => [0, 0, 0]) as LabColor[]
    for (let y = 0; y < this.outHeight; ++y) {
      for (let x = 0; x < this.outWidth; ++x) {
        const prob_sb = this.superpixel_weights_[y][x]
        const pixel_color = this.superpixel_color[y][x]
        this.palette.forEach((_, i) => {
          const w = prob_sb * this.prob_co_[i][this.vec2idx([x, y])]
          add(color_sums[i], pixel_color.map(x => x * w))
        })
      }
      await this.releaser.release()
    }
    let palette_error = 0
    this.palette.forEach((c, i) => {
      if (this.prob_c[i] > 0) {
        const new_color = color_sums[i].map(x => x / this.prob_c[i]) as LabColor
        palette_error += dist(c, new_color)
        this.palette[i] = new_color
      }
    })
    return palette_error
  }

  async getMaxEigen(palette_index: number) {

  }

  splitColor(index: number) {
    //remove subsuperpixels if max palette size is reached
    //and represent each color as a single superpixel
    const [index1, index2] = this.sub_superpixel_pairs[index]
    const nextIndex1 = this.palette.length
    const nextIndex2 = nextIndex1 + 1
    const color1 = this.palette[index1]
    const color2 = this.palette[index2]
    const sub_color1 = 1

    //create a subsuperpixel for each of the two new
    //colors, set to slight permutations of the
    //old subsuperpixels' colors
    /*
    cv::Vec3f subcluster_color_1 = 
      color_1 + GetMaxEigen(index_1).first*kSubclusterPertubation;
    cv::Vec3f subcluster_color_2 = 
      color_2 + GetMaxEigen(index_2).first*kSubclusterPertubation;

    //reconstruct first pair
    GetCurrentState()->palette.push_back(subcluster_color_1);
    GetCurrentState()->sub_superpixel_pairs[pair_index].second = next_index1;
    GetCurrentState()->prob_c[index_1]*=.5f; 
    GetCurrentState()->prob_c.push_back(GetCurrentState()->prob_c[index_1]);
    prob_co_.push_back(prob_co_[index_1]);

    //reconstruct second pair
    GetCurrentState()->palette.push_back(subcluster_color_2);
    std::pair<int,int> new_pair(index_2, next_index2);
    GetCurrentState()->sub_superpixel_pairs.push_back(new_pair);
    GetCurrentState()->prob_c[index_2]*=.5f;
    GetCurrentState()->prob_c.push_back(GetCurrentState()->prob_c[index_2]);
    prob_co_.push_back(prob_co_[index_2]);
    */
  }

  condensePalette() {

  }

  async expandPalette() {
    if (this.palette_maxed_flag_) return
    const splits = []
    for (let index = 0; index < this.palette.length; ++index) {
      const [index1, index2] = this.sub_superpixel_pairs[index]
      const color1 = this.palette[index1]
      const color2 = this.palette[index2]
      const error = dist(color1, color2)
      if (error > 1.6) {
        splits.push([error, index])
      } else {
        // GetCurrentState()->palette[index_2] += 
        //  GetMaxEigen(index_1).first*kSubclusterPertubation;
        add(this.palette[index2], [].map(x => x * 0.8))
      }
    }
    splits.sort((a, b) => b[0] - a[0])
    for (let i = 0; i < splits.length; i++) {
      this.splitColor(splits[i][1])
      if (this.palette.length >= 2 * this.max_palette_size_) {
        this.condensePalette()
        return
      }
    }
  }

  async iterate(): Promise<void> {
    if (this.converged_flag_) return
    await this.updateSuperPixelMapping()
    await this.updateSuperpixelMeans()
    await this.associatePalette()
    const paletteError = await this.refinePalette()
    if (paletteError < 1) {
      this.temperature_ = Math.max(1, this.temperature_ * 0.7)
      if (this.temperature_ <= 1)
        this.converged_flag_ = true
      else
        this.temperature_ = Math.max(this.temperature_* 0.7, 1)
      await this.expandPalette()
    }
  }

  hasCompleted(): boolean {
    return this.converged_flag_
  }

  async draw(canvas: Canvas): Promise<Palette> {
    return []
  }
}
