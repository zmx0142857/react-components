import { Button, Form } from 'antd'
import ImageUpload from '.'

const ImageUploadExample = () => {
  return (
    <Form onFinish={console.log} style={{ padding: 24 }}>
      <Form.Item label="选择图片" name="files" required>
        <ImageUpload />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  )
}

export default ImageUploadExample