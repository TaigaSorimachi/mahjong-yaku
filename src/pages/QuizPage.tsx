import { useState, useCallback, useEffect } from 'react'
import {
  koRonTable,
  koTsumoTable,
  oyaRonTable,
  oyaTsumoTable,
  manganScores,
  fuOptions,
  hanOptions,
} from '../data/scoreTable'

interface Question {
  han: number
  fu: number
  isOya: boolean
  isTsumo: boolean
  answer: number
  breakdown?: string
}

function generateQuestion(): Question {
  // 70%の確率で実践的な問題（1-4翻, よく使う符）
  const isPractical = Math.random() < 0.7

  let han: number
  let fu: number

  if (isPractical) {
    han = [1, 2, 3, 4][Math.floor(Math.random() * 4)]
    fu = [30, 40, 50, 60][Math.floor(Math.random() * 4)]
  } else {
    han = hanOptions[Math.floor(Math.random() * hanOptions.length)]
    fu = fuOptions[Math.floor(Math.random() * fuOptions.length)]
  }

  const isOya = Math.random() < 0.25 // 25%の確率で親
  const isTsumo = Math.random() < 0.5

  // 答えを計算
  let answer: number
  let breakdown: string | undefined

  if (han >= 5) {
    const level =
      han >= 13
        ? 'yakuman'
        : han >= 11
          ? 'sanbaiman'
          : han >= 8
            ? 'baiman'
            : han >= 6
              ? 'haneman'
              : 'mangan'

    if (isOya) {
      if (isTsumo) {
        const each = manganScores.oya.tsumo[level]
        answer = each * 3
        breakdown = `${each}オール`
      } else {
        answer = manganScores.oya.ron[level]
      }
    } else {
      if (isTsumo) {
        const [ko, oya] = manganScores.ko.tsumo[level]
        answer = ko * 2 + oya
        breakdown = `${ko}/${oya}`
      } else {
        answer = manganScores.ko.ron[level]
      }
    }
  } else {
    const hanIndex = han - 1

    if (isOya) {
      if (isTsumo) {
        const each = oyaTsumoTable[fu]?.[hanIndex]
        if (!each) return generateQuestion() // 無効な組み合わせ、再生成
        answer = each * 3
        breakdown = `${each}オール`
      } else {
        const score = oyaRonTable[fu]?.[hanIndex]
        if (!score) return generateQuestion()
        answer = score
      }
    } else {
      if (isTsumo) {
        const tsumoData = koTsumoTable[fu]?.[hanIndex]
        if (!tsumoData) return generateQuestion()
        const [ko, oya] = tsumoData
        answer = ko * 2 + oya
        breakdown = `${ko}/${oya}`
      } else {
        const score = koRonTable[fu]?.[hanIndex]
        if (!score) return generateQuestion()
        answer = score
      }
    }
  }

  return { han, fu, isOya, isTsumo, answer, breakdown }
}

export function QuizPage() {
  const [question, setQuestion] = useState<Question>(generateQuestion)
  const [userAnswer, setUserAnswer] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [stats, setStats] = useState({ correct: 0, total: 0 })
  const [streak, setStreak] = useState(0)

  const checkAnswer = useCallback(() => {
    const numAnswer = parseInt(userAnswer, 10)
    const correct = numAnswer === question.answer
    setIsCorrect(correct)
    setIsAnswered(true)
    setStats((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }))
    setStreak((prev) => (correct ? prev + 1 : 0))
  }, [userAnswer, question.answer])

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion())
    setUserAnswer('')
    setIsAnswered(false)
    setIsCorrect(false)
  }, [])

  // Enter キーで回答/次へ
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isAnswered) {
          nextQuestion()
        } else if (userAnswer) {
          checkAnswer()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAnswered, userAnswer, checkAnswer, nextQuestion])

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* ステータス */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-mahjong-green-500">{stats.correct}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">正解</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {stats.total}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">問題数</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-500">{accuracy}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">正解率</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-500">{streak}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">連続</p>
        </div>
      </div>

      {/* 問題 */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-2">何点？</p>
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <span className="px-3 py-1 bg-mahjong-green-500 text-white rounded-lg font-bold">
            {question.han >= 5 ? `${question.han}翻以上` : `${question.han}翻`}
          </span>
          {question.han < 5 && (
            <span className="px-3 py-1 bg-blue-500 text-white rounded-lg font-bold">
              {question.fu}符
            </span>
          )}
          <span
            className={`px-3 py-1 rounded-lg font-bold ${
              question.isOya
                ? 'bg-red-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            {question.isOya ? '親' : '子'}
          </span>
          <span
            className={`px-3 py-1 rounded-lg font-bold ${
              question.isTsumo
                ? 'bg-purple-500 text-white'
                : 'bg-orange-500 text-white'
            }`}
          >
            {question.isTsumo ? 'ツモ' : 'ロン'}
          </span>
        </div>

        {!isAnswered ? (
          <div className="space-y-4">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="点数を入力"
              autoFocus
              className="w-full max-w-xs mx-auto px-4 py-3 text-2xl text-center rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-mahjong-green-500 focus:border-transparent"
            />
            <div>
              <button
                onClick={checkAnswer}
                disabled={!userAnswer}
                className="px-8 py-3 bg-mahjong-green-500 text-white rounded-xl font-bold text-lg hover:bg-mahjong-green-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
              >
                回答する
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`text-4xl font-bold ${
                isCorrect ? 'text-mahjong-green-500' : 'text-red-500'
              }`}
            >
              {isCorrect ? '正解!' : '不正解...'}
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">正解</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {question.answer.toLocaleString()}点
              </p>
              {question.breakdown && (
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  ({question.breakdown})
                </p>
              )}
              {!isCorrect && userAnswer && (
                <p className="text-sm text-red-500 mt-2">
                  あなたの回答: {parseInt(userAnswer, 10).toLocaleString()}点
                </p>
              )}
            </div>
            <button
              onClick={nextQuestion}
              className="px-8 py-3 bg-mahjong-green-500 text-white rounded-xl font-bold text-lg hover:bg-mahjong-green-600 transition-colors"
            >
              次の問題
            </button>
          </div>
        )}
      </div>

      {/* ヒント */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
          覚え方のコツ
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>・30符1翻 = 子ロン1000点、親ロン1500点</li>
          <li>・30符2翻 = 子ロン2000点、親ロン2900点</li>
          <li>・符が10上がると約1.3倍</li>
          <li>・翻が1上がると約2倍</li>
          <li>・親は子の1.5倍</li>
        </ul>
      </div>
    </div>
  )
}
