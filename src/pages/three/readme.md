# 记录

### PerspectiveCamera 透视相机

```js
const aspect = canvas.clientWidth / canvas.clientHeight
cameraRef.current = new THREE.PerspectiveCamera(75, aspect, 1, 200)
cameraRef.current.position.set(0, 0, 10)
cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0))
```

- fov 视野角度（垂直方向，单位：度）
- aspect 画布宽高比
- near 近裁剪面（相机前方最近可见距离）
- far 远裁剪面（相机前方最远可见距离）

1. PerspectiveCamera 使用 near / far 作为裁剪边界，决定物体是否会被渲染，而不决定物体的视觉大小
2. 物体的视觉大小主要由 fov 和物体到相机的距离决定
3. 相机位于 z = 10，near = 1、far = 200，对应世界坐标 z ∈ (9, -190)
4. 默认物体位于 z = 0，处于可视范围内，因此可以被看到
5. lookAt(0, 0, 0) 表示相机朝向世界坐标的负 z 方向（屏幕内部）

### renderer

```js
// 设置渲染器尺寸
rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight, false)
```

- camera.aspect 决定“世界怎么投影”
- renderer.setSize 决定“画布有多大、分辨率是多少”
- 为什么第三个参数用 false？
  - false：不修改 CSS 大小，只同步内部绘制尺寸，👉 最推荐做法
  - true（默认）：会强制设置 style.width / height，可能和 React / CSS 冲突

## 光源

点光源（PointLight）

- 有具体位置：像灯泡或蜡烛
- 光线向四面八方发射
- 有衰减：距离越远，光线越弱

```js
// 点光源：有具体位置
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(5, 5, 5) // 光源在这个具体位置
```

平行光（DirectionalLight）

- 没有具体位置：像太阳光
- 所有光线都是平行的
- 没有衰减：无论多远，光线强度相同

```js
// 平行光：只有方向，没有位置
const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(1, 1, 1) // 注意：这不是光源位置！
// Three.js内部处理：
// 1. 计算方向向量：从(1,1,1)指向原点(0,0,0)
// 2. 所有光线都从这个方向射来
// 3. 光源本身在"无限远处"

dirLight.position.set(1, 1, 1).normalize() // 把一个向量变成单位向量,CPU归一化比GPU多次归一化更高效
```

light.target

```js
// 没有指定target
dirLight.position.set(0, 10, 0)
// 光线方向 = 从(0,10,0)指向原点(0,0,0)
// 所有光线都平行于向量(0,-10,0)

// 指定target
dirLight.position.set(0, 10, 0)
dirLight.target.position.set(10, 0, 0) // 看向(10,0,0)

// 光线方向 = 从(0,10,0)指向(10,0,0)
// 所有光线都平行于向量(10,-10,0)
```
