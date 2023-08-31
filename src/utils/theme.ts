import { theme } from 'antd'

export const algorithm = window.matchMedia('(prefers-color-scheme: dark)')?.matches ? theme.darkAlgorithm : theme.defaultAlgorithm
