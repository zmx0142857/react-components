import './index.less'
import classnames from 'classnames'
import type { FC, ReactNode } from 'react'
import { Checkbox, List, Modal, Button, Pagination, Tag, Input, Divider } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import useModal from '@/hooks/useModal'
import type { Any, FetchType } from '@/utils/types'
import usePager from '@/hooks/usePager'

type ValueType = { value: Any, label: Any }
type ListSelectType = {
  title?: string
  value?: ValueType[]
  initialValue?: ValueType[]
  className?: string
  style?: object
  disabled?: boolean
  fetch?: FetchType<ValueType>
  getContainer?: () => HTMLElement
  renderItem?: (item: object) => ReactNode
  renderDescription?: (item: object) => ReactNode
  canSelect?: (item: object) => boolean
  onChange?: (data: object) => void
  onCheck?: ({ checked, item, data }: { checked: boolean, item: object, data: object }) => void
  onCheckAll?: ({ checked, data }: { checked: boolean, data: object }) => void
}

const hasValue = (data: ValueType[], value: Any) => {
  return data.some(v => v.value === value)
}

/**
 * 列表多选组件
 */
const ListSelect: FC<ListSelectType> = ({
  title = '',
  value, // [{ value, label }]
  onChange,
  initialValue,
  className,
  style,
  disabled,
  fetch,
  getContainer,
  renderItem,
  renderDescription,
  canSelect = () => true,
  onCheck,
  onCheckAll,
}) => {
  const pager = usePager<ValueType>(fetch, { debounce: 500 })
  const [oldData, setOldData] = useState<ValueType[]>(initialValue || [])
  const [modal, setModal] = useModal<ValueType[]>(initialValue || [])
  const isCheckAll = useMemo(() => {
    return pager.data.every((v: ValueType) => hasValue(modal.data || [], v.value) || !canSelect(v))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.data, pager.data])

  useEffect(() => {
    if (modal.show) {
      pager.list()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.show])

  useEffect(() => {
    if (value) {
      setOldData(value)
      setModal({ ...modal, data: value })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const onCheckItem = (checked: boolean, item: ValueType) => {
    let data = modal.data
    if (checked) {
      if (!hasValue(modal.data, item.value)) {
        data = [...modal.data, item]
        setModal({ ...modal, data })
      }
    } else {
      data = modal.data.filter((v: ValueType) => v.value !== item.value)
      setModal({ ...modal, data })
    }
    onCheck?.({ checked, item, data })
  }

  const onCheckAllItems = (checked: boolean) => {
    let data = modal.data
    if (checked) {
      data = [
        ...modal.data,
        ...pager.data.filter(v => !hasValue(modal.data, v.value) && canSelect(v)),
      ]
      setModal({ ...modal, data })
    } else {
      data = modal.data.filter((u: ValueType) => !pager.data.some(v => u.value === v.value))
      setModal({ ...modal, data })
    }
    onCheckAll?.({ checked, data })
  }

  const closeModal = (data?: ValueType[]) => {
    setModal({
      ...modal,
      show: false,
      data: data || modal.data,
    })
  }

  const onEdit = () => setModal({
    show: true,
    type: 'listSelect',
    title: '请选择' + title,
    data: modal.data,
  })

  return (
    <div className={classnames('c-list-select', className)} style={style}>
      <span className="c-list-select-display">
        {oldData.map((v: ValueType) => <Tag key={String(v.value)}>{String(v.label)}</Tag>)}
        {!disabled &&
          <Button
            style={{ width: 32, height: 22 }}
            size="small"
            title="编辑"
            icon={<EditOutlined />}
            onClick={onEdit}
            disabled={disabled}
          />
        }
      </span>
      <Modal
        className="c-list-select-modal"
        title={modal.title}
        open={modal.show}
        onCancel={() => closeModal(oldData)}
        width={500}
        bodyStyle={{ height: 640 }}
        footer={null}
        getContainer={getContainer}
      >
        {modal.show && <>
          <div className="c-list-select-header">
            <Input.Search placeholder={'搜索' + title} onSearch={keyword => pager.onSearch({ label: keyword })} />
            {pager.data.length ?
              <div className="ant-list-item">
                <Checkbox
                  checked={isCheckAll}
                  onChange={e => onCheckAllItems(e.target.checked)}
                >全选当前页</Checkbox>
              </div>
              : <div />
            }
          </div>
          <Divider />
          <List
            dataSource={pager.data}
            loading={pager.loading}
            rowKey="value"
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Checkbox
                      disabled={!canSelect(item)}
                      checked={modal.data.some(v => v.value === item.value)}
                      onChange={e => onCheckItem(e.target.checked, item)}
                    >{renderItem ? renderItem(item) : String(item.label)}</Checkbox>
                  }
                  description={renderDescription?.(item)}
                />
              </List.Item>
            )}
          />
          {pager.total > pager.size && <>
            <Divider />
            <Pagination
              showQuickJumper={false}
              showSizeChanger={false}
              current={pager.page}
              pageSize={pager.size}
              total={pager.total}
              onChange={pager.onChange}
            />
          </>}
        </>
        }
        <div className="c-list-select-footer">
          <Button type="primary" onClick={() => { onChange?.(modal.data); closeModal() }}>确定</Button>
          <Button onClick={() => closeModal(oldData)}>取消</Button>
        </div>
      </Modal>
    </div>
  )
}

export default ListSelect