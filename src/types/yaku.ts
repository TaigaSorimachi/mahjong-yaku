export type YakuCategory =
  | '1han'
  | '2han'
  | '3han'
  | '6han'
  | 'mangan'
  | 'yakuman'
  | 'double-yakuman'

export interface Yaku {
  id: string
  name: string
  kana: string
  category: YakuCategory
  hanClosed: number
  hanOpen: number | null
  menzenOnly: boolean
  condition: string
  example: string[]
  note?: string
}

export interface YakuCategoryInfo {
  id: YakuCategory
  label: string
  hanLabel: string
}

export const YAKU_CATEGORIES: YakuCategoryInfo[] = [
  { id: '1han', label: '1翻役', hanLabel: '1翻' },
  { id: '2han', label: '2翻役', hanLabel: '2翻' },
  { id: '3han', label: '3翻役', hanLabel: '3翻' },
  { id: '6han', label: '6翻役', hanLabel: '6翻' },
  { id: 'mangan', label: '満貫', hanLabel: '満貫' },
  { id: 'yakuman', label: '役満', hanLabel: '役満' },
  { id: 'double-yakuman', label: 'ダブル役満', hanLabel: 'W役満' },
]
