import './index.less'
import type { KeyPrompt } from '@/components/ObjectEditor'
import ObjectEditor from '@/components/ObjectEditor'
import classNames from 'classnames'
import type { FC } from 'react'
import useModal from '@/hooks/useModal'
import { EditOutlined } from '@ant-design/icons'
import { Modal, Descriptions, Button } from 'antd'
import { useEffect } from 'react'

type ObjectInputProps = {
  label?: string
  value?: object
  initialValue?: object
  onChange?: (value: object) => void
  className?: string
  style?: object
  keyPrompt?: KeyPrompt
  column?: number
  disabled?: boolean
}

const ObjectInput: FC<ObjectInputProps> = ({
  label,
  value,
  initialValue,
  onChange,
  className,
  style,
  keyPrompt = {},
  column = 3,
  disabled,
  ...otherProps
}) => {
  const [modal, setModal] = useModal(initialValue)

  useEffect(() => {
    if (value) {
      modal.push(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const onEdit = () => disabled ? null : setModal({
    show: true,
    type: 'objectEditor',
    title: label || '',
    data: modal.data,
  })

  const onFinish = (data: object) => {
    setModal(({
      ...modal,
      show: false,
      data,
    }))
    onChange?.(data)
  }

  return (
    <div className={classNames('c-object-input', className)} style={style}>
      <Descriptions column={column}>
        {Object.entries(modal.data).map(([key, value]) => (
          <Descriptions.Item key={key} label={keyPrompt[key]?.label ?? key}>
            {value}
          </Descriptions.Item>
        ))}
        <Descriptions.Item>
          <Button
            style={{ width: 32 }}
            size="small"
            title="编辑"
            icon={<EditOutlined />}
            onClick={onEdit}
            disabled={disabled}
          />
        </Descriptions.Item>
      </Descriptions>
      <Modal title={modal.title}
        open={modal.show}
        onCancel={modal.hide}
        width={600}
        bodyStyle={{ height: 400 }}
        footer={null}
      >
        {modal.show &&
          <ObjectEditor
            value={modal.data}
            onFinish={onFinish}
            onCancel={modal.hide}
            keyPrompt={keyPrompt}
            {...otherProps}
          />
        }
      </Modal>
    </div>
  )
}

export default ObjectInput