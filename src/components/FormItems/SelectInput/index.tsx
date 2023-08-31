import { useEffect, type FC } from 'react'
import type { FetchType } from '@/utils/types'
import { Divider, Pagination, Select, Space, Spin } from 'antd'
import { usePager } from '@/hooks/usePager'

type SelectInputProps = {
  fetch?: FetchType
  value?: string
}

const SelectInput: FC<SelectInputProps> = ({ fetch, ...props }) => {
  const pager = usePager(fetch, {
    debounce: 500,
    size: 8,
  })

  useEffect(() => {
    if (fetch) {
      // 组件首次加载时, 用 value 请求一次接口, 用于回显 label. 后续请求 (onSearch) 都是用 label 而不是 value
      pager.list({ value: props.value })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const TODO = '在输入框中输入一些文本后, 点击页面空白处, 输入框被清空, 也会触发 onSearch. 如何避免这个不必要的请求?'
  const onSearch = (label: string) => {
    if (fetch) {
      pager.list({ label })
    }
  }

  // 传入 fetch 函数时, Select 组件具有请求 api 的搜索能力
  return fetch ? (
    <Select
      showSearch
      filterOption={false} // 默认 true 时, antd 会过滤出 value=search 的选项, 这不是我们想要的. 我们想要 label.includes(search) 的选项, 这一点由 api 来保证即可. 因此这里填 false
      onSearch={onSearch}
      onFocus={() => onSearch('')}
      options={pager.data}
      loading={pager.loading}
      dropdownRender={(menu) => (
        <>
          <Spin spinning={pager.loading}>
            {menu}
          </Spin>
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 4px' }}>
            <Pagination
              current={pager.page}
              pageSize={pager.size}
              total={pager.total}
              onChange={pager.onChange}
              simple
            />
          </Space>
        </>
      )}
      {...props}
    />
  ) : <Select {...props} />
}

export default SelectInput