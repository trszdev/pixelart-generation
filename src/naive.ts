import { releaseEventLoop, randInt, Palette, RgbColor, floorColor } from './util'


export const maxColorDist = 256 * 256 * 3

export class NaiveSolution {
  readonly k: number
  readonly kCycles: number
  readonly factor: number
  readonly canvas: HTMLCanvasElement
  readonly imageData: ImageData
  readonly events: EventTarget
  readonly shouldRedrawOnCycle: boolean

  constructor(k: number, factor: number, canvas: HTMLCanvasElement, imageData: ImageData,
    kCycles = 10000, events = new EventTarget(), shouldRedrawOnCycle = true) {
    this.k = k
    this.kCycles = kCycles
    this.factor = factor
    this.canvas = canvas
    this.imageData = imageData
    this.events = events
    this.shouldRedrawOnCycle = shouldRedrawOnCycle
  }

  emitProgress(iteration: number) {
    this.events.dispatchEvent(new CustomEvent('progress', { detail: iteration }))
  }

  emitPalette(palette: Palette, paletteUsage: number[]) {
    this.events.dispatchEvent(new CustomEvent('palette', { detail: { palette, paletteUsage } }))
  }

  async kMeans() {
    let centroids: Palette = [...Array(this.k).keys()].map(() => [randInt(256), randInt(256), randInt(256)])
    let means = centroids.map(_ => [0, 0, 0, 0])
    const { width, height, data } = this.imageData
    const clusterMap: number[][] = Array(height)
    this.emitProgress(0)
    this.emitPalette(centroids, centroids.map(_ => 0))
    await releaseEventLoop()
    let lastDistortion = 0
    for (let kc = 1; kc <= this.kCycles; kc++) {
      let counter = 0
      let distortion = 0
      const nextRgb = (): RgbColor => {
        const r = data[counter++]
        const g = data[counter++]
        const b = data[counter++]
        counter++
        return [r, g, b]
      }
      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          const [r, g, b] = nextRgb()
          if (!clusterMap[j]) clusterMap[j] = Array(width)
          const [index, val] = centroids.reduce(([mi, minDist], [pr, pg, pb], i) => {
            const dr = pr - r
            const dg = pg - g
            const db = pb - b
            const dist = dr * dr + dg * dg + db * db
            return minDist < dist ? [mi, minDist] : [i, dist]
          }, [0, maxColorDist])
          clusterMap[j][i] = index
          distortion += val
        }
        await releaseEventLoop()
      }
      counter = 0
      means = centroids.map(_ => [0, 0, 0, 0])
      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          const [r, g, b] = nextRgb()
          const centroid = means[clusterMap[j][i]]
          centroid[0] += r
          centroid[1] += g
          centroid[2] += b
          centroid[3]++
        }
        await releaseEventLoop()
      }
      means.forEach(([mr, mg, mb, t], i) => {
        if (t) centroids[i] = [mr / t, mg / t, mb / t]
      })
      const palette = centroids.map(floorColor)
      const paletteUsage = means.map(x => x[3])
      this.emitProgress(kc)
      this.emitPalette(palette, paletteUsage)
      await releaseEventLoop()
      if (this.shouldRedrawOnCycle || kc === this.kCycles || lastDistortion === distortion) {
        await this.draw(palette, clusterMap)
      }
      if (lastDistortion === distortion) {
        return
      }
      lastDistortion = distortion
    }
  }

  async draw(palette: Palette, clusterMap: number[][]) {
    const { factor, imageData: { data, width, height } } = this
    const ctx = this.canvas.getContext('2d')
    for (let j = 0; j < height; j += factor) {
      for (let i = 0; i < width; i += factor) {
        const current = j * width + i
        const alpha = data[current * 4 + 3] / 255
        const pix = palette[clusterMap[j][i]]
        ctx.clearRect(i, j, factor, factor)
        ctx.fillStyle = `rgba(${pix.concat(alpha)})`
        ctx.fillRect(i, j, factor, factor)
      }
      await releaseEventLoop()
    }
  }
}
