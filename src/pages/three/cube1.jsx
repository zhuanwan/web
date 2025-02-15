// 立方体
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Component() {
  const canvasRef = useRef(null)

  const draw = () => {
    // 渲染器
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current })
    renderer.setSize(1000, 1000) // 设置渲染器的大小

    // 相机
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.set(0, 0, 10) // 调整相机位置

    // 场景
    const scene = new THREE.Scene()

    // 材质（需要让立方体能够反射光，所以不使用MeshBasicMaterial，而用MeshPhongMaterial）
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff88 })

    // 立方体
    const geometry = new THREE.BoxGeometry(3, 3, 3) // 增大立方体的尺寸

    // Mesh网格
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(1, 1, 1).normalize()
    scene.add(light)

    // 动画函数
    const animate = () => {
      requestAnimationFrame(animate)

      // 旋转立方体
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      renderer.render(scene, camera)
    }

    animate()
  }

  useEffect(() => {
    draw()
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: 1000, height: 1000 }} />
    </div>
  )
}
