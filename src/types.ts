export type Uint8 = number
export type RgbaColor = [Uint8, Uint8, Uint8, Uint8]
export type RgbColor = [Uint8, Uint8, Uint8]
export type Palette = { timesUsed: number, color: RgbColor }[]
export type LabColor = [number, number, number]
export type Point = [number, number]

export type GetMaxEigen = (vec9: number[]) => { lambda: number, vec: [number, number, number] }

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
  drawRealSized(canvas: Canvas): Promise<void>
}

export interface EventLoopReleaser {
  release(): Promise<void>
}
