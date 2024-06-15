import './index.less'
import type { KeyPrompt } from '@/components/ObjectEditor'
import ObjectEditor from '@/components/ObjectEditor'
import classNames from 'classnames'
import type { FC } from 'react'
import useModal from '@/hooks/useModal'
import { EditOutlined } from '@ant-design/icons'
import { Modal, Descriptions, Button } from 'antd'
import { useEffect, useRef } from 'react'

type ObjectInputProps = {
  title?: string
  value?: object
  initialValue?: object
  onChange?: (value: object) => void
  className?: string
  style?: object
  keyPrompt?: KeyPrompt
  column?: number
  disabled?: boolean
  isArray?: boolean
}

const ObjectInput: FC<ObjectInputProps> = ({
  title,
  value,
  initialValue,
  onChange,
  className,
  style,
  keyPrompt = {},
  column = 3,
  disabled,
  isArray = false,
  ...otherProps
}) => {
  const [modal, setModal] = useModal(initialValue)
  const lastData = useRef({});

  useEffect(() => {
    if (value) {
      modal.push(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const onEdit = () => {
    if (disabled) return
    lastData.current = modal.data
    setModal({
      show: true,
      type: 'objectEditor',
      title: title || '',
      data: modal.data,
    })
  }

  const onFinish = (data: object) => {
    setModal(({
      ...modal,
      show: false,
      data,
    }))
    onChange?.(data)
  }

  const onCancel = () => {
    setModal({
      show: false,
      type: '',
      title: '',
      data: lastData.current,
    })
    onChange?.(lastData.current)
  }

  const getConfig = (key: string | number) => {
    if (isArray) key = 0
    return keyPrompt[key] || {}
  }

  const renderValue = (key: string, value: string) => {
    const config = getConfig(key)
    const res = String(value)
    if (config.component === 'Select') {
      if (config.options) {
        return config.options.find(v => v.value === value)?.label || res
      }
    } else if (config.component === 'Object') {
      if (typeof value === 'object' && res === '[object Object]') {
        return JSON.stringify(value)
      }
    }
    return res
  }

  return (
    <div className={classNames('c-object-input', className)} style={style}>
      <Descriptions column={column}>
        {Object.entries(modal.data).map(([key, value]) => {
          const config = getConfig(key)
          return !config.hidden && <Descriptions.Item key={key} label={keyPrompt[key]?.label ?? key}>
            {renderValue(key, value)}
          </Descriptions.Item>
        })}
        <Descriptions.Item>
          <Button
            style={{ width: 32, height: 22 }}
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
        onCancel={onCancel}
        width={600}
        bodyStyle={{ height: 400 }}
        footer={null}
        destroyOnClose
      >
        {modal.show &&
          <ObjectEditor
            value={modal.data}
            onFinish={onFinish}
            onCancel={onCancel}
            keyPrompt={keyPrompt}
            isArray={isArray}
            title={modal.title}
            {...otherProps}
          />
        }
      </Modal>
    </div>
  )
}

export default ObjectInput