import type { FetchParams, FetchReturns } from '@/types'
import { useState } from 'react'
import { useFetch } from './useFetch'

type ApiType = (params: object) => Promise<FetchReturns>
type OptionsType = {
  mapParams?: (params: FetchParams) => object
  mapList?: (params: object) => object
}
type PagerType = {
  search: string
  page: number
  size: number
  total: number
  data: object[]
}

/**
 * 带状态的分页查询
 * @param run 请求方法
 * @param mapParams 参数映射
 * @param mapList 列表映射
 */
export function usePager(run?: ApiType, { mapParams, mapList }: OptionsType = {}) {

  const [pager, setPager] = useState<PagerType>({
    search: '',
    page: 1,
    size: 10,
    total: 0,
    data: [],
  })

  const fetch = useFetch(run, { mapParams, mapList })

  const list = async (params: FetchParams) => {
    setPager({
      ...pager,
      search: params.label ?? pager.search,
      page: params.page ?? pager.page,
      size: params.size ?? pager.size,
    })
    const { status, data, total } = await fetch(params)
    if (status === 0) {
      setPager({
        ...pager,
        total,
        data,
      })
    }
  }

  const onChange = (page: number, size: number) => {
    list({ page, size })
  }

  return { ...pager, setPager, list, onChange };
}
