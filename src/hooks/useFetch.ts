import type { FetchParams, FetchReturns, FetchType } from '@/utils/types'
import { message } from 'antd'
import { useCallback, useRef, useState } from 'react'

type IsFetch = {
  isFetch?: boolean
  loading?: boolean
  cancel?: () => void
}
type ApiType = (params: object) => Promise<FetchReturns>
type OptionsType = {
  mapParams?: (params: FetchParams) => object
  mapList?: (params: object) => object
  debounce?: number
}

/**
 * 获取分页列表
 * @param api 请求方法
 * @param options.mapParams 参数映射
 * @param options.mapList 列表映射
 */
const useFetch = (api?: ApiType & IsFetch, { mapParams, mapList, debounce = 0 }: OptionsType = {}) => {
  const [loading, setLoading] = useState(false)
  const timer = useRef<NodeJS.Timeout>()
  const count = useRef(0)

  const run = async (params: FetchParams, defaultValue: FetchReturns) => {
    try {
      if (!api) throw new Error('useFetch: api is undefined')
      params = mapParams ? mapParams(params) : params
      return api(params)
    } catch (err) {
      console.error(err)
    }
    return defaultValue
  }

  const runDebounced = (params: FetchParams, defaultValue: FetchReturns): Promise<FetchReturns> => {
    return new Promise((resolve) => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        resolve(run(params, defaultValue))
      }, debounce)
    })
  }

  const fetch: FetchType & IsFetch = useCallback(async (params: FetchParams) => {
    let res: FetchReturns = { status: -1, data: [], total: 0, desc: '网络异常' }

    const requestId = count.current
    setLoading(true)
    // 以 value 进行搜索时不必 debounce
    if (debounce && !params.value) {
      res = await runDebounced(params, res)
    } else {
      res = await run(params, res)
    }
    setLoading(false)
    // 若请求返回前调用 cancel(), 则 count 计数改变，丢弃请求结果
    if (requestId !== count.current) {
      throw new Error('request canceled')
    }

    if (res.status === 0) {
      res.data = mapList ? res.data.map(mapList) : res.data
      return res
    } else {
      message.error(res.desc)
    }
    return res
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])
  fetch.isFetch = true
  fetch.loading = loading
  fetch.cancel = () => {
    ++count.current
  }

  if (typeof api === 'function' && api.isFetch) return api
  return fetch
}

export default useFetch