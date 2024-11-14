import { useState, useEffect, useRef } from 'react'
import { Radio, Checkbox, Row, Col, InputNumber, RadioChangeEvent } from 'antd'
import useLanguage from '../useLanguage'
import { type CronField, FieldType, Parser, cronRegex, Keys } from '../parser'
import { Any } from '@/utils/types'

export type PaneProps = {
  value: string
  onChange: (value: string) => void
  Parser: typeof Parser
}

function Pane ({ value, onChange, Parser }: PaneProps) {
  const language = useLanguage(['every', 'assign', 'none', 'dash', 'slash'])
  const parser = useRef(new Parser())
  const [data, setData] = useState<CronField>(() => parser.current.fromString(value))

  useEffect(() => {
    setData(parser.current.fromString(value))
  }, [value])

  const triggerChange = (changeData: Partial<CronField>) => {
    const newData = {
      ...data,
      ...changeData
    }
    setData(newData)
    const str = parser.current.toString(newData)
    if (str) {
      onChange(str)
    }
  }

  const onChangeType = (e: RadioChangeEvent) => {
    triggerChange({
      type: e.target.value
    })
  }

  const onChangeDash0 = (v: number | null) => {
    triggerChange({
      dash: [v ?? parser.current.default().dash[0], data.dash[1]]
    })
  }

  const onChangeDash1 = (v: number | null) => {
    triggerChange({
      dash: [data.dash[0], v ?? parser.current.default().dash[1]]
    })
  }

  const onChangeSlash0 = (v: number | null) => {
    triggerChange({
      slash: [v ?? parser.current.default().slash[0], data.slash[1]]
    })
  }

  const onChangeSlash1 = (v: number | null) => {
    triggerChange({
      slash: [data.slash[0], v ?? parser.current.default().slash[1]]
    })
  }

  const onChangeAssign = (v: Any[]) => {
    triggerChange({
      assign: v.length !== 0 ? v.map(x => String(x)) : parser.current.default().assign
    })
  }

  const renderDash = () => {
    const key = parser.current.key
    const arr = language.dash[key].split(cronRegex.placeholder)
    const disabled = data.type !== FieldType.dash
    const { min, max } = data
    return <>
      {arr[0]}
      <InputNumber
        disabled={disabled}
        min={min}
        max={max}
        size="small"
        value={data.dash[0] as number}
        onChange={onChangeDash0}
      />
      {arr[1]}
      <InputNumber
        disabled={disabled}
        min={min}
        max={max}
        size="small"
        value={data.dash[1] as number}
        onChange={onChangeDash1}
      />
      {arr[2]}
    </>
  }

  const renderSlash = () => {
    const key = parser.current.key
    const arr = language.slash[key].split(cronRegex.placeholder)
    const disabled = data.type !== FieldType.slash
    const { min, max } = data
    return <>
      {arr[0]}
      <InputNumber
        disabled={disabled}
        min={min}
        max={max}
        size="small"
        value={data.slash[0]}
        onChange={onChangeSlash0}
      />
      {arr[1]}
      <InputNumber
        disabled={disabled}
        min={1}
        max={max}
        size="small"
        value={data.slash[1]}
        onChange={onChangeSlash1}
      />
      {arr[2]}
    </>
  }

  const renderAssign = () => {
    const disabled = data.type !== FieldType.assign
    const { min, max } = data
    return <>
      {language.assign}
      <br />
      <Checkbox.Group value={data.assign} onChange={onChangeAssign}>
        <Row>
          {Array.from({ length: max - min + 1 }).map((_, i) => {
            i += min
            return <Col key={i} span={4}>
              <Checkbox disabled={disabled} value={i.toString()}>
                {i}
              </Checkbox>
            </Col>
          })}
        </Row>
      </Checkbox.Group>
    </>
  }

  return (
    <Radio.Group name="radiogroup" value={data.type} onChange={onChangeType}>
      <Radio value={FieldType.every}>
        {language.every[parser.current.key]}
      </Radio>
      {/* 仅日和周可以「不指定」 */}
      {[Keys.day, Keys.week].includes(parser.current.key) &&
        <Radio value={FieldType.none}>
          {language.none}
        </Radio>
      }
      <Radio value={FieldType.dash}>
        {renderDash()}
      </Radio>
      <Radio value={FieldType.slash}>
        {renderSlash()}
      </Radio>
      <Radio value={FieldType.assign}>
        {renderAssign()}
      </Radio>
    </Radio.Group>
  )
}

export default Pane
