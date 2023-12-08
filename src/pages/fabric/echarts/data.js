const tree = {
  type: -1,
  children: [
    {
      type: 1, // 图片的类型
      name: 'S060',
      status: 1, // 机器状态：1：运行 2：故障
    },
    {
      type: 0,
      children: [
        {
          type: 2,
          name: '111',
          status: 1,
        },
        {
          type: 3,
          name: '222',
          status: 2,
        },
      ],
    },
    {
      type: 0,
      children: [
        {
          type: 3,
          name: '333',
          status: 1,
        },
        {
          type: 3,
          name: '444',
          status: 1,
        },
        {
          type: 3,
          name: '555',
          status: 1,
        },
      ],
    },
  ],
}

function getTreeChildren(deep) {
  const result = []
  const childrenLen = deep > 0 ? Math.floor(Math.random() * 6) : 0
  if (childrenLen > 0) {
    const newDeep = deep - 1
    for (let i = 0; i < childrenLen; i++) {
      const element = {
        children: getTreeChildren(newDeep),
      }
      result.push(element)
    }
  } else {
    // 叶子节点
    const leafNum = Math.floor(Math.random() * 4) + 1
    for (let i = 0; i < leafNum; i++) {
      result.push({
        type: Math.floor(Math.random() * 4) + 1,
        name: 'S060',
        status: Math.floor(Math.random() * 2) + 1,
      })
    }
  }
  return result
}

export function createRandomTree() {
  const deep = Math.floor(Math.random() * 3) + 1 // 树的深度
  const result = {
    children: getTreeChildren(deep),
  }

  console.log('我是一颗树', result)
  return result
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function f(c) {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default tree
