import type { FetchParams, FetchReturns } from '@/utils/types'
import { useState } from 'react'
import useFetch from './useFetch'

type ApiType = (params: object) => Promise<FetchReturns>
type OptionsType = {
  mapParams?: (params: FetchParams) => object
  mapList?: (params: object) => object
  debounce?: number
  page?: number
  size?: number
}
type PagerType<T> = {
  page: number
  size: number
  total: number
  data: T[]
}
type PagerParams = {
  search?: object
  page?: number
  size?: number
}
export type PagerReturns<T> = ReturnType<typeof usePager<T>>

/**
 * 带状态的分页查询
 * @param run 请求方法
 * @param mapParams 参数映射
 * @param mapList 列表映射
 */
function usePager<T = object>(run?: ApiType, { page = 1, size = 10, mapParams, mapList, debounce = 0 }: OptionsType = {}) {
  const [searchData, setSearchData] = useState({})
  const [pager, setPager] = useState<PagerType<T>>({
    page,
    size,
    total: 0,
    data: [],
  })

  const fetch = useFetch(run, { mapParams, mapList, debounce })

  // 两次 setPager 将引起两次组件渲染
  const list = async ({ search = searchData, page = pager.page, size = pager.size }: PagerParams = {}) => {
    setSearchData(search)
    setPager(pager => ({
      ...pager,
      page,
      size,
    }))
    const { status, data, total } = await fetch({ ...search, page, size })
    if (status === 0) {
      setPager(pager => ({
        ...pager,
        total,
        data: data as T[],
      }))
    }
  }

  // 下面几个函数都是 list 的简写

  // 翻页
  const onChange = (page: number, size: number) => {
    list({ page, size })
  }

  // 搜索
  const onSearch = (search: object) => {
    list({ search, page: 1 })
  }

  // 删除后刷新
  const onDelete = () => {
    if (pager.page > 1 && pager.data.length === 1) {
      list({ page: pager.page - 1 })
    } else {
      list()
    }
  }

  return {
    ...pager,
    setPager,
    searchData,
    list,
    onChange,
    onSearch,
    onDelete,
    loading: fetch.loading,
    cancel: fetch.cancel,
  }
}

export default usePager