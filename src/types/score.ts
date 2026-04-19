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

// 1局の和了記録
export interface RoundRecord {
  id: string
  timestamp: string
  winner: string // 和了者
  loser: string | null // 放銃者（ツモの場合はnull）
  winType: WinType
  isOya: boolean // 和了者が親か
  han: number
  fu: number
  score: number // 和了点数
  yakuList?: string[] // 役一覧（オプション）
}

// セッション（半荘）
export interface GameSession {
  id: string
  startTime: string
  endTime?: string
  players: string[] // 4人のプレイヤー名
  rounds: RoundRecord[] // 各局の記録
  isActive: boolean
}

// 精算計算の設定
export interface SettlementConfig {
  uma: [number, number, number, number] // 順位ウマ（1位, 2位, 3位, 4位）
  oka: number // オカ（トップ賞）
  returnPoint: number // 返し点（例: 30000）
  rate: number // レート（1000点あたり）
}

// 精算結果
export interface SettlementResult {
  name: string
  rawScore: number
  rank: number
  umaBonus: number
  okaBonus: number
  finalPoint: number
  payment: number
}

// 統計データ
export interface PlayerStats {
  name: string
  totalGames: number
  averageRank: number
  averageScore: number
  topRate: number // 1位率
  rentaiRate: number // 連帯率（1-2位）
  lastRate: number // ラス率
  maxScore: number
  minScore: number
  totalPayment: number
}
