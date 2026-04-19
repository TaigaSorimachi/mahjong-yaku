export interface PlayerScore {
  name: string
  score: number // 最終点数（例: 25000）
}

export interface GameRecord {
  id: string
  date: string
  players: PlayerScore[]
}

export type WinType = 'tsumo' | 'ron'
export type PlayerType = 'oya' | 'ko'
