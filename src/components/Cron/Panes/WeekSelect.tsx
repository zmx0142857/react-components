import { Select, SelectProps } from 'antd'
import useLanguage from '../useLanguage'

function WeekSelect (props: SelectProps) {
  const language = useLanguage(['weekdays'])
  return (
    <Select
      className="c-cron-week-select"
      size="small"
      options={
        Object.entries(language.weekdays).map(([key, value]) => ({ value: key, label: value }))
      }
      onClick={e => e.preventDefault()} // 防止 select 受到 radio 的影响自动收回
      {...props}
    />
  )
}

export default WeekSelect
