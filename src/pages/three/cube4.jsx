// 立方体-鼠标点击查找相交点
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

import { useResizeHandler, useThreeInit } from './util'

export default function Component() {
  const canvasRef = useRef(null)

  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const sceneRef = useRef(null)

  const createCube = () => {
    const parent = new THREE.Object3D()
    sceneRef.current.add(parent)

    // pivot：轨道 / 关节
    const pivot = new THREE.Object3D()
    parent.add(pivot)

    // child：模型
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshStandardMaterial({ color: 0xff5555 })
    const child = new THREE.Mesh(geometry, material)

    // ⚠️ 关键：child 偏离 pivot 原点
    child.position.x = 5
    pivot.add(child)

    // ========== 可视化辅助（非常重要） ==========
    parent.add(new THREE.AxesHelper(6)) // 绿色：parent
    pivot.add(new THREE.AxesHelper(4)) // 黄色：pivot
    child.add(new THREE.AxesHelper(3)) // 红色：child

    // 动画函数
    rendererRef.current.setAnimationLoop(() => {
      // 1️⃣ parent：整体旋转
      parent.rotation.y += 0.005

      // 2️⃣ pivot：轨道旋转
      pivot.rotation.y += 0.02

      // 固定pivot绕世界Y轴旋转
      // 注意：这不是局部旋转，而是相对于世界坐标系
      // pivot.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.02)

      // 3️⃣ child：自身自转
      child.rotation.y += 0.05

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
