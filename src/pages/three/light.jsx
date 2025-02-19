// 光线-阴影
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

import { useResizeHandler, useThreeInit } from './util'

export default function Component() {
  const canvasRef = useRef(null)

  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const sceneRef = useRef(null)

  const createObject = () => {
    // 1. 首先开启渲染器的阴影
    rendererRef.current.shadowMap.enabled = true
    rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap // 使用更柔和的阴影

    // 创建一个悬浮的球体（只投射阴影）
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    )
    sphere.position.y = 2
    sphere.castShadow = true // 球体投射阴影
    sphere.receiveShadow = false // 球体不接收阴影
    sceneRef.current.add(sphere)

    // 创建一个地面（只接收阴影）
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0x886286 }))
    ground.rotation.x = -Math.PI / 2
    ground.castShadow = false // 地面不投射阴影
    ground.receiveShadow = true // 地面接收阴影
    sceneRef.current.add(ground)

    // 创建一个盒子（既投射又接收阴影）
    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x00ff00 }))
    box.castShadow = true // 盒子投射阴影
    box.receiveShadow = true // 盒子也接收阴影
    sceneRef.current.add(box)

    const light = sceneRef.current.children?.find((child) => child.type === 'DirectionalLight')
    // 2. 光源开启阴影
    if (light) {
      light.castShadow = true
    }
  }

  // 8. 添加动画循环以持续渲染
  const animate = () => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
    requestAnimationFrame(animate)
  }

  // 初始化 Three.js
  useThreeInit({ canvasRef, rendererRef, cameraRef, sceneRef })

  // resize handler
  useResizeHandler({ rendererRef, cameraRef, sceneRef })

  // 创建线条
  useEffect(() => {
    createObject()
    animate()
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
    </div>
  )
}
