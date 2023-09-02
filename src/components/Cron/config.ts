export const defaultContext = {
  language: {
    tabs: {
      second: '秒',
      minute: '分',
      hour: '时',
      day: '日',
      month: '月',
      week: '周',
      year: '年',
    },
    every: {
      second: '每一秒钟',
      minute: '每一分钟',
      hour: '每一小时',
      day: '每日',
      month: '每月',
      week: '每天',
      year: '每年',
    },
    assign: '指定',
    none: '不指定',
    dash: {
      second: '从 {A} - {B} 秒，每秒执行一次',
      minute: '从 {A} - {B} 分，每分钟执行一次',
      hour: '从 {A} - {B} 时，每小时执行一次',
      day: '从 {A} - {B} 日，每天执行一次',
      month: '从 {A} - {B} 月，每月执行一次',
      week: '从 {A} - {B}，每天执行一次',
      year: '从 {A} - {B} 年，每年执行一次',
    },
    slash: {
      second: '从 {A} 秒开始，每 {B} 秒执行一次',
      minute: '从 {A} 分开始，每 {B} 分钟执行一次',
      hour: '从 {A} 时开始，每 {B} 小时执行一次',
      day: '从 {A} 日开始，每 {B} 天执行一次',
      month: '从 {A} 月开始，每 {B} 月执行一次',
      week: '从 {A} 开始，每 {B} 天执行一次',
      year: '从 {A} 年开始，每 {B} 年执行一次',
    },
    harsh: '本月第 {A} 周的 {B} 执行一次',
    last: '本月的最后一个 {A} 执行一次',
    weekdays: {
      SUN: '星期日',
      MON: '星期一',
      TUE: '星期二',
      WED: '星期三',
      THU: '星期四',
      FRI: '星期五',
      SAT: '星期六',
    },
  },
}

type ConfigType = Record<string, unknown>
export function mergeConfig<T extends ConfigType>(config: T, defaultConfig: T, keys: string[]) {
  const res: ConfigType = {}
  keys.forEach(key => {
    res[key] = config[key] || defaultConfig[key]
    if (!Array.isArray(defaultConfig[key]) && typeof defaultConfig[key] === 'object') {
      res[key] = Object.assign({}, defaultConfig[key], config[key])
    }
  })
  return res
}
