import type { FC } from 'react'
import type { FetchType } from '@/types'
import { Select } from 'antd'
import { usePager } from '@/hooks/usePager'

type SelectInputProps = {
  fetch?: FetchType
}

const SelectInput: FC<SelectInputProps> = ({ fetch , ...props }) => {
  const pager = usePager(fetch)
  if (fetch) {
    return (
      <Select
        showSearch
        onSearch={label => pager.list({ label })}
        options={pager.data}
        {...props}
      />
    )
  }
  return <Select {...props} />
}

export default SelectInput