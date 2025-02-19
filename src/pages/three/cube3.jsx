// 立方体-关键帧动画
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

import { useResizeHandler, useThreeInit } from './util'

export default function Component() {
  const canvasRef = useRef(null)

  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const sceneRef = useRef(null)

  const createCube = () => {
    // 创建一个立方体
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const box = new THREE.Mesh(geometry, material)
    sceneRef.current.add(box)

    // 定义关键帧
    const positionKF = new THREE.KeyframeTrack(
      '.position', // 目标属性路径
      [0, 1, 2], // 时间点
      [0, 0, 0, 10, 0, 0, 0, 0, 0] // 关键帧数据
    )

    // 创建动画剪辑
    const clip = new THREE.AnimationClip('moveBox', 2, [positionKF])

    // 创建动画混合器
    const mixer = new THREE.AnimationMixer(box)

    // 创建动画动作并播放
    const action = mixer.clipAction(clip)
    action.play()

    // 渲染循环
    const clock = new THREE.Clock()
    function animate() {
      requestAnimationFrame(animate)
      const delta = clock.getDelta()
      mixer.update(delta) // 更新动画
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
    animate()
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
