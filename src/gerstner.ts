import { LabColor, PixelArtAlgorithm, Palette, Canvas, EventLoopReleaser, GetMaxEigen, RgbaColor, Point } from './types'
import { array2d, dist, array1d, add, normEuclidian, gaussian, minWithIndex, lab2rgb, rgb2lab, diff } from './util'

// some kind of port https://github.com/fHachenberg/pix


export default class GerstnerPixelArt implements PixelArtAlgorithm {
  getMaxEigenFunc: GetMaxEigen
  slicTolerance = 45
  slicRange: number // sqrt(N/M)
  smoothColorFactor = 4
  smoothPosFactor = 0.87
  laplaceFactor = 0.4
  pixelSize: number
  paletteSize: number
  releaser: EventLoopReleaser
  width: number
  height: number
  outWidth: number
  outHeight: number
  input: LabColor[][]
  regionMap: Point[][]
  centroids: Point[][]
  totalWeight: number
  paletteAt: number[][]
  palette: LabColor[]
  paletteWasHuge: boolean
  colorPairs: Point[]
  colorProbability: number[]
  superpixelWeight: number[][]
  inputWeights: number[][]
  superpixelColor: LabColor[][]
  superpixelColorProbability: number[][]
  temperature: number
  hasConverged: boolean
  singleProbability: number

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
    result.paletteSize = paletteSize
    result.getMaxEigenFunc = getMaxEigenFunc
    result.pixelSize = pixelSize
    result.outHeight = Math.ceil(result.height / pixelSize)
    result.outWidth = Math.ceil(result.width / pixelSize)
    result.slicRange = Math.sqrt((result.height / result.outHeight) * (result.width / result.outWidth))
    result.paletteAt = array2d(result.outWidth, result.outHeight, () => 0)
    result.centroids = array2d(result.outWidth, result.outHeight, (x, y) => {
      const i = ((x + .5) / result.outWidth * result.width)
      const j = ((y + .5) / result.outHeight * result.height)
      return [i, j]
    })
    result.input = labPixels
    result.inputWeights = weights
    result.regionMap = array2d(result.width, result.height, (x, y) => {
      const i = Math.floor(x / result.width * result.outWidth)
      const j = Math.floor(y / result.height * result.outHeight)
      return [i, j] as Point
    })
    result.superpixelColor = array2d(result.outWidth, result.outHeight, () => [0, 0, 0])
    await result.updateSuperpixelMeans()
    let firstColor = [0, 0, 0]
    for (let y = 0; y < result.outHeight; ++y) {
      for (let x = 0; x < result.outWidth; ++x) 
        add(firstColor, result.superpixelColor[y][x])
    }
    result.singleProbability = 1.0 / (result.outWidth * result.outHeight)
    const fc = firstColor.map(x => x * result.singleProbability) as LabColor
    result.colorProbability = [0.5, 0.5]
    result.superpixelColorProbability = [
      array1d(result.outWidth * result.outHeight, () => 0.5),
      array1d(result.outWidth * result.outHeight, () => 0.5),
    ]
    result.palette = [fc]
    const [val, t] = await result.getMaxEigen(0)
    add(val, fc)
    result.palette.push(val)
    result.colorPairs = [[0, 1]]
    result.temperature = t
    return result
  }

  getAveragedPalette() {
    const averagedPalette = JSON.parse(JSON.stringify(this.palette))
    if (this.paletteWasHuge) return averagedPalette
    for (let i = 0; i < this.colorPairs.length; ++i) {
      const [index1, index2] = this.colorPairs[i]
      const color1 = this.palette[index1]
      const color2 = this.palette[index2]
      let weight1 = this.colorProbability[index1]
      let weight2 = this.colorProbability[index2]
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
    this.regionMap = array2d(this.width, this.height, () => [-1, 0])
    const averagedPalette = this.getAveragedPalette()
    const distance = array2d(this.width, this.height, () => -5)
    for (let y = 0; y < this.outHeight; ++y) {
      for (let x = 0; x < this.outWidth; ++x) {
        const pos = this.centroids[y][x]
        const minX = Math.max(0, Math.floor(pos[0] - this.slicRange))
        const minY = Math.max(0, Math.floor(pos[1] - this.slicRange))
        const maxX = Math.min(this.width - 1, pos[0] + this.slicRange)
        const maxY = Math.min(this.height - 1, pos[1] + this.slicRange)
        const superpixelColor = averagedPalette[this.paletteAt[y][x]]
        for (let yy = minY; yy <= maxY; ++yy) {
          for (let xx = minX; xx <= maxX; ++xx) {
            const colorError = dist(this.input[yy][xx], superpixelColor)
            const distError = dist(pos, [xx, yy]) * this.slicTolerance
            const error = colorError + distError / this.slicRange
            if (distance[yy][xx] < 0 || error < distance[yy][xx]) {
              distance[yy][xx] = error
              this.regionMap[yy][xx] = [x, y]
            }
          }
        }
      }
      await this.releaser.release()
    }
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        if (this.regionMap[y][x][0] === -1) {
          const i = Math.floor(x / this.width * this.outWidth)
          const j = Math.floor(y / this.height * this.outHeight)
          this.regionMap[y][x] = [i, j]
        }
      }
      await this.releaser.release()
    }
  }

  async updateSuperpixelMeans() {
    const colorSums = array2d(this.outWidth, this.outHeight, () => [0, 0, 0])
    const posSums = array2d(this.outWidth, this.outHeight, () => [0, 0])
    const weights = array2d(this.outWidth, this.outHeight, () => 0)
    this.superpixelWeight = array2d(this.outWidth, this.outHeight, () => 0)
    this.totalWeight = 0
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        const [sx, sy] = this.regionMap[y][x]
        add(colorSums[sy][sx], this.input[y][x])
        add(posSums[sy][sx], [x, y])
        weights[sy][sx]++
        this.superpixelWeight[sy][sx] += this.inputWeights[y][x]
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
          this.superpixelColor[y][x] = this.input[inputY][inputX]
        } else {
          this.superpixelColor[y][x] = colorSums[y][x].map(c => c / w) as LabColor
          this.centroids[y][x] = posSums[y][x].map(p => p / w) as Point
          this.superpixelWeight[y][x] /= w
          totalWeight += this.superpixelWeight[y][x]
        }
      }
      await this.releaser.release()
    }
    this.totalWeight = totalWeight
    for (let y = 0; y < this.outHeight; ++y) {
      for (let x = 0; x < this.outWidth; ++x)
        this.superpixelWeight[y][x] /= totalWeight
    }
    await this.smoothSuperpixelPositions()
    await this.smoothSuperpixelColors()
  }

  async smoothSuperpixelColors() {
    const newSuperpixelColors = array2d(this.outWidth, this.outHeight, () => [0, 0, 0]) as LabColor[][]
    for (let i = 0; i < this.outWidth; ++i) {
      for (let j = 0; j < this.outHeight; ++j) {
        const minX = Math.max(0, i - 1)
        const maxX = Math.min(this.outWidth - 1, i + 1)
        const minY = Math.max(0, j - 1)
        const maxY = Math.min(this.outHeight - 1, j + 1)
        const sum = [0, 0, 0]
        let weight = 0
        const sc = this.superpixelColor[j][i]
        for(let ii = minX; ii <= maxX; ++ii) {
          for(let jj = minY; jj <= maxY; ++jj) {
            const centroid = this.superpixelColor[jj][ii]
            const colorMul = gaussian(dist(sc, centroid), this.smoothColorFactor)
            const posMul = gaussian(dist([i, j], [ii, jj]), this.smoothPosFactor)
            add(sum, centroid.map(x => x * colorMul * posMul))
            weight += colorMul * posMul
          }
        }
        newSuperpixelColors[j][i] = sum.map(x => x / weight) as LabColor
      }
      await this.releaser.release()
    }
    this.superpixelColor = newSuperpixelColors
  }

  async associatePalette() {
    const newColorProbability = array1d(this.palette.length, () => 0)
    this.superpixelColorProbability = array2d(this.outHeight * this.outWidth, this.palette.length, () => 0)
    const overT = -1 / this.temperature
    for (let y = 0; y < this.outHeight; ++y) {
      for (let x = 0; x < this.outWidth; ++x) {
        const probs = []
        const pixel = this.superpixelColor[y][x]
        let probabilitySum = 0
        const { index } = minWithIndex(this.palette.map((c, i) => {
          const colorError = dist(c, pixel)
          const prob = this.colorProbability[i] * Math.exp(colorError * overT)
          probs.push(prob)
          probabilitySum += prob
          return colorError
        }))
        this.paletteAt[y][x] = index
        const superpixelWeight = this.superpixelWeight[y][x]
        probs.forEach((p, i) => {
          const normalizedProb = p / probabilitySum
          this.superpixelColorProbability[i][this.vec2idx([x, y])] = normalizedProb
          newColorProbability[i] += superpixelWeight * normalizedProb
        })
      }
      await this.releaser.release()
    }
    this.colorProbability = newColorProbability
  }

  async smoothSuperpixelPositions() {
    const newCentroids = array2d(this.outWidth, this.outHeight, () => [0, 0] as Point)
    for (let i = 0; i < this.outWidth; ++i) {
      for (let j = 0; j < this.outHeight; ++j) {
        const sum = [0, 0]
        let count = 0
        if (i > 0) {
          add(sum, this.centroids[j][i - 1])
          count++
        }
        if (i < this.outWidth - 1) {
          add(sum, this.centroids[j][i + 1])
          count++
        }
        if (j > 0) {
          add(sum, this.centroids[j - 1][i])
          count++
        }
        if (j < this.outHeight - 1) {
          add(sum, this.centroids[j + 1][i])
          count++
        }
        sum[0] /= count
        sum[1] /= count
        const orig = this.centroids[j][i]
        const nPos = [0, 0]
        if (i === 0 || i === this.outWidth - 1) {
          nPos[0] = orig[0]
        } else {
          nPos[0] = (1.0 - this.laplaceFactor) * orig[0] + this.laplaceFactor * sum[0]
        }
        if (j === 0 || j === this.outHeight - 1) {
          nPos[1] = orig[1]
        } else {
          nPos[1] = (1.0 - this.laplaceFactor) * orig[1] + this.laplaceFactor * sum[1]
        }
        newCentroids[j][i] = nPos as Point
      }
      await this.releaser.release()
    }
    this.centroids = newCentroids
  }

  async refinePalette(): Promise<number> {
    const colorSums = array1d(this.palette.length, () => [0, 0, 0]) as LabColor[]
    for (let y = 0; y < this.outHeight; ++y) {
      for (let x = 0; x < this.outWidth; ++x) {
        const superpixelWeight = this.superpixelWeight[y][x]
        const superpixelColor = this.superpixelColor[y][x]
        this.palette.forEach((_, i) => {
          const w = superpixelWeight * this.superpixelColorProbability[i][this.vec2idx([x, y])]
          add(colorSums[i], superpixelColor.map(x => x * w))
        })
      }
      await this.releaser.release()
    }
    let paletteError = 0
    this.palette.forEach((c, i) => {
      if (this.colorProbability[i] > 0) {
        const newColor = colorSums[i].map(x => x / this.colorProbability[i]) as LabColor
        paletteError += dist(c, newColor)
        this.palette[i] = newColor
      }
    })
    return paletteError
  }

  async getMaxEigen(index: number): Promise<[LabColor, number]> {
    const matrix = array1d(9, () => 0)
    for (let y = 0; y < this.outHeight; ++y) {
      for (let x = 0; x < this.outWidth; ++x) {
        const colorSuperpixelProbability = this.superpixelColorProbability[index][this.vec2idx([x, y])] *
          this.singleProbability / this.colorProbability[index]
        const colorError = diff(this.palette[index], this.superpixelColor[y][x]).map(x => Math.abs(x))
        matrix[0] += colorSuperpixelProbability * colorError[0] * colorError[0]
        matrix[1] += colorSuperpixelProbability * colorError[1] * colorError[0]
        matrix[2] += colorSuperpixelProbability * colorError[2] * colorError[0]
        matrix[3] += colorSuperpixelProbability * colorError[0] * colorError[1]
        matrix[4] += colorSuperpixelProbability * colorError[1] * colorError[1]
        matrix[5] += colorSuperpixelProbability * colorError[2] * colorError[1]
        matrix[6] += colorSuperpixelProbability * colorError[0] * colorError[2]
        matrix[7] += colorSuperpixelProbability * colorError[1] * colorError[2]
        matrix[8] += colorSuperpixelProbability * colorError[2] * colorError[2]
      }
      await this.releaser.release()
    }
    const { vec, lambda } = this.getMaxEigenFunc(matrix)
    const len = normEuclidian(vec)
    return [vec.map(x => 0.8 * x / (len || 1)) as LabColor, 1.1 * Math.sqrt(2 * Math.abs(lambda))]
  }

  async splitColor(index: number) {
    const [index1, index2] = this.colorPairs[index]
    const nextIndex1 = this.palette.length
    const nextIndex2 = nextIndex1 + 1
    const color1 = this.palette[index1]
    const color2 = this.palette[index2]
    const [subColor1] = await this.getMaxEigen(index1)
    const [subColor2] = await this.getMaxEigen(index2)
    add(subColor1, color1)
    add(subColor2, color2)
    this.palette.push(subColor1)
    this.colorPairs[index][1] = nextIndex1
    this.colorProbability[index1] *= 0.5
    this.colorProbability.push(this.colorProbability[index1])
    this.superpixelColorProbability.push(this.superpixelColorProbability[index1])
    this.palette.push(subColor2)
    this.colorPairs.push([index2, nextIndex2])
    this.colorProbability[index2] *= 0.5
    this.colorProbability.push(this.colorProbability[index2])
    this.superpixelColorProbability.push(this.superpixelColorProbability[index2])
  }

  condensePalette() {
    this.paletteWasHuge = true
    const newPalette = []
    const newColorProbability = []
    const nPaletteAssign = array2d(this.outWidth, this.outHeight, () => 0)
    for (let j = 0; j < this.colorPairs.length; ++j) {
      const [index1, index2] = this.colorPairs[j]
      let weight1 = this.colorProbability[index1]
      let weight2 = this.colorProbability[index2]
      const total_weight = weight1 + weight2
      weight1 /= total_weight
      weight2 /= total_weight
      const color = this.palette[index1].map(x => x * weight1)
      add(color, this.palette[index2].map(x => x * weight2))
      newPalette.push(color)
      newColorProbability.push(this.colorProbability[index1] + this.colorProbability[index2])
      for (let y = 0; y < this.outHeight; ++y) {
        for (let x = 0; x < this.outWidth; ++x) {
          if ([index1, index2].includes(this.paletteAt[y][x])) {
            nPaletteAssign[y][x] = j
          }
        }
      }
    }
    this.palette = newPalette
    this.paletteAt = nPaletteAssign
    this.colorProbability = newColorProbability
  }

  async expandPalette() {
    if (this.paletteWasHuge) return
    const splits = []
    for (let index = 0; index < this.colorPairs.length; ++index) {
      const [index1, index2] = this.colorPairs[index]
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
      if (this.palette.length >= 2 * this.paletteSize) {
        this.condensePalette()
        return
      }
    }
  }

  async iterate(): Promise<void> {
    if (this.hasConverged) return
    await this.updateSuperPixelMapping()
    await this.updateSuperpixelMeans()
    await this.associatePalette()
    const paletteError = await this.refinePalette()
    if (paletteError < 1) {
      if (this.temperature <= 1)
        this.hasConverged = true
      else
        this.temperature = Math.max(this.temperature* 0.7, 1)
      await this.expandPalette()
    }
  }

  hasCompleted(): boolean {
    return this.hasConverged
  }

  async draw(canvas: Canvas): Promise<Palette> {
    const averagedPalette = this.getAveragedPalette().map(lab2rgb)
    const { pixelSize, superpixelWeight, paletteAt, outHeight, outWidth } = this
    const palette = averagedPalette.map(color => ({ color, timesUsed: 0 }))
    const mul = this.totalWeight * 255
    for (let y = 0; y < outHeight; ++y) {
      for (let x = 0; x < outWidth; ++x) {
        const paletteIndex = paletteAt[y][x]
        const [r, g, b] = averagedPalette[paletteIndex]
        const alpha = Math.floor(superpixelWeight[y][x] * mul)
        palette[paletteIndex].timesUsed++
        canvas.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize, [r, g, b, alpha])
      }
    }
    return palette
  }

  async drawRealSized(canvas: Canvas): Promise<void> {
    const averagedPalette = this.getAveragedPalette().map(lab2rgb)
    const { superpixelWeight, paletteAt, outHeight, outWidth } = this
    const mul = this.totalWeight * 255
    for (let y = 0; y < outHeight; ++y) {
      for (let x = 0; x < outWidth; ++x) {
        const paletteIndex = paletteAt[y][x]
        const [r, g, b] = averagedPalette[paletteIndex]
        const alpha = Math.floor(superpixelWeight[y][x] * mul)
        canvas.setPixel(x, y, [r, g, b, alpha])
      }
    }
  }
}
