/**
 * 防抖
 */
export const debounce = () => {
  let timer: NodeJS.Timeout // ReturnType<typeof setTimeout>
  const debounced = (fn: () => void, delay = 300) => {
    clearTimeout(timer)
    timer = setTimeout(fn, delay)
  }
  return debounced
}

/**
 * 保证返回的 value 满足 min <= value <= max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export const between = (value: number, min: number, max: number): number => {
  return Math.max(Math.min(value, max), min)
}

/**
 * 载入图片
 * @param {string} src 图片地址
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
export const base64ToBlob = (base64: string) => {
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
