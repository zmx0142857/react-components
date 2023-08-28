import { useRef, useState, useEffect } from 'react'
import type { FC, MouseEvent, WheelEvent, ReactNode, StyleHTMLAttributes } from 'react'
import classnames from 'classnames'
import { between, loadImage } from '@/utils'
import './index.less'

type ImageViewItem = {
  key?: string | number,
  x?: number,
  y?: number,
  style?: StyleHTMLAttributes<string>,
  children?: ReactNode,
}

type ImageViewProps = {
  disabled?: boolean // 是否激活
  onClick?: (left: number, top: number) => void // 点击画布
  src?: string // 背景图片
  items?: ImageViewItem[] // 子组件
  className?: string // 类名
  minScale?: number // 最小缩放比
  maxScale?: number // 最大缩放比
  keepScale?: boolean // 是否保持子组件缩放比例
}

/**
 * 可缩放的图片. 支持鼠标拖拽移动, 滚轮缩放等
 */
const ImageView: FC<ImageViewProps> = ({ disabled = false, onClick, src, items, className = '', minScale = 0.5, maxScale = 3, keepScale = true }) => {
  const container = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const transform = useRef({ scale: 1, x: 0, y: 0 })
  const mouse = useRef({
    isClick: false, // 是否为点击
    isDown: false, // 是否按下鼠标
    x: 0, // 当前鼠标 x 坐标
    y: 0,
    downX: 0, // 鼠标按下时的 x 坐标
    downY: 0,
  })

  const [imgSize, setImgSize] = useState({ width: 720, height: 405 })
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (src) {
      loadImage(src).then(img => setImgSize({
        width: (img as HTMLImageElement).width,
        height: (img as HTMLImageElement).height,
      }))
    }
  }, [src])

  // 使用原生方法以提高性能
  const setTransform = (params: { scale: number, x: number, y: number }) => {
    const { scale, x, y } = params;
    transform.current = params;
    if (body.current) {
      body.current.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;
    }
  }

  // 鼠标按下事件
  const onMouseDown = (e: MouseEvent) => {
    if (disabled) return;
    mouse.current = {
      isClick: true,
      isDown: true,
      x: e.pageX,
      y: e.pageY,
      downX: e.pageX,
      downY: e.pageY,
    }
  }

  // 获取可移动范围
  const getBounds = () => {
    const rect = body?.current?.getBoundingClientRect()
    if (!rect) return [0, 0]
    const s = transform.current.scale
    const k = (s - 1) / (2 * s * s) // rect bound 公式
    const boundX = Math.max(rect.width * k, 0)
    const boundY = Math.max(rect.height * k, 0)
    return [boundX, boundY]
  }

  // 鼠标移动事件
  const onMouseMove = (e: MouseEvent) => {
    if (disabled || !mouse.current.isDown) return

    // 计算移动距离, 判断是否为点击
    const diffX = Math.abs(e.pageX - mouse.current.downX)
    const diffY = Math.abs(e.pageY - mouse.current.downY)
    if (diffX > 1 || diffY > 1) {
      mouse.current.isClick = false
    }

    const [boundX, boundY] = getBounds()
    const { scale, x, y } = transform.current
    setTransform({
      scale,
      x: between(x + e.pageX - mouse.current.x, -boundX, boundX),
      y: between(y + e.pageY - mouse.current.y, -boundY, boundY),
    })
    mouse.current.x = e.pageX
    mouse.current.y = e.pageY
  }

  // 鼠标抬起事件
  const onMouseUp = (e: MouseEvent) => {
    const rect = body?.current?.getBoundingClientRect()
    if (disabled || !rect) return
    mouse.current.isDown = false
    if (mouse.current.isClick) {
      const mouseX = e.pageX - rect.x, mouseY = e.pageY - rect.y
      const percentX = mouseX / rect.width, percentY = mouseY / rect.height
      onClick?.(percentX * imgSize.width, percentY * imgSize.height)
    }
  }

  // 滚动事件
  const onWheel = (e: WheelEvent) => {
    const [boundX, boundY] = getBounds();
    const { scale, x, y } = transform.current;
    const newScale = between(scale - e.deltaY * 0.001, minScale, maxScale)
    setTransform({
      scale: newScale,
      x: between(x, -boundX, boundX),
      y: between(y, -boundY, boundY),
    })
    setScale(newScale)
  }

  const getBodyPos = () => {
    const rect = container?.current?.getBoundingClientRect()
    if (!rect) return {}
    const scaleX = rect.width / imgSize.width
    const scaleY = rect.height / imgSize.height
    const scale = Math.min(scaleX, scaleY)
    const width = imgSize.width * scale
    const height = imgSize.height * scale
    return {
      width,
      height,
      left: (rect.width - width) * 0.5 | 0,
      top: (rect.height - height) * 0.5 | 0,
    }
  }

  return (
    <div className={classnames('c-image-view', className)} ref={container}>
      <div className="c-image-view-body"
        ref={body}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onWheel={onWheel}
        style={{
          backgroundImage: `url(${src})`,
          ...getBodyPos(),
        }}
      >
        {items?.map(({ x = 0, y = 0, key, style, children, ...otherProps }) =>
          <div
            key={key}
            className="c-image-view-item"
            {...otherProps}
            style={{
              left: x / imgSize.width * 100 + '%',
              top: y / imgSize.height * 100 + '%',
              transform: keepScale ? `scale(${1 / scale})` : 'none',
              ...style,
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              mouse.current.isDown = false;
            }}
          >{children}</div>
        )}
      </div>
      {disabled && <div className="c-image-view-mask" />}
    </div>
  )
}

export default ImageView;
