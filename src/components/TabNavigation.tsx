export type TabId = 'yaku' | 'calculator' | 'record'

interface Tab {
  id: TabId
  label: string
}

const tabs: Tab[] = [
  { id: 'yaku', label: '役一覧' },
  { id: 'calculator', label: '点数計算' },
  { id: 'record', label: '点数記録' },
]

interface TabNavigationProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-mahjong-green-500 border-b-2 border-mahjong-green-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
