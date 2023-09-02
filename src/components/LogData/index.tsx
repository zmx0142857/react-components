import './index.less'
import type { Any } from '@/utils/types'
import type { FC, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

type LogDataType = {
  tag: string
  id: number
  data: Any[]
}

type LogDataProps = {
  children?: ReactNode
  itemHeight?: number
}

const { log, warn, error } = console

/**
 * Debug console for mobile web -- with virtual scroll
 */
const LogData: FC<LogDataProps> = ({ children, itemHeight = 24 }) => {
  const [show, setShow] = useState(false)
  const [logData, setLogData] = useState<LogDataType[]>([])
  const [range, setRange] = useState([0, 0])

  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let id = 0
    console.log = (...args) => {
      log(...args)
      logMessage('log', id++, ...args)
    }
    console.warn = (...args) => {
      warn(...args)
      logMessage('warn', id++, ...args)
    }
    console.error = (...args) => {
      error(...args)
      logMessage('error', id++, ...args)
    }
    return () => {
      console.log = log
      console.warn = warn
      console.error = error
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (show) {
      toBottom(logData.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, logData.length])

  const logMessage = (tag: string, id: number, ...args: object[]) => {
    setLogData(logData => {
      try {
        logData.push({ tag, id, data: args.map(v => JSON.stringify(v)) })
      } catch {
        logData.push({ tag, id, data: args })
      }
      return [...logData]
    })
  }

  const onScroll = () => {
    if (!container.current) return
    const top = (container.current.scrollTop | 0) + 1
    const bottom = top + container.current.offsetHeight | 0
    const range = [top / itemHeight | 0, (bottom / itemHeight | 0) + 1]
    setRange(range)
  }

  const toBottom = (length: number) => {
    if (!container.current) return
    const height = container.current.offsetHeight
    const range = [Math.max(0, length - (height / itemHeight | 0)), length]
    setRange(range)
    setTimeout(() => {
      container.current?.scrollTo({
        top: itemHeight * length
      })
    }, 0)
  }

  return (
    <div className="c-log-data">
      <div className="c-log-data-btns">
        <button className="c-log-data-btn" onClick={() => setShow(v => !v)}>显示/隐藏</button>
        &nbsp;
        <button className="c-log-data-btn" onClick={() => setLogData([])}>清空</button>
        {children}
      </div>
      {show && ( // virtual scroll
        <div ref={container} className="c-log-data-container" onScroll={onScroll}>
          <div className="c-log-data-list" style={{ top: itemHeight * range[0], paddingBottom: itemHeight * (logData.length - range[1]) }}>
            {logData.slice(...range).map((item) => (
              <div key={item.id} className={'c-log-data-item c-log-data-' + item.tag}>{item.data.map(v => String(v))}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LogData