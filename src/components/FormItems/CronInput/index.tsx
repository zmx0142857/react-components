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
  postProcess?: (value: string) => string
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
  postProcess, // 对生成的 cron 表达式进行后处理
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

  // 修正非法表达式
  const handleIlleagalCron = (value: string) => {
    const arr = value.split(' ')
    if (arr.length === 7) {
      arr.forEach((item, i) => {
        // '?' 只能在日和周中使用, 如果在其它字段出现, 就改成 '*'
        if (item === '?' && [0, 1, 2, 4].includes(i)) {
          arr[i] = '*'
        }
      })
    }
    return arr.join(' ')
  }

  const onOk = () => {
    let value = cron.current?.getValue() || ''
    closeModal()
    value = handleIlleagalCron(value)
    if (postProcess) {
      value = postProcess(value)
    }
    onChange?.(value)
  }

  const renderTitle = () => {
    return cron.current?.getDesc() || ''
  }

  return (
    <div className={classnames('c-cron-input', className)} style={style}>
      <Tooltip title={renderTitle()}>
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
        bodyStyle={{ height: 540, padding: 20 }}
        footer={null}
        getContainer={getContainer}
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