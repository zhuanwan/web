import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import fontJson from './YouSheBiaoTiHei_Regular.json'
import szJson from './深圳市.json'

const fontLoad = new FontLoader()
const font = fontLoad.parse(fontJson)

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
    province.name = feature.properties.name
    mapContainer.name = feature.properties.name
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
  let activeIntersects = [] // 鼠标滑过数据
  const onPointerMove = (event) => {
    const info = document.querySelector('#info')
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera)

    // 判断数组是否有数据，有数据全部设置为原始数据
    if (activeIntersects.length) {
      for (let i = 0; i < activeIntersects.length; i++) {
        const activeInsObj = activeIntersects[i].object
        if (activeInsObj.userData?.info) {
          // 线条
          activeInsObj.material.color.set('#ffffff')
        } else {
          // 地图板块
          activeInsObj.material.color.set('#d13a34')
        }
      }
    }

    // 计算物体和射线的焦点
    const obj3d = scene.children.filter((s) => s.type === 'Object3D')[0].children
    const meshes = scene.children.filter((child) => child.type === 'Mesh') // 只选取 Mesh 对象
    const intersects = raycaster.intersectObjects([...obj3d, ...meshes], true)

    if (intersects.length) {
      // 设置悬浮弹框的宽高
      info.style.left = `${event.clientX}px`
      info.style.top = `${event.clientY}px`
      info.style.display = 'block'

      // 优先检测连接线条/柱状图
      const lineIntersect = intersects.find((obj) => obj.object.isMesh && obj.object.userData?.type)
      if (lineIntersect) {
        // 显示连接线条的悬浮信息
        info.innerHTML = lineIntersect.object.userData.info
      } else {
        // 显示地图板块的悬浮信息
        // info.innerHTML = intersects[0].object.parent.name
        info.style.display = 'none'
      }

      // 当碰撞到了CylinderGeometry和TextGeometry就不变颜色
      const black = ['CylinderGeometry', 'TextGeometry']
      const intersectsType = intersects.map((s) => s.object.geometry.type)
      if (intersectsType.some((v) => black.includes(v))) {
        return
      }
    } else {
      info.style.display = 'none'
    }

    // 数组数据清空
    activeIntersects = []

    // 滑过的当前这个高亮
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.type === 'Mesh') {
        intersects[i].object.material.color.set(0xff0000)
        activeIntersects.push(intersects[i])
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

        varying float vSize; // 片元变量（需要传递到片面着色器） 浮点 尺寸

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

  return new THREE.Mesh(geometry, material)
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
  cylinder.userData = { type: 'cylinder', info: `${staName}` }
  return cylinder
}
