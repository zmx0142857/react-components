export type Any = undefined | null | boolean | number | string | object
export type FetchParams = {
  label?: string
  value?: string
  page?: number
  size?: number
}
export type FetchReturns<T = object> = {
  status: number
  data: T[]
  total: number
  desc?: string
}
export type FetchType<T> = (props: FetchParams) => Promise<FetchReturns<T>>