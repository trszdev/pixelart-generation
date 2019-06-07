import { Palette } from './types'


export const dom = {
  canvasOrig: document.getElementById('canvas-orig') as HTMLCanvasElement,
  canvasNn: document.getElementById('canvas-nn') as HTMLCanvasElement,
  canvasGerstner: document.getElementById('canvas-gerstner') as HTMLCanvasElement,
  progressNn: document.getElementById('progress-nn'),
  progressGerstner: document.getElementById('progress-gerstner'),
  paletteNn: document.getElementById('palette-nn'),
  paletteGerstner: document.getElementById('palette-gerstner') as HTMLInputElement,
  gifGerstner: document.getElementById('gerstner-gif') as HTMLInputElement,
  gifNn: document.getElementById('nn-gif') as HTMLInputElement,
  pngGerstner: document.getElementById('gerstner-png') as HTMLInputElement,
  pngNn: document.getElementById('nn-png') as HTMLInputElement,
  nnFactor: document.getElementById('nn-factor') as HTMLInputElement,
  nnColors: document.getElementById('nn-colors') as HTMLInputElement,
  nnSubmit: document.getElementById('nn-submit') as HTMLInputElement,
  gerstnerFactor: document.getElementById('gerstner-factor') as HTMLInputElement,
  gerstnerColors: document.getElementById('gerstner-colors') as HTMLInputElement,
  gerstnerSubmit: document.getElementById('gerstner-submit') as HTMLInputElement,
  uploadInput: document.getElementById('upload') as HTMLInputElement,
  submitTests: [...Array(12).keys()].map(i => document.getElementById(`submit-test${i + 1}`)),
}

export const saveAs = (url: string, name: string) => {
  const link = document.createElement('a')
  link.download = name
  link.href = url
  link.click()
}

export const setProgress = (node: HTMLElement, val: number) => {
  clearChildren(node)
  if (val) node.appendChild(document.createTextNode(`(Iteration: ${val})`))
}

export const clearChildren = (node: HTMLElement) => {
  while (node.firstChild) node.removeChild(node.firstChild)
}

export const fillPalette = (domPalette: HTMLElement, palette: Palette) => {
  clearChildren(domPalette)
  const paletteCopy = palette.map(x => x)
  const allUsage = paletteCopy.reduce((acc, x) => acc + x.timesUsed, 0)
  paletteCopy.forEach(({ timesUsed: u, color: [r, g, b] }) => {
    const node = document.createElement('div')
    node.title = u ? `Usage ${Math.floor(u / allUsage * 10000) / 100}%` : "This color wasn't used"
    node.className = u ? 'color' : 'unused color'
    node.style.background = `rgb(${[r, g, b]})`
    domPalette.appendChild(node)
  })
}

export class ButtonProcess {
  running: boolean
  btn: HTMLInputElement

  constructor(btn: HTMLInputElement, running = false) {
    this.running = running
    this.btn = btn
  }

  tryFreeButton(force = false): boolean {
    if (!force && this.running) return false
    this.running = false
    this.btn.value = 'Submit'
    this.btn.disabled = false
    return true
  }

  isCancelling(): boolean {
    if (this.running) {
      this.btn.disabled = true
      this.running = false
      
    } else {
      this.running = true
      this.btn.value = 'Cancel'
    }
    return !this.running
  }
}
