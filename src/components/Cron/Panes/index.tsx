import { DayParser, HourParser, MinuteParser, MonthParser, SecondParser, WeekParser, YearParser } from '../parser'
import Pane from './Pane'
import WeekPane from './WeekPane'

const Panes = {
  second: { Pane, Parser: SecondParser },
  minute: { Pane, Parser: MinuteParser },
  hour: { Pane, Parser: HourParser },
  day: { Pane, Parser: DayParser },
  month: { Pane, Parser: MonthParser },
  week: { Pane: WeekPane, Parser: WeekParser },
  year: { Pane, Parser: YearParser },
}

export default Panes