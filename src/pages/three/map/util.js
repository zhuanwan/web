import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import szJson from './深圳市.json'

let font = null // 存储加载后的字体对象

export function initFont() {
  const fontLoader = new FontLoader()
  // 改成引用cdn地址https://zhuanwan.github.io/web/YouSheBiaoTiHei_Regular.json
  // 提前加载字体（建议在应用初始化时调用）
  return new Promise((resolve) => {
    fontLoader.load('https://zhuanwan.github.io/web/YouSheBiaoTiHei_Regular.json', (loadedFont) => {
      font = loadedFont // 加载完成后赋值
      resolve()
    })
  })
}

// 从 0 到 n 随机一个数
export function getRandomNumber(n) {
  return Math.floor(Math.random() * (n + 1))
}

// 从 0 到 n（包括 n）中随机选择两个不同的数
export function getRandomTwoNumbers(n) {
  const num1 = getRandomNumber(n) // 从 0 到 n 随机一个数
  let num2
  do {
    num2 = getRandomNumber(n) // 再随机选一个数
  } while (num1 === num2) // 确保两个数不同
  return [num1, num2]
}

// 获取所有站点
export function getAllStations() {
  return szJson.features.map((ele) => ({
    name: ele.properties.name,
    properties: { center: ele.properties.center },
  }))
}

// 生成随机线段
export const generateRandomRoutes = (allStations) => {
  const num0 = Math.floor(Math.random() * 7) // 生成 0-6 条线段
  const arr = []
  for (let i = 0; i < num0; i++) {
    const [num1, num2] = getRandomTwoNumbers(allStations.length - 1)
    arr.push([
      { ...allStations[num1], time: getRandomNumber(23), staName: `场站(${allStations[num1].name})` },
      { ...allStations[num2], time: getRandomNumber(23), staName: `场站(${allStations[num2].name})` },
    ])
  }

  return arr
}

export function initGui() {
  const gui = new GUI()
  const folder = gui.addFolder('系统设置')
  const eventObj = {
    Fullscreen() {
      // 全屏
      document.body.requestFullscreen()
      console.log('全屏')
    },
    ExitFullscreen() {
      // 退出全屏
      document.exitFullscreen()
      console.log('退出全屏')
    },
  }
  folder.add(eventObj, 'Fullscreen').name('全屏')
  folder.add(eventObj, 'ExitFullscreen').name('退出全屏')
  return { gui, folder }
}

const createText = ({ feature, handleProj }) => {
  if (!font) {
    return
  }
  if (feature.properties.name) {
    const [x_XYZ, y_XYZ] = handleProj(feature.properties.center)
    const geometry = new TextGeometry(`${feature.properties.name}`, {
      font,
      size: 14, // 字体大小
      depth: 0,
      curveSegments: 4,
    })
    const materials = new THREE.MeshBasicMaterial({
      color: 0xffffffff,
      transparent: true,
      opacity: 0.8,
    })
    const textMesh = new THREE.Mesh(geometry, materials)
    textMesh.position.set(x_XYZ, -y_XYZ, 50)
    return textMesh
  }
}

// 处理地图数据 GeoJson data
export const handleData = ({ scene, gui, handleProj }) => {
  const mapContainer = new THREE.Object3D() // 存储地图Object3D对象
  const feaureList = szJson.features

  feaureList.forEach((feature) => {
    const folder = gui.addFolder(`${feature.properties.name}板块`)

    // 每个feature都代表一个省/市/区
    const province = new THREE.Object3D()
    const { coordinates } = feature.geometry // 坐标信息
    if (feature.geometry.type === 'MultiPolygon') {
      coordinates.forEach((coord) => {
        coord.forEach((coordinate) => {
          // 三维多边形
          const extrudeMesh = createExtrudeMesh({ coordinate, handleProj, folder })
          // 线条
          const line = createLineMesh({ coordinate, handleProj, folder })
          // 添加文字信息
          const text = createText({ feature, handleProj })
          province.add(extrudeMesh, line, text)
        })
      })
    }
    if (feature.geometry.type === 'Polygon') {
      coordinates.forEach((coordinate) => {
        // 三维多边形
        const extrudeMesh = createExtrudeMesh({ coordinate, handleProj, folder })
        // 线条
        const line = createLineMesh({ coordinate, handleProj, folder })
        // 添加文字信息
        const text = createText({ feature, handleProj })
        province.add(extrudeMesh, line, text)
      })
    }
    mapContainer.add(province)
  })
  scene.add(mapContainer)
}

export function setupResizeHandler(renderer, camera) {
  const handleResize = () => {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    // 更新相机的纵横比
    camera.aspect = width / height
    camera.updateProjectionMatrix() // 更新相机投影矩阵

    // 更新渲染器的尺寸
    renderer.setSize(width, height, false)
  }

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}

export function pointerMoveHandler(scene, camera) {
  // 光线投射Raycaster
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  // 鼠标放上去 改变颜色 显示地区名字
  let lastChangeColorIntersects = [] // 上一次改变颜色的数据

  const onPointerMove = (event) => {
    const info = document.querySelector('#info')
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera)

    // 上一次改变颜色的数据 恢复原始颜色
    if (lastChangeColorIntersects.length) {
      for (let i = 0; i < lastChangeColorIntersects.length; i++) {
        const activeInsObj = lastChangeColorIntersects[i].object
        if (!activeInsObj.userData.isActive) {
          activeInsObj.material.color.set(activeInsObj.userData?.originColor)
        }
      }
    }

    // 计算物体和射线的焦点
    const obj3d = scene.children.filter((s) => s.type === 'Object3D')[0].children
    const meshes = scene.children.filter((s) => s.type === 'Mesh' && s.userData?.type)
    // 第二个参数为 false 只检查传入的对象数组中的对象,为true会检查传入对象及其所有子孙对象
    const intersects = raycaster.intersectObjects([...obj3d, ...meshes], true)

    info.style.display = 'none'
    lastChangeColorIntersects = []

    for (let i = 0; i < intersects.length; i++) {
      const element = intersects[i]
      if (element.object.userData?.changeColor) {
        element.object.material.color.set(element.object.userData?.activeColor)
        lastChangeColorIntersects.push(element)
      }
      if (element.object.userData?.info) {
        // 设置悬浮弹框的宽高
        info.style.left = `${event.clientX}px`
        info.style.top = `${event.clientY}px`
        info.style.display = 'block'
        info.innerHTML = element.object.userData.info
      }
    }
  }

  window.addEventListener('pointermove', onPointerMove)
  return () => window.removeEventListener('pointermove', onPointerMove)
}

// 创建bufferGeometry
export function createBufferGeometry(points) {
  const indexList = points.map((_, index) => index)
  const bufferGeometry = new THREE.BufferGeometry().setFromPoints(points)
  // 给几何体添加自定义的索引标识 用来后续根据索引设置点的透明度
  bufferGeometry.setAttribute('aIndex', new THREE.Float32BufferAttribute(indexList, 1))
  return bufferGeometry
}

// 创建着色器
export function createShaderMaterial() {
  // 起点颜色
  const color1 = '#0c57e3'
  return new THREE.ShaderMaterial({
    depthTest: false,
    uniforms: {
      // 线条颜色
      uColor: {
        value: new THREE.Color(color1),
      },
      // 时间1-1000
      uTime: {
        value: 0,
      },
      // 水滴宽度
      uWidth: {
        value: 200,
      },
      // 水滴长度
      uLength: {
        value: 80,
      },
      vSize: {
        value: 10.0,
      },
    },
    vertexShader: /* glsl */ `
        attribute float aIndex; // 内部属性 浮点 当前序号

        uniform float uTime; // 全局变量 浮点 当前时间

        uniform float uWidth; // 全局变量 浮点 线段宽度

        uniform vec3 uColor; // 全局变量 颜色 设置的颜色

        varying float vSize; // 片元变量 传递到片元着色器的水滴大小

        uniform float uLength; // 全局变量 浮点 线段长度

        void main(){
            vec4 viewPosition = viewMatrix * modelMatrix * vec4(position,1);

            gl_Position = projectionMatrix * viewPosition; // 顶点矩阵变换 设置各个点的位置

            // 当前顶点的位置处于线段长度内 则设置水滴大小
            if(aIndex >= uTime - uLength && aIndex < uTime){
              // 水滴大小根据当前位置慢慢变小
              // p1 uWidth越大水滴越粗
              // vSize = uWidth * ((aIndex - uTime + uLength) / uLength);
              // p2 uWidth越大水滴越细
              vSize = (aIndex + uLength - uTime) / (uWidth * 0.4); // 调整分母以增加点的大小
            }
            gl_PointSize = vSize * 4.0;
        }
      `,
    fragmentShader: /* glsl */ `
        varying float vSize;
        uniform vec3 uColor;
        void main(){
            // 透明度根据当前大小确定是否展示
            if(vSize<=0.0){
             // 如果水滴大小为零，完全透明
              gl_FragColor = vec4(1,0,0,0);
            }else{
              gl_FragColor = vec4(uColor,1);
            }
        }
      `,
    transparent: true,
    vertexColors: false,
  })
}

// 创建多边形
const createExtrudeMesh = ({ coordinate, handleProj, folder }) => {
  const shape = new THREE.Shape()
  coordinate.forEach(([x, y], index) => {
    const [x_XYZ, y_XYZ] = handleProj([x, y])
    index === 0 ? shape.moveTo(x_XYZ, -y_XYZ) : shape.lineTo(x_XYZ, -y_XYZ)
  })

  const geometry = new THREE.ExtrudeGeometry(shape, {
    steps: 2,
    depth: 16,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1,
  })

  const material = new THREE.MeshBasicMaterial({
    color: '#d13a34',
    transparent: true,
    opacity: 0.6,
  })

  folder
    .addColor(material, 'color')
    .name('背景颜色')
    .onChange((value) => material.color.set(value))
  folder.close()

  const mesh = new THREE.Mesh(geometry, material)
  mesh.userData = { type: 'extrude', changeColor: true, originColor: '#d13a34', activeColor: '#ff0000' }
  return mesh
}

// 创建线条
const createLineMesh = ({ coordinate, handleProj, folder }) => {
  const material = new THREE.LineBasicMaterial({ color: '#ffffff' })
  const points = coordinate.map((item) => {
    const [x_XYZ, y_XYZ] = handleProj(item)
    return new THREE.Vector3(x_XYZ, -y_XYZ, 25) // 统一处理坐标，确保一致性
  })

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  folder
    .addColor(material, 'color')
    .name('边线颜色')
    .onChange((value) => material.color.set(value))
  folder.close()

  return new THREE.Line(geometry, material)
}

// 创建柱体
export const createCylinder = ({ feature, handleProj }) => {
  const { name, staName } = feature
  const { center } = feature.properties

  if (!center) return null

  const [x_XYZ, y_XYZ] = handleProj(center)
  const geometry = new THREE.CylinderGeometry(10, 10, 240)
  const material = new THREE.MeshBasicMaterial({ color: '#0DEAF8', transparent: true, opacity: 0.8 })
  const cylinder = new THREE.Mesh(geometry, material)

  cylinder.position.set(x_XYZ, -y_XYZ, 150)
  cylinder.rotateX(Math.PI / 2)

  const points = Array.from({ length: 24 }, (_, i) => {
    const yPosition = (i / 23) * 240 - 120 // 从底部到顶部均匀分布，-height/2 使得圆柱体居中
    const angle = Math.PI / 2
    const x = 10 * Math.cos(angle)
    const z = 10 * Math.sin(angle)

    const sphereGeometry = new THREE.SphereGeometry(2, 16, 16)
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.userData = { time: i } // 为点添加 userData，存储时间信息

    // 设置球体的位置（相对于柱体的局部坐标系）
    sphere.position.set(x, yPosition, z)
    return sphere
  })

  points.forEach((point) => cylinder.add(point))
  cylinder.name = name
  cylinder.userData = {
    type: 'cylinder',
    info: `${staName}`,
    staName: `${staName}`,
    changeColor: true,
    originColor: '#0DEAF8',
    activeColor: '#00a8F8',
  }
  return cylinder
}
