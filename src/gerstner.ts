import { LabColor, PixelArtAlgorithm, Palette, Canvas, EventLoopReleaser, GetMaxEigen, RgbaColor } from './types'
import { array2d, dist, array1d, add, normEuclidian, gaussian, minWithIndex, lab2rgb, rgb2lab, diff } from './util'

// some kind of port https://github.com/fHachenberg/pix


export default class GerstnerPixelArt implements PixelArtAlgorithm {
  getMaxEigenFunc: GetMaxEigen

  slicTolerance = 45
  sigma_color_ = 4
  sigma_position_ = 0.87
  smooth_pos_factor_ = 0.4
  pixelSize: number
  releaser: EventLoopReleaser
  width: number
  height: number
  outWidth: number
  outHeight: number
  input: LabColor[][]

  region_map
  range_: number // sqrt(N/M)
  superpixel_pos
  palette_assign: number[][]
  palette: LabColor[]
  palette_maxed_flag_: boolean
  sub_superpixel_pairs: any[]
  prob_c: number[]
  superpixel_weights_
  input_weights_: number[][]
  superpixel_opaque: boolean[][]
  superpixel_color: LabColor[][]

  prob_co_: number[][]
  temperature_: number
  converged_flag_: boolean
  max_palette_size_: number
  prob_o_: number

  static async fromImage(input: RgbaColor[][], pixelSize: number, paletteSize: number,
    releaser: EventLoopReleaser, getMaxEigenFunc: GetMaxEigen) {
    const result = new GerstnerPixelArt()
    const weights = array2d(input[0].length, input.length, () => 1)
    const labPixels = array2d(input[0].length, input.length, (i, j) => {
      const [r, g, b, a] = input[j][i]
      weights[j][i] = a / 255
      return rgb2lab([r, g, b])
    })
    result.height = input.length
    result.width = input[0].length
    result.releaser = releaser
    result.max_palette_size_ = paletteSize
    result.getMaxEigenFunc = getMaxEigenFunc
    result.pixelSize = pixelSize
    result.outHeight = Math.floor(result.height / pixelSize)
    result.outWidth = Math.floor(result.width / pixelSize)
    result.range_ = Math.sqrt((result.height / result.outHeight) * (result.width / result.outWidth))
    result.palette_assign = array2d(result.outWidth, result.outHeight, () => 0)
    result.superpixel_pos = array2d(result.outWidth, result.outHeight, (x, y) => {
      const i = ((x + .5) / result.outWidth * result.width)
      const j = ((y + .5) / result.outHeight * result.height)
      return [i, j]
    })
    result.input = labPixels
    result.input_weights_ = weights
    result.region_map = array2d(result.width, result.height, (x, y) => {
      const i = Math.floor(x / result.width * result.outWidth)
      const j = Math.floor(y / result.height * result.outHeight)
      return [i, j]
    })
    result.superpixel_color = array2d(result.outWidth, result.outHeight, () => [0, 0, 0])
    result.superpixel_opaque = array2d(result.outWidth, result.outHeight, () => true)
    await result.updateSuperpixelMeans()
    let first_color = [0, 0, 0]
    for (let y = 0; y < result.outHeight; ++y) {
      for (let x = 0; x < result.outWidth; ++x) 
        add(first_color, result.superpixel_color[y][x])
    }
    result.prob_o_ = 1.0 / (result.outWidth * result.outHeight)
    const fc = first_color.map(x => x * result.prob_o_) as LabColor
    result.prob_c = [0.5, 0.5]
    result.prob_co_ = [
      array1d(result.outWidth * result.outHeight, () => 0.5),
      array1d(result.outWidth * result.outHeight, () => 0.5),
    ]
    result.palette = [fc]
    const [val, t] = await result.getMaxEigen(0)
    add(val, fc)
    result.palette.push(val)
    result.sub_superpixel_pairs = [[0, 1]]
    result.temperature_ = t
    return result
  }

  getAveragedPalette() {
    const averagedPalette = JSON.parse(JSON.stringify(this.palette))
    if (this.palette_maxed_flag_) return averagedPalette
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
        if (this.region_map[y][x][0] === -1) {
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
    this.superpixel_opaque = array2d(this.outWidth, this.outHeight, () => true)
    this.superpixel_weights_ = array2d(this.outWidth, this.outHeight, () => 0)
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        const [sx, sy] = this.region_map[y][x]
        if (this.input_weights_[y][x] !== 1)
          this.superpixel_opaque[sy][sx] = false
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

  async getMaxEigen(palette_index: number): Promise<[LabColor, number]> {
    const matrix = array1d(9, () => 0)
    for (let y = 0; y < this.outHeight; ++y) {
      for (let x = 0; x < this.outWidth; ++x) {
        const prob_oc = this.prob_co_[palette_index][this.vec2idx([x, y])] * this.prob_o_ / this.prob_c[palette_index]
        const color_error = diff(this.palette[palette_index], this.superpixel_color[y][x]).map(x => Math.abs(x))
        matrix[0] += prob_oc * color_error[0] * color_error[0]
        matrix[1] += prob_oc * color_error[1] * color_error[0]
        matrix[2] += prob_oc * color_error[2] * color_error[0]
        matrix[3] += prob_oc * color_error[0] * color_error[1]
        matrix[4] += prob_oc * color_error[1] * color_error[1]
        matrix[5] += prob_oc * color_error[2] * color_error[1]
        matrix[6] += prob_oc * color_error[0] * color_error[2]
        matrix[7] += prob_oc * color_error[1] * color_error[2]
        matrix[8] += prob_oc * color_error[2] * color_error[2]
      }
      await this.releaser.release()
    }
    const { vec, lambda } = this.getMaxEigenFunc(matrix)
    const len = normEuclidian(vec)
    return [vec.map(x => 0.8 * x / (len || 1)) as LabColor, 1.1 * Math.sqrt(2 * Math.abs(lambda))]
  }

  async splitColor(index: number) {
    const [index1, index2] = this.sub_superpixel_pairs[index]
    const nextIndex1 = this.palette.length
    const nextIndex2 = nextIndex1 + 1
    const color1 = this.palette[index1]
    const color2 = this.palette[index2]
    const [subcluster_color_1] = await this.getMaxEigen(index1)
    const [subcluster_color_2] = await this.getMaxEigen(index2)
    add(subcluster_color_1, color1)
    add(subcluster_color_2, color2)

    this.palette.push(subcluster_color_1)
    this.sub_superpixel_pairs[index][1] = nextIndex1
    this.prob_c[index1] *= 0.5
    this.prob_c.push(this.prob_c[index1])
    this.prob_co_.push(this.prob_co_[index1])

    this.palette.push(subcluster_color_2)
    this.sub_superpixel_pairs.push([index2, nextIndex2])
    this.prob_c[index2] *= 0.5
    this.prob_c.push(this.prob_c[index2])
    this.prob_co_.push(this.prob_co_[index2])
  }

  condensePalette() {
    this.palette_maxed_flag_ = true
    const new_palette = []
    const new_prob_c = []
    const nPaletteAssign = array2d(this.outWidth, this.outHeight, () => 0)
    for (let j = 0; j < this.sub_superpixel_pairs.length; ++j) {
      const [index1, index2] = this.sub_superpixel_pairs[j]
      let weight1 = this.prob_c[index1]
      let weight2 = this.prob_c[index2]
      const total_weight = weight1 + weight2
      weight1 /= total_weight
      weight2 /= total_weight
      const color = this.palette[index1].map(x => x * weight1)
      add(color, this.palette[index2].map(x => x * weight2))
      new_palette.push(color)
      new_prob_c.push(this.prob_c[index1] + this.prob_c[index2])
      for (let y = 0; y < this.outHeight; ++y) {
        for (let x = 0; x < this.outWidth; ++x) {
          if ([index1, index2].includes(this.palette_assign[y][x])) {
            nPaletteAssign[y][x] = j
          }
        }
      }
    }
    this.palette = new_palette
    this.palette_assign = nPaletteAssign
    this.prob_c = new_prob_c
  }

  async expandPalette() {
    if (this.palette_maxed_flag_) return
    const splits = []
    for (let index = 0; index < this.sub_superpixel_pairs.length; ++index) {
      const [index1, index2] = this.sub_superpixel_pairs[index]
      const color1 = this.palette[index1]
      const color2 = this.palette[index2]
      const error = dist(color1, color2)
      if (error > 1.6) {
        splits.push([error, index])
      } else {
        const [newColor] = await this.getMaxEigen(index1)
        add(this.palette[index2], newColor)
      }
    }
    splits.sort((a, b) => b[0] - a[0])
    for (let i = 0; i < splits.length; i++) {
      await this.splitColor(splits[i][1])
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
    const averagedPalette = this.getAveragedPalette().map(lab2rgb)
    const { pixelSize } = this
    const palette = averagedPalette.map(color => ({ color, timesUsed: 0 }))
    for (let y = 0; y < this.outHeight; ++y) {
      for (let x = 0; x < this.outWidth; ++x) {
        const paletteIndex = this.palette_assign[y][x]
        const [r, g, b] = averagedPalette[paletteIndex]
        const alpha = this.input_weights_[y * pixelSize][x * pixelSize] === 1 ? 255 : 0
        palette[paletteIndex].timesUsed++
        canvas.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize, [r, g, b, alpha])
      }
    }
    return palette
  }
}
