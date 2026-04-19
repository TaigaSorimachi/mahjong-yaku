import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '役一覧', icon: '🀄' },
  { to: '/calculator', label: '点数計算', icon: '🔢' },
  { to: '/record', label: '記録', icon: '📝' },
  { to: '/settlement', label: '精算', icon: '💰' },
  { to: '/quiz', label: 'クイズ', icon: '❓' },
  { to: '/stats', label: '統計', icon: '📊' },
]

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-pb">
      <div className="max-w-6xl mx-auto px-2">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-1 min-w-0 flex-1 transition-colors ${
                  isActive
                    ? 'text-mahjong-green-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs mt-0.5 truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
