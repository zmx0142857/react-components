import { pagerApi } from '@/utils'

export const hometownOptions = [
  {
    value: '330000',
    label: '浙江省',
    children: [
      {
        value: '330100',
        label: '杭州市',
        children: [
          {
            value: '330106',
            label: '西湖区',
          },
        ],
      },
    ],
  },
  {
    value: '320000',
    label: '江苏省',
    children: [
      {
        value: '320100',
        label: '南京市',
        children: [
          {
            value: '320102',
            label: '玄武区',
          },
        ],
      },
    ],
  },
  {
    value: '350000',
    label: '福建省',
    children: [
      {
        value: '350100',
        label: '福州市',
        children: [
          {
            value: '350103',
            label: '台江区',
          },
        ],
      },
    ],
  },
]

const gradeOptions = [
  { value: 1, label: '一年级' },
  { value: 2, label: '二年级' },
  { value: 3, label: '三年级' },
  { value: 4, label: '四年级' },
  { value: 5, label: '五年级' },
  { value: 6, label: '六年级' },
  { value: 7, label: '七年级' },
  { value: 8, label: '八年级' },
  { value: 9, label: '九年级' },
  { value: 10, label: '十年级' },
  { value: 11, label: '十一年级' },
  { value: 12, label: '十二年级' },
]

export const fetchGradeOptions = pagerApi('gradeOptions', gradeOptions)

const equipments = Array.from({ length: 100 }).map((_, i) => ({ value: i, label: '装备' + i }))
export const fetchEquipments = pagerApi('equipments', equipments)