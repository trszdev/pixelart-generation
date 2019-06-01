const rgb2lab = (rgb) => {
  let r = rgb[0] / 255,
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

  return [
    ((116 * y) - 16) * 2.55,
    (500 * (x - y) + 86.1846364976253) * 1.3825720168665225,
    (200 * (y - z) + 107.8636810449517) * 1.2602166100875576,
  ]
  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

const findLabBoundaries = () => {
  const min = [9999, 9999, 9999]
  const max = [-9999, -9999, -9999]
  for (let r = 0; r < 256; r++) {
    for (let g = 0; g < 256; g++) {
      for (let b = 0; b < 256; b++) {
        const lab = rgb2lab([r, g, b])
        lab.forEach((x, i) => min[i] = Math.min(min[i], x))
        lab.forEach((x, i) => max[i] = Math.max(max[i], x))
      }
    }
  }
  return { l: [min[0], max[0]], a: [min[1], max[1]], b: [min[2], max[2]] }
}

if (module && !module.parent) {
  console.log(findLabBoundaries())
}