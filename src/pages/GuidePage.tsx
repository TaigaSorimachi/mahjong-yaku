import { useState } from 'react'
import { Link } from 'react-router-dom'

type GuideSection =
  | 'yaku'
  | 'calculator'
  | 'record'
  | 'settlement'
  | 'quiz'
  | 'stats'

interface GuideItem {
  id: GuideSection
  icon: string
  title: string
  description: string
  path: string
  steps: string[]
  tips?: string[]
}

const guides: GuideItem[] = [
  {
    id: 'yaku',
    icon: '🀄',
    title: '役一覧',
    description: '麻雀の役を翻数順で確認できます。検索やフィルターで素早く探せます。',
    path: '/',
    steps: [
      '役名やよみがなで検索できます',
      '翻数カテゴリでフィルタリング（1翻、2翻、満貫など）',
      '「門前限定のみ」でフィルター可能',
      '★ボタンでお気に入り登録',
      'お気に入りボタンで登録した役だけを表示',
    ],
    tips: [
      '役満は金色のカードで表示されます',
      '食い下がりのある役は「食い下がり」タグ付き',
      '牌姿例で手牌のイメージを確認できます',
    ],
  },
  {
    id: 'calculator',
    icon: '🔢',
    title: '点数計算',
    description: '翻数と符から点数を自動計算。初心者から上級者まで便利に使えます。',
    path: '/calculator',
    steps: [
      'よく使う組み合わせはクイックボタンで一発選択',
      '翻数を選択（1〜13翻、役満）',
      '符を選択（5翻以上は不要）',
      '親/子を選択',
      'ツモ/ロンを選択',
      '点数が自動で表示されます',
    ],
    tips: [
      '5翻以上は満貫以上になり、符の計算は不要',
      '計算式も表示されるので、点数計算の勉強にも',
      'ツモの場合は支払い内訳（子/親）も表示',
    ],
  },
  {
    id: 'record',
    icon: '📝',
    title: '点数記録',
    description: '半荘中の和了をワンタップで記録。誰が誰から何点もらったか一目瞭然。',
    path: '/record',
    steps: [
      '「新しい半荘を開始」で4人のプレイヤー名を入力',
      '和了が発生したら、和了者をタップ',
      'ツモ/ロンを選択',
      'ロンの場合は放銃者を選択',
      '親/子を選択',
      '点数ボタンをタップで記録完了',
    ],
    tips: [
      '点数は自動計算済みのボタンをタップするだけ',
      '現在の各プレイヤーの点数がリアルタイムで更新',
      '記録は間違えたら✕で削除可能',
      '半荘終了後も履歴として残ります',
    ],
  },
  {
    id: 'settlement',
    icon: '💰',
    title: '精算計算',
    description: '半荘終了後の精算（ウマ・オカ）を自動計算。支払い額がすぐわかります。',
    path: '/settlement',
    steps: [
      'ウマを選択（10-20、10-30、20-30など）',
      'レートを選択（点1、点3、点5、点ピン）',
      '返し点を選択（25000点 or 30000点）',
      '各プレイヤーの最終点数を入力',
      '精算結果が自動表示されます',
    ],
    tips: [
      '合計が10万点になるように入力してください',
      '順位、ウマ、最終ポイント、支払い額が一覧で表示',
      'プラスは緑色、マイナスは赤色で表示',
    ],
  },
  {
    id: 'quiz',
    icon: '❓',
    title: '点数クイズ',
    description: '点数計算の練習ができます。繰り返し解いて暗記しましょう。',
    path: '/quiz',
    steps: [
      '翻数・符・親子・ツモロンの条件が出題',
      '点数を入力',
      '「回答する」ボタンで答え合わせ',
      '正解/不正解が表示され、正解も確認できます',
      '「次の問題」で続けて練習',
    ],
    tips: [
      '正解数、問題数、正解率、連続正解数を表示',
      '実践的な問題（1-4翻、30-60符）が多めに出題',
      '覚え方のコツも画面下部に表示',
    ],
  },
  {
    id: 'stats',
    icon: '📊',
    title: '統計',
    description: '記録した半荘データからプレイヤー別の成績を分析。',
    path: '/stats',
    steps: [
      '点数記録で半荘を記録する',
      '統計ページで成績を確認',
      '平均順位、トップ率、連帯率、ラス率を表示',
      '収支合計も確認できます',
    ],
    tips: [
      '複数の半荘を記録するほど正確な統計に',
      'プレイヤーは平均順位でランキング表示',
      '最高点数・最低点数も記録されます',
    ],
  },
]

export function GuidePage() {
  const [expandedId, setExpandedId] = useState<GuideSection | null>(null)

  const toggleExpand = (id: GuideSection) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          使い方ガイド
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          各機能の使い方を確認できます
        </p>
      </div>

      {guides.map((guide) => (
        <div
          key={guide.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* ヘッダー（タップで展開） */}
          <button
            onClick={() => toggleExpand(guide.id)}
            className="w-full px-4 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{guide.icon}</span>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-gray-100">
                  {guide.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {guide.description}
                </p>
              </div>
            </div>
            <span
              className={`text-gray-400 transition-transform ${
                expandedId === guide.id ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>

          {/* 展開コンテンツ */}
          {expandedId === guide.id && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
              {/* 使い方ステップ */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  使い方
                </h3>
                <ol className="space-y-2">
                  {guide.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-mahjong-green-500 text-white text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* コツ・ヒント */}
              {guide.tips && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                  <h3 className="text-sm font-bold text-yellow-700 dark:text-yellow-400 mb-2 flex items-center gap-1">
                    <span>💡</span> ヒント
                  </h3>
                  <ul className="space-y-1">
                    {guide.tips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start gap-1"
                      >
                        <span className="flex-shrink-0">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* この機能を使うボタン */}
              <Link
                to={guide.path}
                className="block w-full py-3 bg-mahjong-green-500 text-white text-center rounded-xl font-bold hover:bg-mahjong-green-600 transition-colors"
              >
                {guide.title}を使う
              </Link>
            </div>
          )}
        </div>
      ))}

      {/* フッター */}
      <div className="text-center pt-4 text-sm text-gray-400 dark:text-gray-500">
        <p>麻雀ツール v1.0</p>
        <p className="mt-1">データはブラウザに保存されます</p>
      </div>
    </div>
  )
}
