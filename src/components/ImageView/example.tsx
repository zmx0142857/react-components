import type { FC } from 'react'
import ImageView from '@/components/ImageView'
import { Tag } from 'antd'

const points = [
  { x: 100, y: 200, color: 'success' },
  { x: 200, y: 400, color: 'processing' },
  { x: 300, y: 500, color: 'error' },
  { x: 400, y: 100, color: 'warning' },
]

const ImageViewExample: FC = () => {
  return (
    <ImageView
      src="/flandre-scarlet.jpg"
      items={points.map((item, index) => ({
          key: index,
          x: item.x,
          y: item.y,
          children: <Tag color={item.color}>标签{index+1}</Tag>,
      }))}
    />
  )
}

export default ImageViewExample