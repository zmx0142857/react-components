import { DragWindow } from '@/components'
import { useRef, useState } from 'react'
import './index.less'

const DragWindowExample = () => {
  const container = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(true)
  return (
    <div className="p-drag-window-example" ref={container}>
      {show &&
        <DragWindow title="设置" container={container} onClose={() => setShow(false)}>
          这是窗口的内容
        </DragWindow>
      }
    </div>
  )
}

export default DragWindowExample