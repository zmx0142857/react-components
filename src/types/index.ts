export type Any = undefined | null | boolean | number | string | object
export type FetchParams = {
  label?: string
  value?: string
  page?: number
  size?: number
}
export type FetchReturns = {
  status: number
  data: object[]
  total: number
}
export type FetchType = (props: FetchParams) => Promise<FetchReturns>