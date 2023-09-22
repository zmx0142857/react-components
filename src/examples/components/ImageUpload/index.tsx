import { Button, Form } from 'antd'
import { ImageUpload } from '@/components'

const ImageUploadExample = () => {
  return (
    <Form onFinish={console.log} style={{ padding: 24 }}>
      <Form.Item label="选择图片" name="files" required rules={[{ required: true, message: '请选择图片' }]}>
        <ImageUpload />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">提交</Button>
      </Form.Item>
    </Form>
  )
}

export default ImageUploadExample