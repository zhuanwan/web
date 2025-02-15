import React, { useEffect, useRef, useState } from 'react'
import { Easing, Tween } from '@tweenjs/tween.js'
import * as d3 from 'd3'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import './index.less'

import {
  createBufferGeometry,
  createCylinder,
  createShaderMaterial,
  getRandomNumber,
  getRandomTwoNumbers,
  handleData,
  initGui,
  pointerMoveHandler,
  setupResizeHandler,
} from './util'
import szJson from './深圳市.json'

export default function Component() {
  const canvasRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const sceneRef = useRef(null)
  const lastCylindersRef = useRef([])
  const lastCurvesRef = useRef([])
  const lastPointsRef = useRef([])

  let areaPointArr = []
  let areaPointArrLen = 0
  const handleProj = d3.geoMercator().center([114.085947, 22.547]).scale(80000).translate([0, 0])

  // 初始化城市
  const initCity = () => {
    areaPointArr = szJson.features.map((ele) => {
      return { name: ele.properties.name, properties: { center: ele.properties.center } }
    })
    areaPointArrLen = areaPointArr.length
  }

  // 生成线段
  const randomCity = () => {
    const num0 = Math.floor(Math.random() * (6 + 1))
    const arr = []
    for (let i = 0; i < num0; i++) {
      const [num1, num2] = getRandomTwoNumbers(areaPointArrLen - 1)
      arr.push([
        { ...areaPointArr[num1], time: getRandomNumber(23) },
        { ...areaPointArr[num2], time: getRandomNumber(23) },
      ])
    }

    const str = `<div>生成${num0}条线段</div>${arr
      .map((ele) => `<div>从${ele[0].name} ${ele[0].time}点 到${ele[1].name} ${ele[1].time}点</div>`)
      .join('')}`
    document.getElementById('desc').innerHTML = str
    drawCity(arr)
  }

  // 画城市
  const drawCity = (arr) => {
    if (sceneRef.current) {
      clearScene()
    }

    const filterArr = arr
      .flat()
      .filter((value, index, self) => index === self.findIndex((item) => item.name === value.name))

    // 画柱状图
    const newCylinders = filterArr.map((ele) => {
      return createCylinder({ feature: ele, handleProj })
    })
    newCylinders.forEach((cylinder) => sceneRef.current.add(cylinder))

    lastCylindersRef.current = newCylinders

    // 画连接柱状体的线条
    arr.forEach(([start, end]) => {
      const curve = createCurveForCity(start, end, newCylinders)
      sceneRef.current.add(curve)
      lastCurvesRef.current.push(curve)
      createAnimationForCurve(curve)
    })
  }

  // 找到时间点
  const findRedPoint = (point, newCylinders) => {
    const cylinder = newCylinders.find((ele) => ele.name === point.name)
    // 找到柱状体上对应时间的红点
    let p = null
    cylinder.children.forEach((child) => {
      if (child.userData && child.userData.time === point.time) {
        p = child
      }
    })
    return p
  }

  // 创建贝塞尔曲线
  const createCurveForCity = (start, end, newCylinders) => {
    const startRedPoint = findRedPoint(start, newCylinders)
    const endRedPoint = findRedPoint(end, newCylinders)
    if (!startRedPoint || !endRedPoint) {
      console.error('未找到对应时间的点')
      return
    }

    const startCenter = start.properties.center
    const endCenter = end.properties.center

    const startV = startRedPoint.getWorldPosition(new THREE.Vector3())
    const endV = endRedPoint.getWorldPosition(new THREE.Vector3())

    const v1 = new THREE.Vector3(startCenter[0], -startCenter[1], 100)
    const v2 = new THREE.Vector3(endCenter[0], -endCenter[1], 100)

    const curve = new THREE.CubicBezierCurve3(startV, v1, v2, endV)
    const tubeGeometry = new THREE.TubeGeometry(curve, 256, 1, 8, false)
    const material = new THREE.MeshBasicMaterial({ color: '#ffffff' })
    return new THREE.Mesh(tubeGeometry, material)
  }

  // 清理场景
  const clearScene = () => {
    lastCylindersRef.current.forEach((cylinder) => sceneRef.current.remove(cylinder))
    lastCurvesRef.current.forEach((curve) => sceneRef.current.remove(curve))
    lastPointsRef.current.forEach((point) => sceneRef.current.remove(point))

    lastCylindersRef.current = []
    lastCurvesRef.current = []
    lastPointsRef.current = []
  }

  // 为曲线创建动画
  const createAnimationForCurve = (curve) => {
    const points = curve.geometry.parameters.path.getPoints(1000)
    const bufferGeometry = createBufferGeometry(points)
    const shaderMaterial = createShaderMaterial()
    const point = new THREE.Points(bufferGeometry, shaderMaterial)
    sceneRef.current.add(point)
    lastPointsRef.current.push(point)

    gsap.fromTo(
      shaderMaterial.uniforms.uTime,
      { value: 0 },
      {
        value: 80 + 1000,
        duration: 3,
        repeat: -1,
        ease: 'none',
      }
    )
  }

  useEffect(() => {
    initCity()
    // 渲染器
    const canvas = canvasRef.current
    rendererRef.current = new THREE.WebGLRenderer({ canvas })
    rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight, false)

    // 相机
    cameraRef.current = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight, 0.01, 10000)
    cameraRef.current.position.z = 1000
    cameraRef.current.position.x = 0
    cameraRef.current.position.y = -500

    // 场景
    sceneRef.current = new THREE.Scene()

    // 光线
    const ambLight = new THREE.AmbientLight('#ffffff', 0.3)
    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(40, 200, 10)
    spotLight.castShadow = true
    sceneRef.current.add(ambLight, spotLight)

    // gui
    const { gui, folder } = initGui()

    // 创建相机动画
    const tween = new Tween({ x: 2000, y: 2000, z: 3000 })
      .to(cameraRef.current.position, 5000)
      .easing(Easing.Quadratic.Out)
      .onUpdate((object) => {
        cameraRef.current.position.set(object.x, object.y, object.z)
      })
      .start()

    // 处理地图数据
    handleData({ scene: sceneRef.current, gui, handleProj })

    // 设置相机轨道控制器
    const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement)
    controls.enableDamping = true

    // 添加辅助线
    const axesHelper = new THREE.AxesHelper(500)
    sceneRef.current.add(axesHelper)

    folder.add(axesHelper, 'visible').name('是否显示辅助线')

    // 动画函数
    const animate = () => {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
      requestAnimationFrame(animate)
      tween.update()
      controls.update()
    }

    animate()

    // 设置窗口调整事件
    const cleanupResizeHandler = setupResizeHandler(rendererRef.current, cameraRef.current)
    const tooltipHandler = pointerMoveHandler(sceneRef.current, cameraRef.current)

    return () => {
      cleanupResizeHandler()
      tooltipHandler()
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
      <div id="info" className="info" />
      <button className="btn" onClick={randomCity}>
        点击我生成不同线段
      </button>
      <div id="desc" className="desc" />
    </>
  )
}
