import { dom, fillPalette, setProgress } from './dom'
import { NaiveSolution } from './naive'


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

dom.nnSubmit.onclick = async () => {
  dom.nnSubmit.disabled = true
  const { width, height } = dom.canvasOrig
  dom.canvasNn.width = width
  dom.canvasNn.height = height
  dom.canvasNn.getContext('2d').clearRect(0, 0, width, height)
  const imageData = dom.canvasOrig.getContext('2d').getImageData(0, 0, width, height)
  const ns = new NaiveSolution(dom.nnColors.valueAsNumber, dom.nnFactor.valueAsNumber, dom.canvasNn, imageData)
  const onProgress = (e: CustomEvent) => setProgress(dom.progressNn, e.detail)
  const onPalette = ({ detail: { palette, paletteUsage } }: CustomEvent) => fillPalette(dom.paletteNn, palette, paletteUsage)
  ns.events.addEventListener('progress', onProgress)
  ns.events.addEventListener('palette', onPalette)
  await ns.kMeans()
  ns.events.removeEventListener('progress', onProgress)
  ns.events.removeEventListener('palette', onPalette)
  dom.nnSubmit.disabled = false
}

dom.gerstnerSubmit.onclick = async () => {
  dom.gerstnerSubmit.disabled = true
  dom.gerstnerSubmit.disabled = false
}
