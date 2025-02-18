/* eslint-disable react/no-array-index-key */
// 深圳地图-场站-线条流动
import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import './index.less'

import {
  createBufferGeometry,
  createCylinder,
  createShaderMaterial,
  generateRandomRoutes,
  getAllStations,
  handleData,
  initGui,
  pointerMoveHandler,
  setupResizeHandler,
} from './util'

export default function Component() {
  const canvasRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const sceneRef = useRef(null)

  const lastCylindersRef = useRef([])
  const lastCurvesRef = useRef([])
  const lastPointsRef = useRef([])

  const acitveStationName = useRef('')
  const [allStationFlow, setAllStationFlow] = useState([]) // 所有站点流量

  const handleProj = d3.geoMercator().center([114.085947, 22.547]).scale(80000).translate([0, 0])

  const initStations = () => {
    const stations = getAllStations()
    setAllStationFlow(generateRandomRoutes(stations))
  }

  // 绘制城市
  const drawCity = (arr) => {
    if (sceneRef.current) {
      clearScene(true) // 清除之前的场景内容
    }

    const filterArr = arr
      .flat()
      .filter((value, index, self) => index === self.findIndex((item) => item.name === value.name))

    // 绘制柱状图
    const newCylinders = filterArr.map((ele) => createCylinder({ feature: ele, handleProj }))
    newCylinders.forEach((cylinder) => sceneRef.current.add(cylinder))
    lastCylindersRef.current = newCylinders

    if (acitveStationName.current) {
      const flowArr = arr.filter(
        (ele) => ele[0].name === acitveStationName.current || ele[1].name === acitveStationName.current
      )
      drawFlow(flowArr, newCylinders)
    }
  }

  // 绘制连接柱状体的线条
  const drawFlow = (flowArr, newCylinders) => {
    flowArr.forEach(([start, end]) => {
      const curve = createCurveForStation(start, end, newCylinders)
      if (curve) {
        sceneRef.current.add(curve)
        lastCurvesRef.current.push(curve)
        createAnimationForCurve(curve)
      }
    })
  }

  // 找到对应时间的红点
  const findRedPoint = (point, newCylinders) => {
    const cylinder = newCylinders.find((ele) => ele.name === point.name)
    if (!cylinder) return null

    // 找到柱状体上对应时间的红点
    return cylinder.children.find((child) => child.userData?.time === point.time)
  }

  // 创建贝塞尔曲线
  const createCurveForStation = (start, end, newCylinders) => {
    const startRedPoint = findRedPoint(start, newCylinders)
    const endRedPoint = findRedPoint(end, newCylinders)
    if (!startRedPoint || !endRedPoint) {
      console.error('未找到对应时间的点')
      return null
    }

    const startV = startRedPoint.getWorldPosition(new THREE.Vector3())
    const endV = endRedPoint.getWorldPosition(new THREE.Vector3())

    const v1 = new THREE.Vector3(startV.x + (endV.x - startV.x) / 4, startV.y + (endV.y - startV.y) / 4, startV.z + 50)
    const v2 = new THREE.Vector3(
      startV.x + ((endV.x - startV.x) * 3) / 4,
      startV.y + ((endV.y - startV.y) * 3) / 4,
      endV.z - 50
    )

    const color = start.staName === acitveStationName.current ? '#00f0af' : '#f000af'
    const curve = new THREE.CubicBezierCurve3(startV, v1, v2, endV)
    const tubeGeometry = new THREE.TubeGeometry(curve, 256, 2, 16, false)
    const material = new THREE.MeshBasicMaterial({ color })

    const mesh = new THREE.Mesh(tubeGeometry, material)
    // 为线条添加 userData，存储需要显示的文案信息
    mesh.userData = {
      type: 'line',
      info: `从 ${start.name}-${start.staName} ${start.time}点 到 ${end.name}-${end.staName} ${end.time}点`,
      changeColor: true,
      originColor: color,
      activeColor: '#00ff00',
    }
    return mesh
  }

  // 清除场景
  const clearScene = (clearCylinder = false) => {
    if (clearCylinder) {
      lastCylindersRef.current.forEach((cylinder) => sceneRef.current.remove(cylinder))
    }
    lastCurvesRef.current.forEach((curve) => sceneRef.current.remove(curve))
    lastPointsRef.current.forEach((point) => {
      sceneRef.current.remove(point)
      gsap.killTweensOf(point.material.uniforms.uTime) // 清除动画
    })

    if (clearCylinder) {
      lastCylindersRef.current = []
    }
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

  const pointerClickHandler = (scene, camera) => {
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    // 监听鼠标点击事件
    const onPointerClick = (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(pointer, camera)

      // 获取所有对象的交集
      const meshes = scene.children.filter((s) => s.type === 'Mesh' && s.userData?.type === 'cylinder')
      // 第二个参数为 false 只检查传入的对象数组中的对象,为true会检查传入对象及其所有子孙对象
      const intersects = raycaster.intersectObjects(meshes, false)
      if (intersects.length) {
        // 检测是否点击了 CylinderGeometry 类型的对象
        const clickedObject = intersects[0].object
        // 你可以在这里做任何事情，比如改变颜色、显示信息等
        const { staName } = clickedObject.userData

        if (staName) {
          // 先清除所有线条
          clearScene(false)
          // 清除所有颜色
          for (let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i]
            mesh.material.color.set(mesh.userData?.originColor)
            mesh.userData.isActive = false
          }
        }

        if (acitveStationName.current === staName) {
          acitveStationName.current = ''
          return
        }

        // 设置点击的Cylinder颜色
        clickedObject.userData.isActive = true
        clickedObject.material.color.set(clickedObject.userData?.activeColor)

        acitveStationName.current = staName
        const flowArr = allStationFlow.filter(
          (ele) => ele[0].staName === acitveStationName.current || ele[1].staName === acitveStationName.current
        )
        drawFlow(flowArr, meshes)
      }
    }

    window.addEventListener('click', onPointerClick)
    return () => window.removeEventListener('click', onPointerClick)
  }

  useEffect(() => {
    drawCity(allStationFlow)

    const cleanupPointerClickHandler = pointerClickHandler(sceneRef.current, cameraRef.current)
    return () => cleanupPointerClickHandler()
  }, [allStationFlow])

  // 初始化 Three.js 场景
  useEffect(() => {
    initStations()
    // 渲染器
    const canvas = canvasRef.current
    rendererRef.current = new THREE.WebGLRenderer({ canvas })
    rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight, false)

    // 相机
    cameraRef.current = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight, 0.01, 10000)
    cameraRef.current.position.set(0, -500, 500)

    // 场景
    sceneRef.current = new THREE.Scene()

    // 光线
    // const ambLight = new THREE.AmbientLight('#ffffff', 0.3)
    // const spotLight = new THREE.SpotLight(0xffffff)
    // spotLight.position.set(40, 200, 10)
    // spotLight.castShadow = true
    // sceneRef.current.add(ambLight, spotLight)

    // GUI
    const { gui, folder } = initGui()

    // 一开始相机从远处移动到近处
    gsap.fromTo(
      cameraRef.current.position, // 动画的对象
      {
        x: 2000,
        y: 2000,
        z: 5000,
      },
      {
        x: 0,
        y: -500,
        z: 500,
        duration: 5, // 动画持续时间 5秒
        ease: 'power2.out', // 动画缓动函数，类似于 Easing.Quadratic.Out
      }
    )
    // 处理地图数据
    handleData({ scene: sceneRef.current, gui, handleProj })

    // 轨道控制器
    const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement)
    controls.enableDamping = true

    // 辅助线
    const axesHelper = new THREE.AxesHelper(500)
    sceneRef.current.add(axesHelper)
    folder.add(axesHelper, 'visible').name('是否显示辅助线')

    // 动画循环
    rendererRef.current.setAnimationLoop(() => {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
      controls.update()
    })

    // 窗口调整事件
    const cleanupResizeHandler = setupResizeHandler(rendererRef.current, cameraRef.current)
    const cleanupPointerMoveHandler = pointerMoveHandler(sceneRef.current, cameraRef.current)

    return () => {
      cleanupResizeHandler()
      cleanupPointerMoveHandler()

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
      controls.dispose() // 销毁轨道控制器

      // 清理 GSAP 动画
      gsap.globalTimeline.clear() // 清除所有 GSAP 动画
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
      <div id="info" className="info" />
      <button className="btn" onClick={initStations}>
        点击我生成不同站点之间的线路
      </button>
      <div className="desc">
        <div>
          <span>生成</span>
          <span>{allStationFlow.length}</span>
          <span>条线段</span>
        </div>
        {allStationFlow.map((ele, index) => (
          <div key={index}>
            从{ele[0].staName} {ele[0].time}点 到{ele[1].staName} {ele[1].time}点
          </div>
        ))}
      </div>
    </>
  )
}
