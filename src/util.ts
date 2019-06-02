import { RgbColor, LabColor } from './types'


export const randInt = (maxExclusive: number, minInclusive = 0) => Math.floor((maxExclusive - minInclusive) * Math.random()) + minInclusive

export const wait = async (ms: number) => new Promise(res => setTimeout(res, ms))

export const clamp = (val: number, min: number, max: number) => Math.max(Math.min(max, val), min)

export const floorColor = (c: RgbColor) => <RgbColor>c.map(x => clamp(Math.round(x), 0, 255))

export const diff = (from: any[], what: any[]) => from.map((x, i) => x - what[i])

export const normSquare = (v: any[]) => v.reduce((acc, x) => acc + x * x, 0)

export const normEuclidian = (v: any[]) => Math.sqrt(normSquare(v))

export const distSquare = (from: any[], to: any[]) => normSquare(diff(from, to))

export const dist = (from: any[], to: any[]) => normEuclidian(diff(from, to))

export const array1d = (size: number, filler: (i?: number) => any): any[] => [...Array(size).keys()].map(filler)

export const array2d = (width: number, height: number, filler: (i?: number, j?: number) => any): any[][] => {
  const result = Array(height)
  for (let y = 0; y < height; y++) result[y] = array1d(width, x => filler(x, y))
  return result
}

export const minWithIndex = (v: number[]) => {
  const [index, val] = v.reduce(([mi, mx], x, i) => mx > x ? [i, x] : [mi, mx], [-1, Number.MAX_VALUE])
  return { index, val }
}

/*
color conversions are from https://github.com/antimatter15/rgb-lab/blob/master/color.js
slightly modified to map lab components in range of [0, 255]
Lab ranges:
{
  l: [ 0, 100 ],
  a: [ -86.1846364976253, 98.25421868616108 ],
  b: [ -107.8636810449517, 94.48248544644461 ]
}
*/
export const scaledLab2rgb = (lab: [number, number, number]): RgbColor => lab2rgb([
  lab[0] * 0.39215686274509803,
  lab[1] * 0.7232896281717113 - 86.1846364976253,
  lab[2] * 0.7935143783976327 - 107.8636810449517,
])

export const lab2rgb = (lab: LabColor): RgbColor => {
  let y = (lab[0] + 16) / 116,
      x = lab[1] / 500 + y,
      z = y - lab[2] / 200,
      r, g, b

  x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787)
  y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787)
  z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787)
  r = x *  3.2406 + y * -1.5372 + z * -0.4986
  g = x * -0.9689 + y *  1.8758 + z *  0.0415
  b = x *  0.0557 + y * -0.2040 + z *  1.0570
  r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r
  g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g
  b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * b

  return floorColor([
    clamp(r, 0, 1) * 255,
    clamp(g, 0, 1) * 255,
    clamp(b, 0, 1) * 255,
  ])
}

export const rgb2lab = (rgb: RgbColor): LabColor => {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      x, y, z

  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
  x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116
  y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116
  z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}
