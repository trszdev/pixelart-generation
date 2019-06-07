import { dom, fillPalette, setProgress, ButtonProcess, saveAs } from './dom'
import NaivePixelArt from './naive'
import WrappedHtmlCanvas from './canvas'
import { AnimationFrameReleaser } from './releaser'
import GerstnerPixelArt from './gerstner'
import getMaxEigenWrapper from './jsfeat'
import { PixelArtAlgorithm } from './types'


declare const GIF

const releaser = new AnimationFrameReleaser()

let token = null

const setImage = (url: string, needRevoke = false) => {
  token = Math.random().toString(16).substr(2)
  const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('#uploads > input')
  for (let i = 0; i < inputs.length; i++) inputs.item(i).disabled = true
  const img = new Image()
  img.onload = function() {
    const canvas = dom.canvasOrig
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx.clearRect(0, 0, img.width, img.height)
    ctx.drawImage(img, 0, 0)
    if (needRevoke) URL.revokeObjectURL(url)
    for (let i = 0; i < inputs.length; i++) inputs.item(i).disabled = false
    dom.nnSubmit.disabled = false
    dom.gerstnerSubmit.disabled = false
  }
  img.src = url
}

dom.uploadInput.onchange = (e: Event) => {
  const url = URL.createObjectURL((<HTMLInputElement>e.target).files[0])
  setImage(url, true)
}

dom.submitTests.forEach((inp, i) => inp.onclick = setImage.bind(0, [
  'samples/beard.jpg',
  'samples/crash.png',
  'samples/crowd.png',
  'samples/dali.jpg',
  'samples/fireman.jpg',
  'samples/gradient.jpg',
  'samples/gradient2.png',
  'samples/lenna.jpg',
  'samples/lily.jpg',
  'samples/mgs.png',
  'samples/shaving.jpg',
  'samples/vasilii.jpg',
][i]))


const savePng = async (canvas: WrappedHtmlCanvas, pixelArt: PixelArtAlgorithm, pixelSize: number, token: string) => {
  const c = document.createElement('canvas')
  c.width = Math.ceil(canvas.getWidth() / pixelSize)
  c.height = Math.ceil(canvas.getHeight() / pixelSize)
  await pixelArt.drawRealSized(new WrappedHtmlCanvas(c))
  saveAs(c.toDataURL('image/png'), `${token}.png`)
}

const createGif = () => new GIF({ workerScript: 'lib/gif.worker.js' })

const nnProcess = new ButtonProcess(dom.nnSubmit)
dom.nnSubmit.onclick = async () => {
  if (nnProcess.isCancelling()) return
  const token2 = token
  dom.gifNn.disabled = true
  dom.pngNn.disabled = true
  setProgress(dom.progressNn, 0)
  fillPalette(dom.paletteNn, [])
  dom.canvasNn.width = dom.canvasOrig.width
  dom.canvasNn.height = dom.canvasOrig.height
  const canvas = new WrappedHtmlCanvas(dom.canvasNn)
  const pixels = (new WrappedHtmlCanvas(dom.canvasOrig)).getPixels()
  const nn = NaivePixelArt.fromRandomPalette(dom.nnColors.valueAsNumber, dom.nnFactor.valueAsNumber, releaser, pixels)
  const gif = createGif()
  for (let i = 1; !nn.hasCompleted(); i++) {
    await nn.iterate()
    if (nnProcess.tryFreeButton()) return
    const palette = await nn.draw(canvas)
    gif.addFrame(dom.canvasNn, { delay: nn.hasCompleted() ? 3000 : 30, copy: true })
    setProgress(dom.progressNn, i)
    fillPalette(dom.paletteNn, palette)
    if (nnProcess.tryFreeButton()) return
  }
  let blob = null
  nnProcess.tryFreeButton(true)
  dom.gifNn.disabled = false
  dom.pngNn.disabled = false
  dom.pngNn.onclick = async () => savePng(canvas, nn, nn.pixelSize, token2)
  dom.gifNn.onclick = async () => {
    if (!blob) {
      gif.render()
      blob = await new Promise(res => gif.on('finished', res))
    }
    saveAs(URL.createObjectURL(blob), `${token2}.gif`)
  }
}

const gerstnerProcess = new ButtonProcess(dom.gerstnerSubmit)
dom.gerstnerSubmit.onclick = async () => {
  if (gerstnerProcess.isCancelling()) return
  const token2 = token + '_gerstner'
  dom.gifGerstner.disabled = true
  dom.pngGerstner.disabled = true
  setProgress(dom.progressGerstner, 0)
  fillPalette(dom.paletteGerstner, [])
  dom.canvasGerstner.width = dom.canvasOrig.width
  dom.canvasGerstner.height = dom.canvasOrig.height
  const canvas = new WrappedHtmlCanvas(dom.canvasGerstner)
  const pixels = (new WrappedHtmlCanvas(dom.canvasOrig)).getPixels()
  const gerstner = await GerstnerPixelArt.fromImage(pixels, dom.gerstnerFactor.valueAsNumber,
    dom.gerstnerColors.valueAsNumber, releaser, getMaxEigenWrapper)
  const gif = createGif()
  for (let i = 1; !gerstner.hasCompleted(); i++) {
    await gerstner.iterate()
    if (gerstnerProcess.tryFreeButton()) return
    const palette = await gerstner.draw(canvas)
    gif.addFrame(dom.canvasGerstner, { delay: gerstner.hasCompleted() ? 3000 : 30, copy: true })
    setProgress(dom.progressGerstner, i)
    fillPalette(dom.paletteGerstner, palette)
    if (gerstnerProcess.tryFreeButton()) return
  }
  let blob = null
  gerstnerProcess.tryFreeButton(true)
  dom.gifGerstner.disabled = false
  dom.pngGerstner.disabled = false
  dom.pngGerstner.onclick = async () => savePng(canvas, gerstner, gerstner.pixelSize, token2)
  dom.gifGerstner.onclick = async () => {
    if (!blob) {
      gif.render()
      blob = await new Promise(res => gif.on('finished', res))
    }
    saveAs(URL.createObjectURL(blob), `${token2}.gif`)
  }
}
