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
  search: string
  page: number
  size: number
  total: number
  data: T[]
}
export type PagerReturns<T> = ReturnType<typeof usePager<T>>

/**
 * 带状态的分页查询
 * @param run 请求方法
 * @param mapParams 参数映射
 * @param mapList 列表映射
 */
function usePager<T = object>(run?: ApiType, { page = 1, size = 10, mapParams, mapList, debounce = 0 }: OptionsType = {}) {

  const [pager, setPager] = useState<PagerType<T>>({
    search: '',
    page,
    size,
    total: 0,
    data: [],
  })

  const fetch = useFetch(run, { mapParams, mapList, debounce })

  // 两次 setPager 将引起两次组件渲染
  const list = async ({ label = pager.search, page = pager.page, size = pager.size }: FetchParams = {}) => {
    setPager(pager => ({
      ...pager,
      search: label,
      page,
      size,
    }))
    const { status, data, total } = await fetch({ label, page, size })
    if (status === 0) {
      setPager(pager => ({
        ...pager,
        total,
        data: data as T[],
      }))
    }
  }

  const onChange = (page: number, size: number) => {
    list({ page, size })
  }

  return { ...pager, setPager, list, onChange, loading: fetch.loading };
}

export default usePager