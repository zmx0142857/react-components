import './index.less'
import classnames from 'classnames'
import type { FC, ReactNode } from 'react'
import type { TransferDirection } from 'antd/es/transfer'
import { Pagination, Spin, Transfer } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import type { TransferListProps } from 'antd/lib/transfer'
import type { FetchType } from '@/utils/types'
import usePager from '@/hooks/usePager'

let timer: NodeJS.Timeout

type ValueType = {
  value: string
  label: string
}
type TransferFooter = (props: TransferListProps<ValueType>, info: { direction: TransferDirection } | undefined) => ReactNode
type TransferInputProps = {
  value?: ValueType[]
  initialValue?: ValueType[]
  fetch?: FetchType<ValueType>
  onSearch?: (direction: TransferDirection, value: string) => void
  onChange?: (targetItems: ValueType[], { targetKeys, direction, moveKeys }: { targetKeys: string[], direction: TransferDirection, moveKeys: string[] }) => void
  className?: string
  showSearch?: boolean
  footer?: TransferFooter
}

/**
 * 自定义穿梭框组件
 */
const TransferInput: FC<TransferInputProps> = ({
  value = [],
  initialValue = [],
  fetch,
  className,
  showSearch = false,
  footer,
  ...props
}) => {
  const pager = usePager<ValueType>(fetch, { debounce: 500 })
  const [targetItems, setTargetItems] = useState(initialValue)
  const targetKeys = useMemo(() => targetItems.map(v => v.value), [targetItems])
  const dataSource = useMemo(() => [...targetItems, ...pager.data], [targetItems, pager.data])

  useEffect(() => {
    pager.list()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (value) {
      setTargetItems(value)
    }
  }, [value])

  const onSearch = (direction: TransferDirection, value: string) => {
    props.onSearch?.(direction, value)
    if (direction === 'left') {
      // debounce
      clearTimeout(timer)
      timer = setTimeout(() => {
        pager.list({ label: value })
      }, 300)
    }
  }

  const onChange = (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    let newItems
    if (direction === 'right') { // right, 增加
      newItems = [
        ...targetItems,
        ...pager.data.filter(item => moveKeys.includes(item.value))
      ]
    } else { // left, 减少
      newItems = targetItems.filter(item => !moveKeys.includes(item.value))
    }
    setTargetItems(newItems)
    props.onChange?.(newItems, { targetKeys, direction, moveKeys })
  }

  // 自定义穿梭框底部组件
  const renderFooter: TransferFooter = ({ direction }) => direction === 'left' && (
    <Pagination
      simple
      size="small"
      current={pager.page}
      pageSize={pager.size}
      total={pager.total}
      onChange={pager.onChange}
    />
  )

  return (
    <div  className={classnames('c-transfer-input', className)}>
      <Spin spinning={pager.loading}>
        <Transfer
          targetKeys={targetKeys}
          rowKey={item => item.value}
          render={item => item.label}
          dataSource={dataSource}
          showSearch={showSearch}
          {...props}
          onChange={onChange}
          footer={fetch ? renderFooter : footer}
          onSearch={showSearch ? onSearch : undefined}
        />
      </Spin>
    </div>
  )
}

export default TransferInput