export type Uint8 = number
export type RgbaColor = [Uint8, Uint8, Uint8, Uint8]
export type RgbColor = [Uint8, Uint8, Uint8]
export type Palette = { timesUsed: number, color: RgbColor }[]
export type LabColor = [number, number, number]

export interface Canvas {
  fillRect(x: number, y: number, w: number, h: number, color: RgbaColor)
  getPixel(x: number, y: number): RgbaColor
  setPixel(x: number, y: number, color: RgbaColor)
  getPixels(): RgbaColor[][]
  getWidth(): number
  getHeight(): number
}

export interface PixelArtAlgorithm {
  iterate(): Promise<void>
  hasCompleted(): boolean
  draw(canvas: Canvas): Promise<Palette>
}

export interface EventLoopReleaser {
  release(): Promise<void>
}
