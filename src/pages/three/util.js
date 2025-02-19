import { useEffect } from 'react'
import * as THREE from 'three'

export const useResizeHandler = ({ rendererRef, cameraRef, sceneRef }) => {
  useEffect(() => {
    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current) return

      const canvas = rendererRef.current.domElement
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      // 更新相机的纵横比
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()

      // 更新渲染器的尺寸
      rendererRef.current.setSize(width, height, false)
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }

    // 初始化时调用一次
    handleResize()

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
}

export const useThreeInit = ({ canvasRef, rendererRef, cameraRef, sceneRef }) => {
  useEffect(() => {
    // initThree
    const canvas = canvasRef.current
    rendererRef.current = new THREE.WebGLRenderer({ canvas })

    // 相机
    const aspect = canvas.clientWidth / canvas.clientHeight
    cameraRef.current = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    cameraRef.current.position.set(0, 0, 10)

    // 场景
    sceneRef.current = new THREE.Scene()

    // 设置渲染器尺寸
    rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight, false)

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(1, 1, 1).normalize()
    sceneRef.current.add(light)

    // cleanup
    return () => {
      const scene = sceneRef.current
      const renderer = rendererRef.current

      scene.traverse((object) => {
        // 处理几何体和材质
        if (object.geometry) {
          object.geometry.dispose()
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }

        // 处理光源的阴影贴图
        if (object.isLight && object.shadow && object.shadow.map) {
          object.shadow.map.dispose()
        }
      })
      scene.clear()
      renderer.dispose()
    }
  }, [])
}
