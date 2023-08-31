import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

type ModalType = {
  show: boolean
  type: string
  title: string
  data: object
}
interface ModalType1 extends ModalType {
  push: (values: object) => void
  reset: () => void
  hide: () => void
}
type ModalReturns = [ModalType1, Dispatch<SetStateAction<ModalType>>]

const useModal = (data?: object): ModalReturns => {

  const initValue = () => ({
    show: false,
    type: '',
    title: '',
    data: data || {},
  })

  const [modal, setModal] = useState<ModalType>(initValue)

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