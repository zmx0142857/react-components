import type { FetchParams, FetchReturns } from '@/types'

type ApiType = (params: object) => Promise<FetchReturns>
type OptionsType = {
  mapParams?: (params: FetchParams) => object
  mapList?: (params: object) => object
}

/**
 * 获取分页列表
 * @param api 请求方法
 * @param options.mapParams 参数映射
 * @param options.mapList 列表映射
 */
export const useFetch = (api?: ApiType, { mapParams, mapList }: OptionsType = {}) => {
  const fetch = async (params: FetchParams) => {
    params = mapParams ? mapParams(params) : params
    if (!api) throw new Error('api is undefined')
    const res = await api(params)
    const { status, total } = res
    if (status === 0) {
      const data = mapList ? res.data.map(mapList) : res.data
      return { status, data, total }
    }
    return { status, data: [], total: 0 }
  }
  return fetch
}
