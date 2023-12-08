import { useEffect } from 'react'
import { fabric } from 'fabric'

import { initFabric } from './fabricDraw'

export const debounce = (fn, delay = 500) => {
  let timer
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

let target
let fabricCanvas
let data
let cb

function resize() {
  if (!target.firstChild) {
    return
  }
  target.firstChild.style.display = 'none'
  const { clientWidth, clientHeight } = target
  initFabric(fabricCanvas, clientWidth, clientHeight - 4, data, cb)
  target.firstChild.style.display = 'block'
}

export function chartConfig(root, ajaxData, callback) {
  if (!root || !ajaxData) {
    return false
  }
  data = ajaxData
  target = root
  cb = callback

  if (!fabricCanvas) {
    const createDiv = document.createElement('div')
    const createCanvas = document.createElement('canvas')
    createDiv.append(createCanvas)
    target.appendChild(createDiv)
    fabricCanvas = new fabric.Canvas(createCanvas)
  }

  resize()
  return fabricCanvas
}

export function useChart() {
  const debounceResize = debounce(resize, 200)
  useEffect(() => {
    window.addEventListener('resize', debounceResize)
    return () => {
      window.removeEventListener('resize', debounceResize)
      target = null
      fabricCanvas = null
      data = null
      cb = null
    }
  }, [])
}
