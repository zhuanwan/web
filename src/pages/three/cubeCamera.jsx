// 立方体相机
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import quarry_01_1kHdr from '@/pages/three/textures/equirectangular/quarry_01_1k.hdr'

import { useResizeHandler, useThreeInit } from './util'

export default function Component() {
  const canvasRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const sceneRef = useRef(null)

  const createObject = () => {
    rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping

    // 修改立方体贴图渲染目标的设置
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256)
    // cubeRenderTarget.texture.type = THREE.HalfFloatType
    const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget)

    // 创建球体
    const material = new THREE.MeshStandardMaterial({
      envMap: cubeRenderTarget.texture,
      roughness: 0.05,
      metalness: 1,
    })
    const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(15, 8), material)
    sceneRef.current.add(sphere)

    const material2 = new THREE.MeshStandardMaterial({
      roughness: 0.1,
      metalness: 0,
    })

    const cube = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 15), material2)
    sceneRef.current.add(cube)

    const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(8, 3, 128, 16), material2)
    sceneRef.current.add(torus)

    const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement)
    controls.autoRotate = true
    // 渲染循环
    function animate(msTime) {
      const time = msTime / 1000

      cube.position.x = Math.cos(time) * 30
      cube.position.y = Math.sin(time) * 30
      cube.position.z = Math.sin(time) * 30

      cube.rotation.x += 0.02
      cube.rotation.y += 0.03

      torus.position.x = Math.cos(time + 10) * 30
      torus.position.y = Math.sin(time + 10) * 30
      torus.position.z = Math.sin(time + 10) * 30

      torus.rotation.x += 0.02
      torus.rotation.y += 0.03

      cubeCamera.update(rendererRef.current, sceneRef.current)

      controls.update()
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
    rendererRef.current.setAnimationLoop(animate)
  }

  // 初始化 Three.js
  useThreeInit({ canvasRef, rendererRef, cameraRef, sceneRef })

  // resize handler
  useResizeHandler({ rendererRef, cameraRef, sceneRef })

  useEffect(() => {
    new RGBELoader().load(quarry_01_1kHdr, function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping

      sceneRef.current.background = texture
      sceneRef.current.environment = texture
    })

    cameraRef.current.position.z = 70

    createObject()
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
    </div>
  )
}
