import { Canvas, RgbaColor } from './types'


export default class WrappedHtmlCanvas implements Canvas {
  readonly canvas: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  fillRect(x: number, y: number, w: number, h: number, [r, g, b, a]: RgbaColor) {
    this.ctx.clearRect(x, y, w, h)
    this.ctx.fillStyle = `rgba(${[r, g, b, a / 255]})`
    this.ctx.fillRect(x, y, w, h)
  }

  getPixel(x: number, y: number): RgbaColor {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data
    return <RgbaColor>Array.from(imageData)
  }

  setPixel(x: number, y: number, color: RgbaColor) {
    const imageData = this.ctx.getImageData(x, y, 1, 1)
    imageData.data[0] = color[0]
    imageData.data[1] = color[1]
    imageData.data[2] = color[2]
    imageData.data[3] = color[3]
    this.ctx.putImageData(imageData, x, y)
  }

  getPixels(): RgbaColor[][] {
    const { width, height } = this.canvas
    const imageData = this.ctx.getImageData(0, 0, width, height).data
    const rows = Array(height)
    let count = 0
    for (let j = 0; j < height; j++) {
      const row = []
      rows[j] = row
      for (let i = 0; i < width; i++) {
        const color = [0, 0, 0, 0]
        color[0] = imageData[count++]
        color[1] = imageData[count++]
        color[2] = imageData[count++]
        color[3] = imageData[count++]
        row.push(color)
      }
    }
    return rows
  }

  getWidth  = () => this.canvas.width
  getHeight = () => this.canvas.height
}
