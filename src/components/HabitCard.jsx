import { useState } from 'react'
import { todayKey } from '../lib/date.js'
import { currentStreak, longestStreak, totalDone, completionRate } from '../lib/stats.js'
import WeekStrip from './WeekStrip.jsx'
import Heatmap from './Heatmap.jsx'

export default function HabitCard({ habit, records, onToggle, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const today = todayKey()
  const doneToday = !!records[today]

  const streak = currentStreak(records)
  const best = longestStreak(records)
  const total = totalDone(records)
  const rate = completionRate(records, 30)

  return (
    <article className="card" style={{ '--habit-color': habit.color }}>
      <div className="card-top">
        <button
          className={'check-btn' + (doneToday ? ' checked' : '')}
          onClick={() => onToggle(today)}
          aria-pressed={doneToday}
          title={doneToday ? '今日の達成を取り消す' : '今日を達成にする'}
        >
          <span className="check-emoji">{habit.emoji}</span>
          {doneToday && <span className="check-mark">✓</span>}
        </button>

        <div className="card-main">
          <h3>{habit.name}</h3>
          <div className="card-meta">
            <span className="badge streak">🔥 {streak}日連続</span>
            <span className="badge">達成率 {rate}%</span>
          </div>
        </div>

        <div className="card-menu">
          <button className="icon-btn ghost" onClick={onEdit} title="編集">✎</button>
          <button
            className="icon-btn ghost danger"
            onClick={() => {
              if (confirm(`「${habit.name}」を削除しますか？記録も消えます。`)) onDelete()
            }}
            title="削除"
          >🗑</button>
        </div>
      </div>

      <WeekStrip records={records} color={habit.color} onToggle={onToggle} />

      <button className="expand-btn" onClick={() => setExpanded((e) => !e)}>
        {expanded ? '記録を閉じる ▲' : '年間の記録を見る ▼'}
      </button>

      {expanded && (
        <div className="card-detail">
          <div className="detail-stats">
            <div><strong>{total}</strong><span>合計達成</span></div>
            <div><strong>{best}</strong><span>最長ストリーク</span></div>
            <div><strong>{streak}</strong><span>現在の連続</span></div>
          </div>
          <Heatmap records={records} color={habit.color} />
        </div>
      )}
    </article>
  )
}
