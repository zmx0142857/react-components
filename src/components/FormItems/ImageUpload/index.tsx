import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FC } from 'react'
import { Button, Image, message } from 'antd'
import { compressPicture, base64ToBlob } from '@/utils'
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons'
import './index.less'
import classNames from 'classnames'

type FileType = {
  id: number
  url: string // 用于回显 (base64)
  file: Blob // 真正的图片文件
}

type ImageUploadProps = {
  initialValue?: FileType[]
  value?: FileType[]
  onChange?: (files: FileType[]) => void
  capture?: boolean | 'user' | 'environment' // user: 前置摄像头, environment: 后置摄像头, undefined: 让用户选择
  multiple?: boolean
}

let uid = 0

/**
 * 图片上传 (支持手机相机)
 */
const ImageUpload: FC<ImageUploadProps> = ({ initialValue = [], value, onChange, capture, multiple = true }) => {

  const fileRef = useRef(null)
  const [fileList, setFileList] = useState(initialValue)
  const [phantoms, setPhantoms] = useState<number[]>([]) // 处于动画中间态的元素 id

  useEffect(() => {
    if (value) setFileList(value)
  }, [value])

  // 添加图片
  const onImageChange = async (e: ChangeEvent) => {
    const files = (e.target as HTMLInputElement).files
    if (!files || files.length === 0) return
    try {
      const newFiles = await Promise.all([...files].map(async file => {
        const url = await compressPicture(file)
        const blob = base64ToBlob(url)
        return { id: uid++, url, file: blob }
      }))
      const newFileList = [...fileList, ...newFiles]
      setFileList(newFileList)
      onChange?.(newFileList)
      // setPhantoms(newFiles.map(v => v.id))
      // setTimeout(() => setPhantoms([]), 10)
    } catch (e) {
      console.error(e)
      message.error('添加图片失败')
    }
  }

  // 删除图片
  const removeImage = (index: number) => {
    setPhantoms([fileList[index].id])
    setTimeout(() => {
      const newFileList = fileList.filter((_, i) => i !== index)
      setFileList(newFileList)
      onChange?.(newFileList)
      setPhantoms([])
    }, 300)
  }

  return (
    <div className="c-image-upload">
      {/* 拍照 (隐藏) */}
      <input ref={fileRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        capture={capture}
        style={{ display: 'none' }}
        onChange={onImageChange}
        onClick={(e) => { (e.target as HTMLInputElement).value = '' }}
      />

      {/* 选择图片 */}
      <div className="c-image-upload-choose">
        {
          fileList.map((file, index) => (
            <div className={classNames('c-image-upload-wrap', { phantom: phantoms.includes(file.id) })} key={file.id}>
              <Image src={file.url} alt="file" width={100} height={100} style={{ objectFit: 'cover' }} />
              <Button
                className="c-image-upload-close-btn"
                shape="circle"
                danger
                onClick={() => removeImage(index)} icon={<CloseCircleFilled />}
              />
            </div>
          ))
        }
        <Button
          className="c-image-upload-add-btn"
          type="dashed"
          onClick={() => fileRef.current && (fileRef.current as HTMLInputElement).click()}
          icon={<PlusOutlined />}
        />
      </div>
    </div>
  )
}

export default ImageUpload
