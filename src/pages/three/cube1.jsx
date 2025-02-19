// 立方体
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

import { useResizeHandler, useThreeInit } from './util'

export default function Component() {
  const canvasRef = useRef(null)

  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const sceneRef = useRef(null)

  const createCube = () => {
    // 材质（需要让立方体能够反射光，所以不使用MeshBasicMaterial，而用MeshPhongMaterial）
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff88 })
    // 立方体
    const geometry = new THREE.BoxGeometry(3, 3, 3) // 增大立方体的尺寸

    // Mesh网格
    const cube1 = new THREE.Mesh(geometry, material)
    cube1.position.x = -6
    sceneRef.current.add(cube1)

    const cube2 = new THREE.Mesh(geometry, material)
    sceneRef.current.add(cube2)

    const cube3 = new THREE.Mesh(geometry, material)
    cube3.position.x = 6
    sceneRef.current.add(cube3)

    const cubs = [cube1, cube2, cube3]

    // 动画函数
    rendererRef.current.setAnimationLoop(() => {
      // 旋转立方体
      cubs.forEach((cube) => {
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
      })

      rendererRef.current.render(sceneRef.current, cameraRef.current)
    })
  }

  // 初始化 Three.js
  useThreeInit({ canvasRef, rendererRef, cameraRef, sceneRef })

  // resize handler
  useResizeHandler({ rendererRef, cameraRef, sceneRef })

  // 创建线条
  useEffect(() => {
    createCube()
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
    </div>
  )
}
