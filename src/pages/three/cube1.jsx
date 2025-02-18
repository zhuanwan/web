// 立方体
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Component() {
  const canvasRef = useRef(null)

  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const sceneRef = useRef(null)

  const initThree = () => {
    // 渲染器
    const canvas = canvasRef.current
    rendererRef.current = new THREE.WebGLRenderer({ canvas })

    // 相机
    cameraRef.current = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    cameraRef.current.position.set(0, 0, 10) // 调整相机位置

    // 场景
    sceneRef.current = new THREE.Scene()

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(1, 1, 1).normalize()
    sceneRef.current.add(light)
  }

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

  const cleanup = () => {
    // 清理 Three.js 场景
    sceneRef.current.traverse((object) => {
      if (object.isMesh) {
        object.geometry.dispose() // 释放几何体
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose()) // 释放材质
          } else {
            object.material.dispose()
          }
        }
      }
    })
    sceneRef.current.clear() // 清空场景
    rendererRef.current.dispose() // 释放渲染器
  }

  useEffect(() => {
    initThree()
    createCube()
    return () => {
      cleanup()
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const canvas = rendererRef.current.domElement

      const width = canvas.clientWidth
      const height = canvas.clientHeight
      // 更新相机的纵横比
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      // 更新渲染器的尺寸
      rendererRef.current.setSize(width, height, false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
    </div>
  )
}
