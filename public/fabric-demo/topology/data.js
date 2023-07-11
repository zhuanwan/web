const tree = {
  switchFlag: 2,
  children: [
    {
      switchFlag: 2, // 开关 0: 没有开关 1：开启 2：关闭
      type: 1, // 图片的类型
      name: 'S060',
      status: 1, // 机器状态：1：运行 2：故障
    },
    {
      switchFlag: 1,
      children: [
        {
          switchFlag: 2,
          type: 2,
          name: '111',
          status: 1,
        },
        {
          switchFlag: 0,
          type: 3,
          name: '222',
          status: 2,
        },
      ],
    },
    {
      switchFlag: 2,
      children: [
        {
          switchFlag: 1,
          type: 3,
          name: '333',
          status: 1,
        },
        {
          switchFlag: 2,
          type: 3,
          name: '444',
          status: 1,
        },
        {
          switchFlag: 1,
          type: 3,
          name: '555',
          status: 1,
        },
      ],
    },
  ],
}

function getTreeChildren(deep) {
  let result = []
  const childrenLen = deep > 0 ? Math.floor(Math.random() * 6) : 0
  if (childrenLen > 0) {
    const newDeep = deep - 1
    for (let i = 0; i < childrenLen; i++) {
      const element = {
        switchFlag: Math.floor(Math.random() * 3),
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
        switchFlag: Math.floor(Math.random() * 3),
      })
    }
  }
  return result
}

export function createRandomTree() {
  const deep = Math.floor(Math.random() * 3) + 1 // 树的深度
  const result = {
    switchFlag: 2,
    children: getTreeChildren(deep),
  }

  console.log('我是一颗树', result)
  return result
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function f(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

window.message = {
  warning: (msg) => {
    const div = document.createElement('div')
    div.innerHTML = `<div style="position:fixed; left: 50%;top:50%;padding: 4px 12px;background:#fff;color:#000;
    border-radius: 4px;font-size:12px;">${msg}</div>`
    document.body.append(div)

    let timer = setTimeout(() => {
      document.body.removeChild(div)
      timer = null
    }, 2000)
  },
}
export default tree
