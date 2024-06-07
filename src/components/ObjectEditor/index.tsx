import { useMemo, useState } from 'react'
import type { FC } from 'react'
import { Button, Col, Empty, Input, Row, Select } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import ObjectInput from '../FormItems/ObjectInput'
import { matchString, parseJson, filter } from '@/utils'
import './index.less'

export type KeyPrompt = {
  [k in string]: {
    label?: string,
    placeholder?: string,
    component?: string,
    options?: { value: string, label: string }[],
    keyPrompt?: KeyPrompt,
    disabled?: boolean,
    column?: number,
    type?: (v: string) => number | string | object,
    isArray?: boolean,
  }
}

type ObjectEditorProps = {
  value?: object
  disabled?: boolean
  onFinish?: (params: object) => void
  onCancel?: () => void
  keyPrompt?: KeyPrompt
  isArray?: boolean
}

/**
 * javascript object 编辑器
 * 注意 onFinish 所返回的 Object, 其键值类型均为 String, 可按需要自行转换处理
 * @param props.value 数据对象
 * @param props.disabled 是否只读
 * @param props.onFinish 编辑完成回调
 * @param props.onCancel 取消回调
 * @param props.keyPrompt 用于提示, { key: { label: '', placeholder: '' } }
 * @param props.isArray 数组模式
 */
const ObjectEditor: FC<ObjectEditorProps> = ({ value = {}, disabled = false, onFinish, onCancel, keyPrompt = {}, isArray = false }) => {
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

  const getConfig = (key: string | number) => {
    if (isArray) key = 0
    return keyPrompt[key] || {}
  }

  const finish = () => {
    const res = entries.map(([key, value]) => {
      const config = getConfig(key)
      const type = config.type
      return type ? [key, type(value)] : [key, value]
    })
    onFinish?.(
      isArray ? res.map(pair => pair[1]) : Object.fromEntries(res)
    )
  }

  function onInput<T>(value: T, index: number, type: number) {
    const newMapList = [...entries]
    newMapList[index][type] = value
    setEntries(newMapList)
  }

  return (
    <div className="c-object-editor">
      <div className="c-object-editor-entries">
        {entries.map(([key, value], index) => {
          const config = getConfig(key)
          return <Row key={index} justify="center">
            {isArray ? null : <>
              <Col span={2}>键:</Col>
              <Col span={9}>
                <Select
                  className="c-object-editor-select"
                  mode="tags"
                  value={key ? [key] : []}
                  onChange={value => onInput(value.slice(-1)[0], index, 0)}
                  options={keyPromptOptions}
                  disabled={disabled || config.disabled}
                  filterOption={(value, option) => matchString(option?.label, value) || matchString(option?.value, value)}
                />
              </Col>
              <Col span={2}>值:</Col>
            </>}
            <Col span={isArray ? 12 : 9}>
              {config.component === 'Object' ?
                <ObjectInput
                  value={typeof value === 'string' ? parseJson(value) : value || {}}
                  onChange={value => onInput(value, index, 1)}
                  keyPrompt={config.keyPrompt}
                  disabled={disabled || config.disabled}
                  title={config.label}
                  column={config.column || 1}
                  {...filter(config, (_, key) => !['label', 'column', 'keyPrompt', 'disabled', 'placeholder', 'component', 'options', 'type'].includes(key))}
                />
                : config.component === 'Select' ?
                <Select
                  className="c-object-editor-select"
                  placeholder={config.placeholder}
                  allowClear
                  value={value || undefined}
                  onChange={value => onInput(value, index, 1)}
                  options={config.options}
                  disabled={disabled || config.disabled}
                />
                : <Input
                  value={String(value)}
                  onChange={e => onInput(e.target.value, index, 1)}
                  disabled={disabled || config.disabled}
                  placeholder={config.placeholder}
                />
              }
            </Col>
            <Col span={2}>
              {!(disabled || config.disabled) &&
                <MinusCircleOutlined className="c-object-editor-delete-btn"
                  onClick={() => delRow(index)}
                  role="button"
                  title="删除"
                />
              }
            </Col>
          </Row>
        })}
        {!disabled && <PlusOutlined className="c-object-editor-add-btn" onClick={addRow} />}
        {!entries.length && <Empty />}
      </div>
      {!disabled &&
        <div className="c-object-editor-btns">
          <Button type="primary" onClick={finish}>确定</Button>
          <Button onClick={onCancel}>取消</Button>
        </div>
      }
    </div>
  )
}

export default ObjectEditor
