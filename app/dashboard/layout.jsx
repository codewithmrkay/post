import React from 'react'
import { Sidebar } from '../component/Sidebar'

function layout({children}) {
  return (
<div>
    <Sidebar>
        {children}       
    </Sidebar>
</div>
  )
}

export default layout