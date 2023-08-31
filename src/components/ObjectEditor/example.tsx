import ObjectEditor from '.'

const ObjectEditorExample = () => {

  const onFinish = (values: object) => {
    console.log('onFinish', values)
  }

  const onCancel = () => {
    console.log('onCancel')
  }

  return (
    <div style={{ padding: 24, width: '100%', height: '100%', boxSizing: 'border-box' }}>
      <ObjectEditor
        value={{ a: 1, b: 2 }}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  )
}

export default ObjectEditorExample