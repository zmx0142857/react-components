import { theme } from 'antd'

type Algorithm = typeof theme.defaultAlgorithm
export const algorithm: Algorithm = window.matchMedia('(prefers-color-scheme: dark)')?.matches ? theme.darkAlgorithm : theme.defaultAlgorithm
