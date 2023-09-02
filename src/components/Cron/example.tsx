import { useRef } from 'react'
import Cron, { type CronRef } from '.'
import { Button } from 'antd'

const CronExample = () => {
  const cron = useRef<CronRef>()
  return (
    <Cron
      ref={cron}
      value="0 0 0 * * ? *"
      tabs={{ year: false }}
      footer={
        <>
          <Button type="primary" onClick={() => console.log(cron.current?.getValue())}>
            确定
          </Button>
          <Button onClick={() => console.log(cron.current?.getDesc())}>描述</Button>
        </>
      }
    />
  )
}

export default CronExample