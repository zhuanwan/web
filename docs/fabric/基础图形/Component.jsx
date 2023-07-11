import BrowserOnly from '@docusaurus/BrowserOnly'
import React from 'react'

export function Component() {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        const LibComponent = require('./矩形.jsx')
        return <LibComponent.Test1 />
      }}
    </BrowserOnly>
  )
}
