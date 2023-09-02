import './index.less'
import CronContext from './CronContext'
import Panes from './Panes'
import type { FC, ReactNode } from 'react'
import { Tabs, Divider } from 'antd'
import { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react'
import useLanguage from './useLanguage'
import { CronData, CronField, Keys, keys, Parser } from './parser'

type CronProps = {
  style?: object
  value?: string
  footer?: ReactNode
  tabs?: { [k in Keys]?: boolean }
  defaultTab?: Keys
}
export type CronRef = {
  getValue: () => string
  getDesc: () => string
}

interface CronComponentType extends FC<CronProps> {
  Provider: typeof CronContext.Provider
}

const Cron: FC<CronProps> = forwardRef(({ style, value = '', footer, tabs = {}, defaultTab = 'second' }, ref) => {
  const language = useLanguage(['tabs', 'every', 'assign', 'none', 'dash', 'slash', 'harsh', 'last', 'weekdays'])
  const parser = useRef(new Parser())
  const [currentTab, setCurrentTab] = useState(defaultTab)
  const [cronData, setCronData] = useState<CronData>(() => parser.current.defaultCron())

  useImperativeHandle(ref, () => ({
    // 获取当前的 cron 表达式
    getValue: () => {
      const arr = keys.map(key => cronData[key])
      if (tabs.year === false) arr.pop()
      return arr.join(' ')
    },
    // 获取当前的 cron 表达式文字描述
    getDesc: () => {
      const arr = keys.map(key => {
        const parser = new Panes[key].Parser()
        const data = parser.fromString(cronData[key])
        return parser.toDesc(data as Required<CronField>, language)
      })
      if (tabs.year === false) arr.pop()
      return arr.filter(Boolean).join('; ')
    },
  }))

  useEffect(() => {
    setCronData(parser.current.cron(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const onSetCronData = (key: Keys) => (value: string) => {
    // day 和 week 是互斥的, 一个不是问号时, 另一个必须是问号
    const extData: Partial<CronData> = {}
    if (key === 'day' && value !== '?') {
      extData.week = '?'
    } else if (key === 'week' && value !== '?') {
      extData.day = '?'
    }
    setCronData(cronData => ({ ...cronData, ...extData, [key]: value }))
  }

  return (
    <div className="c-cron" style={style}>
      <Tabs
        activeKey={currentTab}
        onChange={setCurrentTab}
        items={keys.map(key => {
          const { Pane, Parser } = Panes[key]
          return {
            key,
            label: language.tabs[key],
            children: <Pane value={cronData[key]} onChange={onSetCronData(key)} Parser={Parser} />
          }
        }).filter(v => tabs[v.key] !== false)}
      />
      {footer && <>
        <Divider style={{ margin: '8px 0' }} />
        <div className="c-cron-footer">{footer}</div>
      </>}
    </div>
  )
})

;(Cron as CronComponentType).Provider = CronContext.Provider

export default Cron
