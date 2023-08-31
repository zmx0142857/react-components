import LogData from '.'

const LogDataExample = () => {
  const randomLog = () => {
    const { log, warn, error } = console
    const fn = [log, warn, error][Math.random() * 3 | 0]
    fn(Math.random())
  }
  return <>
    <LogData />
    <button onClick={randomLog} style={{ position: 'absolute', top: 0, left: 108 }}>测试</button>
  </>
}

export default LogDataExample