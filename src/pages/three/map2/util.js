// ... existing code ...

// 创建热力点
export const createHeatPoint = ({ position, color = 0xff0000, size = 50 }) => {
  const geometry = new THREE.CircleGeometry(1, 32)
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  })
  const circle = new THREE.Mesh(geometry, material)
  circle.position.set(position.x, position.y, 30)
  circle.scale.set(size, size, 1)
  
  return circle
}

// 创建站点热力点
export const createStationPoints = (stations, handleProj) => {
  const group = new THREE.Group()
  
  stations.forEach((station) => {
    const [x, y] = handleProj(station.properties.center)
    const point = createHeatPoint({
      position: new THREE.Vector3(x, -y, 0),
      color: 0xff0000,
      size: 20,
    })
    group.add(point)
  })

  return group
}