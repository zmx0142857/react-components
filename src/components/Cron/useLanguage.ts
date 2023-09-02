import { useContext, useMemo } from 'react'
import { defaultContext, mergeConfig } from './config'
import CronContext from './CronContext'

const useLanguage = (keys: string[]) => {
  const context = useContext(CronContext)
  return useMemo(() => mergeConfig(
    context.language,
    defaultContext.language,
    keys
  ), [context.language, keys]) as typeof defaultContext.language
}

export default useLanguage