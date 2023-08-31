import { useMemo, useState } from 'react'
import type { FC } from 'react'
import { Button, Col, Empty, Input, Row, Select } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import './index.less'

export type KeyPrompt = {
  [k in string]: { label: string, placeholder?: string }
}

type ObjectEditorProps = {
  value?: object
  disabled?: boolean
  onFinish?: (params: object) => void
  onCancel?: () => void
  keyPrompt?: KeyPrompt
}

/**
 * javascript object 编辑器
 * 注意 onFinish 所返回的 Object, 其键值类型均为 String, 可按需要自行转换处理
 * @param props.value 数据对象
 * @param props.disabled 是否只读
 * @param props.onFinish 编辑完成回调
 * @param props.onCancel 取消回调
 * @param props.keyPrompt 用于提示, { key: { label: '', placeholder: '' } }
 */
const ObjectEditor: FC<ObjectEditorProps> = ({ value = {}, disabled = false, onFinish, onCancel, keyPrompt = {} }) => {
  const keyPromptOptions = useMemo(() => {
    return Object.keys(keyPrompt).map(value => ({
      value,
      label: keyPrompt[value].label,
    }))
  }, [keyPrompt])
  const [entries, setEntries] = useState(() => Object.entries(value))

  const addRow = () => {
    setEntries([...entries, ['', '']])
  }

  const delRow = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index))
  }

  const finish = () => {
    onFinish?.(Object.fromEntries(entries))
  }

  const onInput = (value: string, index: number, type: number) => {
    const newMapList = [...entries]
    newMapList[index][type] = value
    setEntries(newMapList)
  }

  return (
    <div className="c-object-editor">
      <div className="c-object-editor-entries">
        {entries.map(([key, value], index) => (
          <Row key={index}>
            <Col span={2}>键:</Col>
            <Col span={9}>
              <Select
                className="c-object-editor-select"
                mode="tags"
                value={key ? key.split(/\s/) : []}
                onChange={value => onInput(value.slice(-1)[0], index, 0)}
                options={keyPromptOptions}
                disabled={disabled}
              />
            </Col>
            <Col span={2}>值:</Col>
            <Col span={9}>
              <Input
                // placeholder="如: 待完成"
                value={String(value)}
                onChange={e => onInput(e.target.value, index, 1)}
                disabled={disabled}
                placeholder={keyPrompt[key]?.placeholder}
              />
            </Col>
            <Col span={2}>
              {!disabled &&
                <MinusCircleOutlined className="c-object-editor-delete-btn"
                  onClick={() => delRow(index)}
                  role="button"
                  title="删除"
                />
              }
            </Col>
          </Row>
        ))}
        {!disabled && <PlusOutlined className="c-object-editor-add-btn" onClick={addRow} />}
        {!entries.length && <Empty />}
      </div>
      {!disabled &&
        <div className="c-object-editor-btns">
          <Button type="primary" onClick={finish}>提交</Button>
          <Button onClick={onCancel}>取消</Button>
        </div>
      }
    </div>
  )
}

export default ObjectEditor
