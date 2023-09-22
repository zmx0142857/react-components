import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import useModal from '@/hooks/useModal'
import { Button, Input, Modal, Tooltip } from 'antd'
import Cron, { type CronRef } from '@/components/Cron'
import classnames from 'classnames'
import { Keys } from '@/components/Cron/parser'
import { FieldTimeOutlined } from '@ant-design/icons'

type CronInputProps = {
  title?: string
  value?: string
  initialValue?: string
  onChange?: (value: string) => void
  className?: string
  style?: object
  disabled?: boolean
  tabs?: object
  defaultTab?: Keys
  getContainer?: () => HTMLElement
}

/**
 * 计划时间编辑器 (cron 表达式)
 */
const CronInput: FC<CronInputProps> = ({
  title = '计划时间',
  value,
  initialValue,
  onChange,
  className,
  style,
  disabled,
  tabs = { year: false },
  defaultTab,
  getContainer,
}) => {
  const cron = useRef<CronRef>(null)
  const [modal, setModal] = useModal({ value: initialValue })

  useEffect(() => {
    modal.push({ value })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const closeModal = () => {
    setModal({
      ...modal,
      show: false,
      data: { value },
    })
  }

  const onOk = () => {
    const value = cron.current?.getValue() || ''
    closeModal()
    onChange?.(value)
  }

  return (
    <div className={classnames('c-cron-input', className)} style={style}>
      <Tooltip title={Cron.getDesc(modal.data.value || '', { tabs })}>
        <Input
          value={modal.data.value}
          disabled={disabled}
          onClick={() => !disabled && setModal({
            show: true,
            type: 'cron',
            title: '编辑' + title,
            data: modal.data,
          })}
          suffix={<FieldTimeOutlined style={{ opacity: 0.25 }} />}
        />
      </Tooltip>
      <Modal
        className="c-cron-input-modal"
        title={modal.title}
        open={modal.show}
        onCancel={closeModal}
        width={660}
        // bodyStyle={{ height: 540, padding: 20 }}
        footer={null}
        getContainer={getContainer}
        destroyOnClose
      >
        {modal.show &&
          <Cron
            ref={cron}
            value={modal.data.value}
            tabs={tabs}
            defaultTab={defaultTab}
            footer={[
              <Button key="confirm-btn" type="primary" onClick={onOk}>确定</Button>
            ]}
          />
        }
      </Modal>
    </div>
  )
}

export default CronInput