// 立方体
import React, { useEffect, useRef } from 'react'
import { Button } from 'antd'
import * as THREE from 'three'

import { useResizeHandler, useThreeInit } from './util'

export default function Component() {
  const canvasRef = useRef(null)

  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const sceneRef = useRef(null)

  const createLine = () => {
    const MAX_POINTS = 500

    // geometry
    const geometry = new THREE.BufferGeometry()
    // material 使用LineBasicMaterial 适合绘制 线段
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 })

    // attributes
    const positions = new Float32Array(MAX_POINTS * 3) // 3 floats (x, y and z) per point
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // draw range
    const drawCount = 2 // draw the first 2 points, only
    geometry.setDrawRange(0, drawCount)

    // line
    const line = new THREE.Line(geometry, material)
    sceneRef.current.add(line)

    randomLine()
  }

  const randomLine = () => {
    const line = sceneRef.current.children.find((child) => child.type === 'Line')
    if (!line) {
      return
    }
    const positionAttribute = line.geometry.getAttribute('position')

    const positions = positionAttribute.array
    let x = 0
    let y = 0
    const z = 0

    // 更新位置
    for (let i = 0; i < positionAttribute.count; i++) {
      positions[i] = x
      positions[i + 1] = y
      positions[i + 2] = z
      x += (Math.random() - 0.5) * 20
      y += (Math.random() - 0.5) * 20
    }

    positionAttribute.needsUpdate = true
    rendererRef.current.render(sceneRef.current, cameraRef.current)
  }

  // 初始化 Three.js
  useThreeInit({ canvasRef, rendererRef, cameraRef, sceneRef })

  // resize handler
  useResizeHandler({ rendererRef, cameraRef, sceneRef })

  // 创建线条
  useEffect(() => {
    createLine()
  }, [])

  return (
    <div>
      <Button onClick={randomLine} style={{ position: 'absolute', top: 0, left: 0 }}>
        随机线条
      </Button>
      <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
    </div>
  )
}
