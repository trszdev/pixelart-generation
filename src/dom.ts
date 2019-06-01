import { Palette } from './util'


export const dom = {
  canvasOrig: document.getElementById('canvas-orig') as HTMLCanvasElement,
  canvasNn: document.getElementById('canvas-nn') as HTMLCanvasElement,
  canvasGerstner: document.getElementById('canvas-gerstner') as HTMLCanvasElement,
  progressNn: document.getElementById('progress-nn'),
  progressGerstner: document.getElementById('progress-gerstner'),
  paletteNn: document.getElementById('palette-nn'),
  paletteGerstner: document.getElementById('palette-gerstner'),
  nnFactor: document.getElementById('nn-factor') as HTMLInputElement,
  nnColors: document.getElementById('nn-colors') as HTMLInputElement,
  nnSubmit: document.getElementById('nn-submit') as HTMLInputElement,
  gerstnerFactor: document.getElementById('gerstner-factor') as HTMLInputElement,
  gerstnerColors: document.getElementById('gerstner-colors') as HTMLInputElement,
  gerstnerSubmit: document.getElementById('gerstner-submit') as HTMLInputElement,
  uploadInput: document.getElementById('upload') as HTMLInputElement,
  submitTests: [1, 2, 3, 4, 5, 6].map(i => document.getElementById(`submit-test${i}`)),
}

export const setProgress = (node: HTMLElement, val: number) => {
  clearChildren(node)
  node.appendChild(document.createTextNode(`(Iteration: ${val})`))
}

export const clearChildren = (node: HTMLElement) => {
  while (node.firstChild) node.removeChild(node.firstChild)
}

export const fillPalette = (domPalette: HTMLElement, colors: Palette, paletteUsage: number[]) => {
  clearChildren(domPalette)
  const allUsage = paletteUsage.reduce((acc, x) => acc + x)
  const colorsWithUsage = colors.map((c, i) => c.concat(paletteUsage[i])).sort((a, b) => b[3] - a[3])
  colorsWithUsage.forEach(([r, g, b, u]) => {
    const node = document.createElement('div')
    node.title = u ? `Usage ${Math.floor(u / allUsage * 10000) / 100}%` : "This color wasn't used"
    node.className = u ? 'color' : 'unused color'
    node.style.background = `rgb(${[r, g, b]})`
    domPalette.appendChild(node)
  })
}
