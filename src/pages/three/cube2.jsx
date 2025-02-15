// 立方体，窗口变化
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Component() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // 渲染器
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current })

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
    const cube1 = new THREE.Mesh(geometry, material)
    cube1.position.x = -6
    scene.add(cube1)

    const cube2 = new THREE.Mesh(geometry, material)
    scene.add(cube2)

    const cube3 = new THREE.Mesh(geometry, material)
    cube3.position.x = 6
    scene.add(cube3)

    const cubs = [cube1, cube2, cube3]

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(1, 1, 1).normalize()
    scene.add(light)

    // 动画函数
    const animate = () => {
      requestAnimationFrame(animate)

      // 旋转立方体
      cubs.forEach((cube) => {
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
      })

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()

      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
}
