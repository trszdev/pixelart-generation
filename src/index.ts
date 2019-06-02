import { dom, fillPalette, setProgress, ButtonProcess } from './dom'
import NaivePixelArt from './naive'
import WrappedHtmlCanvas from './canvas'
import { AnimationFrameReleaser } from './releaser'



const releaser = new AnimationFrameReleaser()

const setImage = (url: string, needRevoke = false) => {
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
  'samples/vasilii.jpg',
  'samples/sonic.png',
  'samples/lenna.jpg',
  'samples/teapot.png',
  'samples/gradient.jpg',
  'samples/lily.jpg'
][i]))


const nnProcess = new ButtonProcess(dom.nnSubmit)
dom.nnSubmit.onclick = async () => {
  if (nnProcess.isCancelling()) return
  dom.canvasNn.width = dom.canvasOrig.width
  dom.canvasNn.height = dom.canvasOrig.height
  const canvas = new WrappedHtmlCanvas(dom.canvasNn)
  const pixels = (new WrappedHtmlCanvas(dom.canvasOrig)).getPixels()
  const ns = NaivePixelArt.fromRandomPalette(dom.nnColors.valueAsNumber, dom.nnFactor.valueAsNumber, releaser, pixels)
  for (let i = 1; !ns.hasCompleted(); i++) {
    await ns.iterate()
    if (nnProcess.tryFreeButton()) return
    const palette = await ns.draw(canvas)
    setProgress(dom.progressNn, i)
    fillPalette(dom.paletteNn, palette)
    if (nnProcess.tryFreeButton()) return
  }
  nnProcess.tryFreeButton(true)
}

const gerstnerProcess = new ButtonProcess(dom.gerstnerSubmit)
dom.gerstnerSubmit.onclick = async () => {
  if (gerstnerProcess.isCancelling()) return
  dom.canvasGerstner.width = dom.canvasOrig.width
  dom.canvasGerstner.height = dom.canvasOrig.height
  const canvas = new WrappedHtmlCanvas(dom.canvasGerstner)
  const pixels = (new WrappedHtmlCanvas(dom.canvasOrig)).getPixels()
  const ns = NaivePixelArt.fromRandomPalette(dom.gerstnerColors.valueAsNumber, dom.gerstnerFactor.valueAsNumber, releaser, pixels)
  for (let i = 1; !ns.hasCompleted(); i++) {
    await ns.iterate()
    if (gerstnerProcess.tryFreeButton()) return
    const palette = await ns.draw(canvas)
    setProgress(dom.progressGerstner, i)
    fillPalette(dom.paletteGerstner, palette)
    if (gerstnerProcess.tryFreeButton()) return
  }
  gerstnerProcess.tryFreeButton(true)
}
