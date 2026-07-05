import { useState, useMemo, useEffect } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { todayKey } from './lib/date.js'
import { currentStreak } from './lib/stats.js'
import Header from './components/Header.jsx'
import OverviewBar from './components/OverviewBar.jsx'
import HabitList from './components/HabitList.jsx'
import HabitForm from './components/HabitForm.jsx'
import EmptyState from './components/EmptyState.jsx'

const STARTER_HABITS = [
  { id: 'h_water', name: '水を2L飲む', emoji: '💧', color: '#38bdf8', createdAt: todayKey() },
  { id: 'h_read', name: '10分読書', emoji: '📖', color: '#a78bfa', createdAt: todayKey() },
  { id: 'h_walk', name: '散歩する', emoji: '🚶', color: '#34d399', createdAt: todayKey() },
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

  const doneToday = useMemo(
    () => habits.filter((h) => records[h.id]?.[today]).length,
    [habits, records, today]
  )

  const bestStreak = useMemo(() => {
    let max = 0
    for (const h of habits) {
      const s = currentStreak(records[h.id] || {})
      if (s > max) max = s
    }
    return max
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
          bestStreak={bestStreak}
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
