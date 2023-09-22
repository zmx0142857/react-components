import { useRef, useState, useEffect } from 'react'
import { Radio, Checkbox, InputNumber } from 'antd'
import WeekSelect from './WeekSelect'
import useLanguage from '../useLanguage'
import { PaneProps } from './Pane'
import { RadioChangeEvent } from 'antd/lib'
import { type CronField, FieldType, WeekParser, cronRegex } from '../parser'
import { CheckboxValueType } from 'antd/es/checkbox/Group'

function WeekPane({ value, onChange, Parser }: PaneProps) {
  const language = useLanguage(['assign', 'none', 'every', 'dash', 'harsh', 'last', 'weekdays'])
  const parser = useRef(new Parser() as WeekParser)
  const [data, setData] = useState<Required<CronField>>(() => parser.current.fromString(value))

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

  const onChangeDash0 = (v: string | null) => {
    triggerChange({
      dash: [v ?? parser.current.default().dash[0], data.dash[1]],
    })
  }

  const onChangeDash1 = (v: string | null) => {
    triggerChange({
      dash: [data.dash[0], v ?? parser.current.default().dash[1]],
    })
  }

  const onChangeHarsh0 = (v: string | null) => {
    triggerChange({
      harsh: [v ?? parser.current.default().harsh[0], data.harsh[1]],
    })
  }

  const onChangeHarsh1 = (v: number | null) => {
    triggerChange({
      harsh: [data.harsh[0], v ?? parser.current.default().harsh[1]],
    })
  }

  const onChangeLast = (v: string | null) => {
    triggerChange({
      last: v ?? parser.current.default().last
    })
  }

  const onChangeAssign = (v: CheckboxValueType[]) => {
    triggerChange({
      assign: v.length !== 0 ? v.map(x => String(x)) : parser.current.default().assign
    })
  }

  const renderDash = () => {
    const key = 'week'
    const arr = language.dash[key].split(cronRegex.placeholder)
    const disabled = data.type !== FieldType.dash
    return <>
      {arr[0]}
      <WeekSelect
        disabled={disabled}
        value={data.dash[0]}
        onChange={onChangeDash0}
      />
      {arr[1]}
      <WeekSelect
        disabled={disabled}
        value={data.dash[1]}
        onChange={onChangeDash1}
      />
      {arr[2]}
    </>
  }

  const renderHarsh = () => {
    const arr = language.harsh.split(cronRegex.placeholder)
    const disabled = data.type !== FieldType.harsh
    return <>
      {arr[0]}
      <InputNumber
        disabled={disabled}
        min={0}
        max={5}
        value={data.harsh[1]}
        size="small"
        onChange={onChangeHarsh1}
      />
      {arr[1]}
      <WeekSelect
        disabled={disabled}
        value={data.harsh[0]}
        onChange={onChangeHarsh0}
      />
      {arr[2]}
    </>
  }

  const renderLast = () => {
    const arr = language.last.split(cronRegex.placeholder)
    const disabled = data.type !== FieldType.last
    return <>
      {arr[0]}
      <WeekSelect
        disabled={disabled}
        value={data.last}
        onChange={onChangeLast}
      />
      {arr[1]}
    </>
  }

  const renderAssign = () => {
    const disabled = data.type !== FieldType.assign
    return <>
      {language.assign}
      <br />
      <Checkbox.Group value={data.assign} onChange={onChangeAssign}>
        {Object.entries(language.weekdays).map(([key, value]) =>
          <Checkbox key={key} disabled={disabled} value={key}>
            {value}
          </Checkbox>
        )}
      </Checkbox.Group>
    </>
  }

  return (
    <Radio.Group name="radiogroup" value={data.type} onChange={onChangeType}>
      <Radio value={FieldType.every}>
        {language.every.week}
      </Radio>
      <Radio value={FieldType.none}>
        {language.none}
      </Radio>
      <Radio value={FieldType.dash}>
        {renderDash()}
      </Radio>
      <Radio value={FieldType.harsh}>
        {renderHarsh()}
      </Radio>
      <Radio value={FieldType.last}>
        {renderLast()}
      </Radio>
      <Radio value={FieldType.assign}>
        {renderAssign()}
      </Radio>
    </Radio.Group>
  );
}

export default WeekPane;
