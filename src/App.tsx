import { Routes, Route, Link } from 'react-router-dom'
import { useDarkMode } from './hooks/useDarkMode'
import { DarkModeToggle } from './components/DarkModeToggle'
import { Navigation } from './components/Navigation'
import { YakuListPage } from './pages/YakuListPage'
import { ScoreCalculatorPage } from './pages/ScoreCalculatorPage'
import { ScoreRecordPage } from './pages/ScoreRecordPage'
import { SettlementPage } from './pages/SettlementPage'
import { QuizPage } from './pages/QuizPage'
import { StatsPage } from './pages/StatsPage'
import { GuidePage } from './pages/GuidePage'

function App() {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              <span className="text-mahjong-green-500">麻雀</span>ツール
            </h1>
            <div className="flex items-center gap-2">
              <Link
                to="/guide"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="使い方ガイド"
              >
                <span className="text-lg">?</span>
              </Link>
              <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<YakuListPage />} />
          <Route path="/calculator" element={<ScoreCalculatorPage />} />
          <Route path="/record" element={<ScoreRecordPage />} />
          <Route path="/settlement" element={<SettlementPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/guide" element={<GuidePage />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  )
}

export default App
