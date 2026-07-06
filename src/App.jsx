import { useState, useMemo, useEffect } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { todayKey } from './lib/date.js'
import { computeStats } from './lib/stats.js'
import Header from './components/Header.jsx'
import OverviewBar from './components/OverviewBar.jsx'
import HabitList from './components/HabitList.jsx'
import HabitForm from './components/HabitForm.jsx'
import EmptyState from './components/EmptyState.jsx'
import DataControls from './components/DataControls.jsx'

const STARTER_HABITS = [
  { id: 'h_water', name: '水を2L飲む', emoji: '💧', color: '#38bdf8', goal: { type: 'daily' }, createdAt: todayKey() },
  { id: 'h_read', name: '10分読書', emoji: '📖', color: '#a78bfa', goal: { type: 'daily' }, createdAt: todayKey() },
  { id: 'h_walk', name: '運動する', emoji: '🏃', color: '#34d399', goal: { type: 'weekly', target: 3 }, createdAt: todayKey() },
]

export default function App() {
  const [habits, setHabits] = useLocalStorage('tsuzuku.habits', STARTER_HABITS)
  const [records, setRecords] = useLocalStorage('tsuzuku.records', {})
  const [theme, setTheme] = useLocalStorage('tsuzuku.theme', 'dark')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const today = todayKey()

  function toggle(habitId, dateKey) {
    setRecords((prev) => {
      const forHabit = { ...(prev[habitId] || {}) }
      if (forHabit[dateKey]) delete forHabit[dateKey]
      else forHabit[dateKey] = true
      return { ...prev, [habitId]: forHabit }
    })
  }

  function saveHabit(data) {
    if (data.id) {
      setHabits((prev) => prev.map((h) => (h.id === data.id ? { ...h, ...data } : h)))
    } else {
      const id = 'h_' + Math.random().toString(36).slice(2, 9)
      setHabits((prev) => [...prev, { ...data, id, createdAt: today }])
    }
    setFormOpen(false)
    setEditing(null)
  }

  function removeHabit(id) {
    setHabits((prev) => prev.filter((h) => h.id !== id))
    setRecords((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  // データの書き出し（バックアップ）
  function exportData() {
    const payload = {
      app: 'tsuzuku',
      version: 1,
      exportedAt: new Date().toISOString(),
      habits,
      records,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tsuzuku-backup-${today}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // データの読み込み（復元）
  function importData(file) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        if (!Array.isArray(data.habits) || typeof data.records !== 'object' || data.records === null) {
          throw new Error('ファイルの形式が正しくありません')
        }
        const ok = window.confirm(
          `現在のデータを、読み込むバックアップ（習慣${data.habits.length}件）で置き換えますか？\nこの操作は取り消せません。`
        )
        if (ok) {
          setHabits(data.habits)
          setRecords(data.records)
        }
      } catch (e) {
        window.alert('読み込みに失敗しました: ' + e.message)
      }
    }
    reader.readAsText(file)
  }

  const doneToday = useMemo(
    () => habits.filter((h) => records[h.id]?.[today]).length,
    [habits, records, today]
  )

  // 最長の継続中ストリーク（毎日=日 / 週N回=週 を区別して最大を選ぶ）
  const bestStreak = useMemo(() => {
    let best = { value: 0, unit: '日' }
    for (const h of habits) {
      const st = computeStats(h, records[h.id] || {})
      if (st.streak > best.value) best = { value: st.streak, unit: st.streakUnit }
    }
    return best
  }, [habits, records])

  return (
    <div className="app">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onAdd={() => {
          setEditing(null)
          setFormOpen(true)
        }}
      />

      {habits.length > 0 && (
        <OverviewBar
          total={habits.length}
          doneToday={doneToday}
          bestStreakValue={bestStreak.value}
          bestStreakUnit={bestStreak.unit}
        />
      )}

      <main className="container">
        {habits.length === 0 ? (
          <EmptyState onAdd={() => setFormOpen(true)} />
        ) : (
          <HabitList
            habits={habits}
            records={records}
            onToggle={toggle}
            onEdit={(h) => {
              setEditing(h)
              setFormOpen(true)
            }}
            onDelete={removeHabit}
          />
        )}

        {habits.length > 0 && (
          <DataControls onExport={exportData} onImport={importData} />
        )}
      </main>

      {formOpen && (
        <HabitForm
          initial={editing}
          onSave={saveHabit}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
        />
      )}

      <footer className="footer">
        <span>つづく · あなたのペースで、小さく続けよう</span>
      </footer>
    </div>
  )
}
