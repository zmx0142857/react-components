import { useEffect, useRef, useState, type FC, type ReactNode } from 'react'
import type { FetchType } from '@/utils/types'
import { Divider, Pagination, Select, Space, Spin, type SelectProps } from 'antd'
import usePager from '@/hooks/usePager'

type OptionType = {
  value?: string | number
  label?: ReactNode
}

type SelectInputProps = Omit<SelectProps, 'options'> & {
  fetch?: FetchType<OptionType>
  options?: SelectProps['options']
  selectFirst?: boolean
}

const isEmpty = (value: unknown) => value === undefined || value === null || value === ''

const SelectInput: FC<SelectInputProps> = ({
  fetch, // 传入 fetch 函数时, Select 组件具有请求 api 的搜索能力
  selectFirst = false, // 默认选中第一项
  value,
  defaultValue,
  options,
  onChange,
  ...props
}) => {
  const pager = usePager<OptionType>(fetch, {
    debounce: 500,
    size: 8,
  })
  const [_value, setValue] = useState(defaultValue)
  const selectedFirst = useRef(false)

  useEffect(() => {
    if (fetch) {
      // 组件首次加载时, 用 value 请求一次接口, 用于回显 label. 后续请求 (onSearch) 都是用 label 而不是 value
      pager.onSearch({ value: value as string })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 默认选中第一项
  useEffect(() => {
    if (!isEmpty(value)) selectedFirst.current = true
    if (!selectFirst || selectedFirst.current) return
    const first = fetch ? pager.data[0] : options?.[0]
    if (!first) return
    selectedFirst.current = true
    setValue(first.value)
    onChange?.(first.value, first)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFirst, pager.data, options, value])

  // TODO: '在输入框中输入一些文本后, 点击页面空白处, 输入框被清空, 也会触发 onSearch. 如何避免这个不必要的请求?'
  const onSearch = (label: string) => {
    if (fetch) {
      pager.onSearch({ label })
    }
  }

  const onSelectChange: SelectProps['onChange'] = (value, option) => {
    setValue(value)
    onChange?.(value, option)
  }

  const selectValue = value ?? _value

  return fetch ? (
    <Select
      showSearch
      filterOption={false} // 默认 true 时, antd 会过滤出 value=search 的选项, 这不是我们想要的. 我们想要 label.includes(search) 的选项, 这一点由 api 来保证即可. 因此这里填 false
      onSearch={onSearch}
      onFocus={() => onSearch('')}
      options={pager.data}
      value={selectValue}
      loading={pager.loading}
      onChange={onSelectChange}
      popupRender={(menu) => (
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
  ) : (
    <Select
      options={options}
      value={selectValue}
      onChange={onSelectChange}
      {...props}
    />
  )
}

export default SelectInput
