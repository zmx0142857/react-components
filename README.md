## 实用 react 组件库

- Cron: 定时任务 cron 表达式编辑器
- DatGui: 手风琴式的可折叠设置菜单
- DragWindow: 可拖动窗口
- EditForm: 高度灵活、可配置的表单组件
- ImageUpload: 图片上传
- ImageView: 可拖动的图片容器
- ObjectEditor: JavaScript 对象编辑器
- LogData: 虚拟滚动的日志列表组件, 可用于移动端调试

## Examples

```tsx
import React, { useRef } from 'react'
import { Cron, type CronRef } from '@zmx0142857/react-components'
import { Button } from 'antd'
import '@zmx0142857/react-components/style.css'

const CronExample = () => {
  const cron = useRef<CronRef>(null)
  return (
    <div style={{ width: 550, height: 500 }}>
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
    </div>
  )
}

export default CronExample
```

更多示例参见 `src/examples` 目录.

## Scripts

- `pnpm dev`: 启动开发服务器
- `pnpm build`: 编译示例网站页面, 输出到 `dist/`
- `pnpm build:lib`: 编译组件库, 输出到 `lib/`
