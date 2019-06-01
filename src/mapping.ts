import { scaledLab2rgb } from './util'
import { RgbColor } from './types'
import { AnimationFrameReleaser } from './releaser'


const releaser = new AnimationFrameReleaser()
let rx = 0
let ry = 0
const cubes = Array.from(document.querySelectorAll('.cube')) as HTMLElement[]


const mouseMove = (e: MouseEvent) => {
  rx = rx + e.movementX * 0.8
  ry = ry + e.movementY * 0.8
  cubes.forEach(x => x.setAttribute('style', `transform: rotateX(${-ry}deg) rotateY(${rx}deg)`))
}

const fillFace = (canvas: HTMLCanvasElement,
  vectorFunc: (x: number, y: number) => RgbColor, mapFunc = scaledLab2rgb) => {
  const ctx = canvas.getContext('2d')
  for (let j = 0; j < 255; j++) {
    for (let i = 0; i < 255; i++) {
      ctx.fillStyle = `rgb(${mapFunc(vectorFunc(i, j))})`
      ctx.fillRect(i, j, 1, 1)
    }
  }
  return canvas
}

const fillFaces = async (canvases: HTMLCanvasElement[], mapFunc = scaledLab2rgb) => {
  fillFace(canvases[0], (x, y) => [255, 255 - x, y], mapFunc) // front
  await releaser.release()
  fillFace(canvases[1], (x, y) => [0, x, y], mapFunc) // back
  await releaser.release()
  fillFace(canvases[2], (x, y) => [255 - y, 255 - x, 0], mapFunc) // top
  await releaser.release()
  fillFace(canvases[3], (x, y) => [y, 255 - x, 255], mapFunc) // bottom
  await releaser.release()
  fillFace(canvases[4], (x, y) => [x, 255, y], mapFunc) // left
  await releaser.release()
  fillFace(canvases[5], (x, y) => [255 - x, 0, y], mapFunc) // right
}

const rgbCanvases = Array.from(document.getElementById('rgb').children) as HTMLCanvasElement[]
const labCanvases = Array.from(document.getElementById('lab').children) as HTMLCanvasElement[]
const tds = Array.from(document.querySelectorAll('td'))

tds[2].onmousemove = mouseMove
tds[3].onmousemove = mouseMove

Promise
  .all([fillFaces(rgbCanvases, x => x), fillFaces(labCanvases)])
  .catch(console.error)
