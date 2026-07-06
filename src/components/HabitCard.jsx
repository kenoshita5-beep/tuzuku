import { useState } from 'react'
import { todayKey } from '../lib/date.js'
import { computeStats } from '../lib/stats.js'
import WeekStrip from './WeekStrip.jsx'
import Heatmap from './Heatmap.jsx'

export default function HabitCard({ habit, records, onToggle, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const today = todayKey()
  const doneToday = !!records[today]

  const st = computeStats(habit, records)
  const isWeekly = st.mode === 'weekly'

  return (
    <article className="card" style={{ '--habit-color': habit.color }}>
      <div className="card-top">
        <button
          className={'check-btn' + (doneToday ? ' checked' : '')}
          onClick={() => onToggle(today)}
          aria-pressed={doneToday}
          aria-label={doneToday ? `${habit.name} の今日の達成を取り消す` : `${habit.name} を今日達成にする`}
          title={doneToday ? '今日の達成を取り消す' : '今日を達成にする'}
        >
          <span className="check-emoji">{habit.emoji}</span>
          {doneToday && <span className="check-mark">✓</span>}
        </button>

        <div className="card-main">
          <h3>{habit.name}</h3>
          <div className="card-meta">
            {isWeekly ? (
              <>
                <span className="badge goal">週{st.target}回</span>
                <span className="badge streak">今週 {st.weekCount}/{st.target}</span>
                <span className="badge">🔥 {st.streak}週連続</span>
              </>
            ) : (
              <>
                <span className="badge goal">毎日</span>
                <span className="badge streak">🔥 {st.streak}日連続</span>
              </>
            )}
            <span className="badge">達成率 {st.rate}%</span>
          </div>
        </div>

        <div className="card-menu">
          <button className="icon-btn ghost" onClick={onEdit} aria-label={`${habit.name} を編集`} title="編集">✎</button>
          <button
            className="icon-btn ghost danger"
            onClick={() => {
              if (confirm(`「${habit.name}」を削除しますか？記録も消えます。`)) onDelete()
            }}
            aria-label={`${habit.name} を削除`}
            title="削除"
          >🗑</button>
        </div>
      </div>

      {isWeekly && (
        <div className="week-goal-bar" aria-hidden="true">
          <div
            className="week-goal-fill"
            style={{ width: `${Math.min(100, (st.weekCount / st.target) * 100)}%` }}
          />
        </div>
      )}

      <WeekStrip records={records} color={habit.color} onToggle={onToggle} />

      <button className="expand-btn" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
        {expanded ? '記録を閉じる ▲' : '年間の記録を見る ▼'}
      </button>

      {expanded && (
        <div className="card-detail">
          <div className="detail-stats">
            <div><strong>{st.total}</strong><span>合計達成</span></div>
            <div><strong>{st.longest}</strong><span>最長{st.streakUnit}連続</span></div>
            <div><strong>{st.streak}</strong><span>現在の連続{st.streakUnit}</span></div>
          </div>
          <Heatmap records={records} color={habit.color} />
        </div>
      )}
    </article>
  )
}
