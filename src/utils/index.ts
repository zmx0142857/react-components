import type { Any, FetchParams } from './types'

/**
 * 防抖
 */
export const debounce = () => {
  let timer: NodeJS.Timeout // ReturnType<typeof setTimeout>
  const debounced = (fn: () => void, delay = 500) => {
    clearTimeout(timer)
    timer = setTimeout(fn, delay)
  }
  return debounced
}

/**
 * 节流
 */
export const throttle = () => {
  let timer: NodeJS.Timeout | null
  const throttled = (fn: () => void, delay = 500) => {
    if (timer) return
    timer = setTimeout(() => {
      timer = null
    }, delay)
    fn()
  }
  return throttled
}

/**
 * 保证返回的 value 满足 min <= value <= max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const between = (value: number, min: number, max: number): number => {
  return Math.max(Math.min(value, max), min)
}

/**
 * 载入图片
 * @param {string} src 图片地址
 * @returns {Promise<HTMLImageElement>}
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  const img = new window.Image()
  img.src = src
  return new Promise((resolve) => {
    img.onload = () => {
      resolve(img)
    }
  })
}

/**
 * 压缩图片, 返回 base64
 * @param {File} file 文件
 * @param {object} options 选项
 * @returns {Promise<string>}
 */
export const compressPicture = (file: File, { width = 0, height = 0, level = 0.8 } = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const img = new window.Image()
      img.src = reader.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject('ctx is null')
        if (!width) width = img.width
        if (!height) height = img.height
        // if (window.navigator.userAgent.indexOf('iPhone') > 0) {
        //     canvas.width = height;
        //     canvas.height = width;
        //     ctx.rotate(90 * Math.PI / 180);
        //     ctx.drawImage(img, 0, -height, width, height)
        // } else {
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        // }
        const base64 = canvas.toDataURL('image/jpeg', level)
        resolve(base64)
      }
    }
  })
}

/**
 * 将 base64 转为文件
 * @param {string} base64 
 * @returns {Blob}
 */
export const base64ToBlob = (base64: string): Blob => {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1]
  const bstr = window.atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * 解析 json，失败时返回默认值
 * @param {string | undefined | null} str
 * @returns {object}
 */
export const parseJson = (str: string | undefined | null, defaultValue = {}): object => {
  if (!str) return defaultValue
  try {
    return JSON.parse(str)
  } catch (err) {
    return defaultValue
  }
}

/**
 * 从对象中过滤出满足函数条件的字段
 * @param {object} obj 对象
 * @param {Function} fn 函数
 * @returns {object}
 */
export const pickBy = (obj: object, fn: (value: object, key: string) => boolean): object => {
  return Object.fromEntries(Object.entries(obj).filter(v => fn(v[1], v[0])))
}

export const sleep = (delay: number) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

export const pagerApi = (name: string, dataSource: { [k in string]: Any }[], { labelKey = 'label', valueKey = 'value', delay = 10 } = {}) => {
  const fetch = async (params: FetchParams = {}) => {
    const { label = '', value = '', page = 1, size = 10 } = params
    await sleep(delay)
    const filteredList = value
      ? dataSource.filter(v => { const a = v[valueKey]; return a === value || typeof a === 'string' && a.includes(value) })
      : dataSource.filter(v => { const a = v[labelKey]; return a === value || typeof a === 'string' && a.includes(label.trim()) })
    const data = filteredList.slice(size * (page - 1), size * page)
    const res = { status: 0, data, total: filteredList.length }
    console.log('[pagerApi]', name, params, res)
    return res
  }
  return fetch
}
