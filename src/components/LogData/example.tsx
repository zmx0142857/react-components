import LogData from '.'

const LogDataExample = () => {
  const randomLog = () => {
    const { log, warn, error } = console
    const fn = [log, warn, error][Math.random() * 3 | 0]
    fn(Math.random())
  }
  return <>
    <LogData>
      &nbsp;
      <button onClick={randomLog}>测试</button>
    </LogData>
  </>
}

export default LogDataExample