import { randInt, floorColor, minWithIndex, distSquare, array1d, array2d, add } from './util'
import { PixelArtAlgorithm, Canvas, RgbColor, Palette, EventLoopReleaser, RgbaColor } from './types'


export default class NaivePixelArt implements PixelArtAlgorithm {
  readonly releaser: EventLoopReleaser
  readonly pixelSize: number
  readonly pixels: RgbaColor[][]
  readonly palette: Palette
  readonly clusterMap: number[][]
  lastDistortion = 0
  completed = false

  constructor(palette: Palette, pixelSize: number,
    releaser: EventLoopReleaser, pixels: RgbaColor[][], clusterMap: number[][]) {
    this.pixelSize = pixelSize
    this.releaser = releaser
    this.palette = palette
    this.pixels = pixels
    this.clusterMap = clusterMap
  }

  static fromRandomPalette(paletteSize: number, pixelSize: number,
    releaser: EventLoopReleaser, pixels: RgbaColor[][]) {
    const palette = array1d(paletteSize, () => ({
      timesUsed: 0,
      color: [randInt(256), randInt(256), randInt(256)] as RgbColor,
    }))
    const clusterMap = array2d(pixels[0].length, pixels.length, () => randInt(paletteSize))
    return new NaivePixelArt(palette, pixelSize, releaser, pixels, clusterMap)
  }

  async iterate(): Promise<void> {
    let distortion = 0
    const { pixels, releaser, palette, clusterMap } = this
    const centroids = palette.map(x => x.color)
    for (let j = 0; j < pixels.length; j++) {
      const row = pixels[j]
      for (let i = 0; i < row.length; i++) {
        const [r, g, b] = row[i]
        const { index, val } = minWithIndex(centroids.map(c => distSquare(c, [r, g, b])))
        clusterMap[j][i] = index
        distortion += val
      }
      await releaser.release()
    }
    if (distortion === this.lastDistortion) {
      this.completed = true
      return
    }
    this.lastDistortion = distortion
    this.palette.forEach(x => {
      x.timesUsed = 0
      x.color = [0, 0, 0]
    })
    for (let j = 0; j < pixels.length; j++) {
      const row = pixels[j]
      for (let i = 0; i < row.length; i++) {
        const centroid = this.palette[clusterMap[j][i]]
        add(centroid.color, row[i])
        centroid.timesUsed++
      }
      await releaser.release()
    }
    this.palette.forEach((x, i) => {
      const { color: [r, g, b], timesUsed: t } = x
      x.color = t ? floorColor([r / t, g / t, b / t]) : centroids[i]
    })
  }

  hasCompleted(): boolean {
    return this.completed
  }

  async draw(canvas: Canvas): Promise<Palette> {
    const { palette, pixels, pixelSize, clusterMap, releaser } = this
    for (let j = 0; j < pixels.length; j += pixelSize) {
      const row = pixels[j]
      for (let i = 0; i < row.length; i += pixelSize) {
        const alpha = row[i][3] === 255
        const [r, g, b] = palette[clusterMap[j][i]].color
        canvas.fillRect(i, j, pixelSize, pixelSize, [r, g, b, alpha ? 255 : 0])
      }
      await releaser.release()
    }
    return this.palette
  }
}
