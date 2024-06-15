import { ObjectEditor } from '@/components'

const ObjectEditorExample = () => {

  const onFinish = (values: object) => {
    console.log('onFinish', values)
  }

  const onCancel = () => {
    console.log('onCancel')
  }

  const keyPrompt = {
    // 普通输入框
    sign: { label: '个性签名', placeholder: '你懂的' },
    // 下拉选择
    blood: {
      label: '血型',
      component: 'Select',
      placeholder: 'A, B, AB 或 O',
      options: [
        { value: 'A', label: 'A型' },
        { value: 'B', label: 'B型' },
        { value: 'O', label: 'O型' },
        { value: 'AB', label: 'AB型' },
      ],
    },
    // 对象输入
    coord: {
      label: '经纬度',
      component: 'Object',
      type: JSON.stringify,
      placeholder: '请输入经纬度',
      keyPrompt: {
        lon: { label: '经度', type: Number },
        lat: { label: '纬度', type: Number },
      },
    },
    // 数组输入
    options: {
      label: '选项',
      component: 'Object',
      isArray: true,
      placeholder: '请输入选项',
      keyPrompt: {
        0: {
          component: 'Object',
          keyPrompt: {
            label: { label: '名称', type: String },
            value: { label: '值', type: String },
          }
        }
      },
      initialValue: [
        { value: 0, label: '否' },
        { value: 1, label: '是' },
      ],
    },
    disabledField: {
      label: '你选不了我',
      component: 'Input',
      placeholder: '我被禁用了',
      disabled: true,
    },
    hiddenField: {
      label: '你看不见我',
      component: 'Input',
      placeholder: '我被隐藏了',
      hidden: true,
    },
  }

  return (
    <div style={{ padding: 24, width: '100%', height: '100%', boxSizing: 'border-box' }}>
      <ObjectEditor
        value={{ hiddenField: '隐藏字段', disabledField: '禁用字段' }}
        keyPrompt={keyPrompt}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  )
}

export default ObjectEditorExample