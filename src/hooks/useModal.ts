import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

type ModalType<T> = {
  show: boolean
  type: string
  title: string
  data: T
}
interface ModalType1<T> extends ModalType<T> {
  push: (values: object) => void
  reset: () => void
  hide: () => void
}
type ModalReturns<T> = [ModalType1<T>, Dispatch<SetStateAction<ModalType<T>>>]

function useModal<T = object>(data: T = {} as T): ModalReturns<T> {

  const initValue = () => ({
    show: false,
    type: '',
    title: '',
    data,
  })

  const [modal, setModal] = useState<ModalType<T>>(initValue)

  // 表单重置
  const reset = () => {
    setModal(initValue())
  }

  // 隐藏
  const hide = () => {
    setModal(modal => ({
      ...modal,
      show: false,
    }))
  }

  // 表单回填
  const push = (values: object) => {
    setModal(modal => ({
      ...modal,
      // firstRender: false,
      data: {
        ...modal.data,
        ...values,
      }
    }))
  }

  return [{ ...modal, push, reset, hide }, setModal]
}

export default useModal