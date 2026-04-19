import {
  PlayerScore,
  SettlementConfig,
  SettlementResult,
  GameRecord,
  PlayerStats,
} from '../types/score'

export const defaultConfig: SettlementConfig = {
  uma: [20, 10, -10, -20], // 20-10
  oka: 0, // オカなし（30000点返し）
  returnPoint: 30000,
  rate: 50, // 50円/1000点
}

export function calculateSettlement(
  players: PlayerScore[],
  config: SettlementConfig = defaultConfig
): SettlementResult[] {
  // 順位でソート（同点の場合は入力順を維持）
  const sorted = [...players]
    .map((p, idx) => ({ ...p, originalIndex: idx }))
    .sort((a, b) => b.score - a.score)

  return sorted.map((player, rankIndex) => {
    const rank = rankIndex + 1
    const rawScore = player.score

    // 素点計算（返し点からの差分を1000点単位に）
    const basePoint = Math.round((rawScore - config.returnPoint) / 1000)

    // ウマ
    const umaBonus = config.uma[rankIndex]

    // オカ（1位のみ）
    const okaBonus = rank === 1 ? config.oka : 0

    // 最終ポイント
    const finalPoint = basePoint + umaBonus + okaBonus

    // 支払い額
    const payment = finalPoint * config.rate

    return {
      name: player.name,
      rawScore,
      rank,
      umaBonus,
      okaBonus,
      finalPoint,
      payment,
    }
  })
}

export function calculatePlayerStats(
  records: GameRecord[],
  config: SettlementConfig = defaultConfig
): PlayerStats[] {
  const playerMap = new Map<
    string,
    {
      scores: number[]
      ranks: number[]
      payments: number[]
    }
  >()

  records.forEach((record) => {
    const settlements = calculateSettlement(record.players, config)

    settlements.forEach((result) => {
      const existing = playerMap.get(result.name) || {
        scores: [],
        ranks: [],
        payments: [],
      }
      existing.scores.push(result.rawScore)
      existing.ranks.push(result.rank)
      existing.payments.push(result.payment)
      playerMap.set(result.name, existing)
    })
  })

  const stats: PlayerStats[] = []

  playerMap.forEach((data, name) => {
    const totalGames = data.ranks.length
    if (totalGames === 0) return

    const averageRank = data.ranks.reduce((a, b) => a + b, 0) / totalGames
    const averageScore = data.scores.reduce((a, b) => a + b, 0) / totalGames
    const topCount = data.ranks.filter((r) => r === 1).length
    const rentaiCount = data.ranks.filter((r) => r <= 2).length
    const lastCount = data.ranks.filter((r) => r === 4).length

    stats.push({
      name,
      totalGames,
      averageRank: Math.round(averageRank * 100) / 100,
      averageScore: Math.round(averageScore),
      topRate: Math.round((topCount / totalGames) * 1000) / 10,
      rentaiRate: Math.round((rentaiCount / totalGames) * 1000) / 10,
      lastRate: Math.round((lastCount / totalGames) * 1000) / 10,
      maxScore: Math.max(...data.scores),
      minScore: Math.min(...data.scores),
      totalPayment: data.payments.reduce((a, b) => a + b, 0),
    })
  })

  // 総合成績（平均順位）でソート
  return stats.sort((a, b) => a.averageRank - b.averageRank)
}
