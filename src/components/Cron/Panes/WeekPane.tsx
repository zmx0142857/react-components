import { useRef, useState, useEffect, useCallback } from 'react'
import { Radio, Checkbox, InputNumber } from 'antd'
import WeekSelect from './WeekSelect'
import useLanguage from '../useLanguage'
import { PaneProps } from './Pane'
import { RadioChangeEvent } from 'antd/lib'
import { FieldType, WeekParser, cronRegex } from '../parser'
import { CheckboxValueType } from 'antd/es/checkbox/Group'

function WeekPane({ value, onChange, Parser }: PaneProps) {
  const language = useLanguage(['assign', 'none', 'every', 'dash', 'harsh', 'last', 'weekdays'])
  const parser = useRef(new Parser() as WeekParser)
  const isFirstRender = useRef(true)
  const [data, setData] = useState(() => parser.current.default())

  useEffect(() => {
    setData(parser.current.fromString(value))
  }, [value])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const str = parser.current.toString(data)
    if (str) {
      onChange(str)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const onChangeType = useCallback((e: RadioChangeEvent) => {
    setData(data => ({
      ...data,
      type: e.target.value
    }))
  }, [])

  const onChangeDash0 = useCallback((v: string | null) => {
    setData(data => ({
      ...data,
      dash: [v ?? parser.current.default().dash[0], data.dash[1]],
    }))
  }, [])

  const onChangeDash1 = useCallback((v: string | null) => {
    setData(data => ({
      ...data,
      dash: [data.dash[0], v ?? parser.current.default().dash[1]],
    }))
  }, [])

  const onChangeHarsh0 = useCallback((v: string | null) => {
    setData(data => ({
      ...data,
      harsh: [v ?? parser.current.default().harsh[0], data.harsh[1]],
    }))
  }, [])

  const onChangeHarsh1 = useCallback((v: number | null) => {
    setData(data => ({
      ...data,
      harsh: [data.harsh[0], v ?? parser.current.default().harsh[1]],
    }))
  }, [])

  const onChangeLast = useCallback((v: string | null) => {
    setData(data => ({
      ...data,
      last: v ?? parser.current.default().last
    }))
  }, [])

  const onChangeAssign = useCallback((v: CheckboxValueType[]) => {
    setData(data => ({
      ...data,
      assign: v.length !== 0 ? v.map(x => String(x)) : parser.current.default().assign
    }))
  }, [])

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
