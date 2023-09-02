import { defaultContext } from './config'

export const cronRegex = {
  second: /^\*$|^\?$|(^([0-9]|[1-5][0-9])-([0-9]|[1-5][0-9])$)|(^([0-9]|[1-5][0-9])\/\d+$)|(^(([0-9]|[1-5][0-9]),)*([0-9]|[1-5][0-9])$)/,
  minute: /^\*$|^\?$|(^([0-9]|[1-5][0-9])-([0-9]|[1-5][0-9])$)|(^([0-9]|[1-5][0-9])\/\d+$)|(^(([0-9]|[1-5][0-9]),)*([0-9]|[1-5][0-9])$)/,
  hour: /(^\*$)|^\?$|(^([0-9]|(1[0-9])|(2[0-3]))-([0-9]|(1[0-9])|(2[0-3]))$)|(^([0-9]|(1[0-9])|(2[0-3]))\/\d+$)|(^(([0-9]|(1[0-9])|(2[0-3])),)*([0-9]|(1[0-9])|(2[0-3]))$)/,
  day: /^\*$|^\?$|(^([1-9]|[1-2][0-9]|3[0-1])-([1-9]|[1-2][0-9]|3[0-1])$)|(^([1-9]|[1-2][0-9]|3[0-1])\/\d+$)|(^(([1-9]|[1-2][0-9]|3[0-1]),)*([1-9]|[1-2][0-9]|3[0-1])$)/,
  month: /^\*$|(^([1-9]|1[0-2])-([1-9]|1[0-2])$)|(^([1-9]|1[0-2])\/\d+$)|(^(([1-9]|1[0-2]),)*([1-9]|1[0-2])$)/,
  week: /^\*$|^\?$|(^(SUN|MON|TUE|WED|THU|FRI|SAT)-(SUN|MON|TUE|WED|THU|FRI|SAT)$)|(^(SUN|MON|TUE|WED|THU|FRI|SAT)#\d+$)|(^(SUN|MON|TUE|WED|THU|FRI|SAT)L$)|(^((SUN|MON|TUE|WED|THU|FRI|SAT),)*(SUN|MON|TUE|WED|THU|FRI|SAT)$)/,
  // year: /^\*$|^\?$|(^(2019|20[2-5][0-9]|206[0-6])-(2019|20[2-5][0-9]|206[0-6])$)|(^(2019|20[2-5][0-9]|206[0-6])\/\d+$)|(^((2019|20[2-5][0-9]|206[0-6]),)*(2019|20[2-5][0-9]|206[0-6])$)/,
  year: /^\*$|^\?$|^((\d{4,4})(,?))+$|(^(\d{4,})(-|,|\/)(\d{4,}|\d{1,2}|)+$)/,
  placeholder: /{[A-Z]}/g,
}

export enum Keys {
  second = 'second',
  minute = 'minute',
  hour = 'hour',
  day = 'day',
  month = 'month',
  week = 'week',
  year = 'year',
}

export const keys: Keys[] = [
  Keys.second,
  Keys.minute,
  Keys.hour,
  Keys.day,
  Keys.month,
  Keys.week,
  Keys.year,
]

export type CronData = { [k in Keys]: string }

export enum FieldType {
  every = 1,
  dash = 2,
  slash = 3,
  assign = 4,
  none = 5,
  harsh = 6,
  last = 7,
}

export type CronField = {
  type: FieldType
  dash: (number | string)[]
  slash: number[]
  assign: string[]
  harsh?: [string, number]
  last?: string
  min: number
  max: number
}

export class Parser {
  get key () {
    return Keys.second
  }

  defaultCron (): CronData {
    return {
      second: '0',
      minute: '0',
      hour: '0',
      day: '*',
      month: '*',
      week: '?',
      year: '*',
    }
  }

  cron (value: string): CronData {
    const defaultData = this.defaultCron()
    if (value) {
      try {
        const [second, minute, hour, day, month, week, year] = value.split(' ')
        return {
          second: cronRegex.second.test(second) ? second : defaultData.second,
          minute: cronRegex.minute.test(minute) ? minute : defaultData.minute,
          hour: cronRegex.hour.test(hour) ? hour : defaultData.hour,
          day: cronRegex.day.test(day) ? day : defaultData.day,
          month: cronRegex.month.test(month) ? month : defaultData.month,
          week: cronRegex.week.test(week) && day === '?' ? week : defaultData.week,
          year: cronRegex.year.test(year) ? year : defaultData.year,
        }
      } catch (err) {
        console.error(err)
      }
    }
    return defaultData
  }

  default (): CronField {
    return {
      type: FieldType.assign,
      dash: [0, 10],
      slash: [0, 1],
      assign: ['0'],
      min: 0,
      max: 59,
    }
  }

  fromString (value: string): CronField {
    const res = this.default()
    if (value === '*') {
      res.type = FieldType.every
    } else if (value === '?') {
      res.type = FieldType.none
    } else if (value.includes('-')) {
      res.type = FieldType.dash
      res.dash = value.split('-').map(v => parseInt(v))
    } else if (value.includes('/')) {
      res.type = FieldType.slash
      res.slash = value.split('/').map(v => parseInt(v))
    } else {
      res.type = FieldType.assign
      res.assign = value ? value.split(',') : res.assign
    }
    return res
  }

  toString (data: CronField): string {
    switch (data.type) {
      case FieldType.every:
        return '*'
      case FieldType.dash:
        return `${data.dash[0]}-${data.dash[1]}`
      case FieldType.slash:
        return `${data.slash[0]}/${data.slash[1]}`
      case FieldType.assign:
        return data.assign.join(',')
      case FieldType.none:
        return '?'
      default:
        return ''
    }
  }

  toDesc (data: CronField, language: typeof defaultContext.language): string {
    switch (data.type) {
      case FieldType.every:
        return language.every[this.key]
      case FieldType.assign:
        return `${data.assign.join(',')} ${language.tabs[this.key]}`
      case FieldType.dash:
        return language.dash[this.key].replace('{A}', String(data.dash[0])).replace('{B}', String(data.dash[1]))
      case FieldType.none:
        return ''
      case FieldType.slash:
        return language.slash[this.key].replace('{A}', String(data.slash[0])).replace('{B}', String(data.slash[1]))
      default:
        return ''
    }
  }
}

export class SecondParser extends Parser {
  get key () {
    return Keys.second
  }
}

export class MinuteParser extends Parser {
  get key () {
    return Keys.minute
  }
}

export class HourParser extends Parser {
  get key () {
    return Keys.hour
  }

  default (): CronField {
    const res = super.default()
    res.max = 23
    return res
  }
}

export class DayParser extends Parser {
  get key () {
    return Keys.day
  }

  default (): CronField {
    return {
      type: FieldType.every,
      dash: [1, 10],
      slash: [1, 1],
      assign: ['1'],
      min: 1,
      max: 31,
    }
  }
}

export class MonthParser extends DayParser {
  get key () {
    return Keys.month
  }

  default (): CronField {
    const res = super.default()
    res.max = 12
    return res
  }
}

export class YearParser extends Parser {
  get key () {
    return Keys.year
  }

  default (): CronField {
    const min = new Date().getFullYear()
    const max = min + 59
    return {
      type: FieldType.every,
      dash: [min, max],
      slash: [min, 1],
      assign: [String(min)],
      min,
      max,
    }
  }
}

type Weekday = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'
export class WeekParser extends Parser {
  get key() {
    return Keys.week
  }

  default (): Required<CronField> {
    return {
      type: FieldType.none,
      dash: ['SUN', 'MON'],
      harsh: ['MON', 1],
      last: 'MON',
      assign: ['MON'],
      // 这三个字段没有用到
      slash: [0, 1],
      min: 0,
      max: 6,
    }
  }

  fromString (value: string): Required<CronField> {
    const res = this.default()
    if (value === '*') {
      res.type = FieldType.every
    } else if (value === '?') {
      res.type = FieldType.none
    } else if (value.includes('-')) {
      res.type = FieldType.dash
      res.dash = value.split('-').map(v => v.toUpperCase())
    } else if (value.includes('#')) {
      res.type = FieldType.harsh
      const [dayOfWeek, weekOfMonth] = value.split('#')
      res.harsh = [dayOfWeek, parseInt(weekOfMonth)]
    } else if (value.includes('L')) {
      res.type = FieldType.last
      const [lastWeekOfMonth] = value.split('L')
      res.last = lastWeekOfMonth
    } else {
      res.type = FieldType.assign
      res.assign = value ? value.split(',') : res.assign
    }
    return res
  }

  toString (data: CronField): string {
    switch (data.type) {
      case FieldType.every:
        return '*'
      case FieldType.dash:
        return `${data.dash[0]}-${data.dash[1]}`
      case FieldType.harsh:
        return `${data.harsh?.[0]}#${data.harsh?.[1]}`
      case FieldType.last:
        return `${data.last}L`
      case FieldType.assign:
        return data.assign.join(',')
      case FieldType.none:
        return '?'
      default:
        return ''
    }
  }

  toDesc (data: Required<CronField>, language: typeof defaultContext.language): string {
    switch (data.type) {
      case FieldType.every:
        return language.every[this.key]
      case FieldType.assign:
        return data.assign.map(v => language.weekdays[v as Weekday]).join(',')
      case FieldType.dash:
        return language.dash[this.key]
          .replace('{A}', language.weekdays[data.dash[0] as Weekday])
          .replace('{B}', language.weekdays[data.dash[1] as Weekday])
      case FieldType.harsh:
        return language.harsh
          .replace('{A}', String(data.harsh?.[1]) ?? '?')
          .replace('{B}', language.weekdays[data.harsh?.[0] as Weekday] ?? '?')
      case FieldType.last:
        return language.last.replace('{A}', language.weekdays[data.last as Weekday] ?? '?')
      case FieldType.none:
        return ''
      default:
        return ''
    }
  }
}
