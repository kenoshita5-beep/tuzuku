import { currentWeekDays, toKey, todayKey, weekLabel } from '../lib/date.js'

export default function WeekStrip({ records, color, onToggle }) {
  const days = currentWeekDays()
  const today = todayKey()

  return (
    <div className="week-strip">
      {days.map((d, i) => {
        const key = toKey(d)
        const done = !!records[key]
        const isToday = key === today
        const isFuture = key > today
        return (
          <button
            key={key}
            className={
              'week-day' +
              (done ? ' done' : '') +
              (isToday ? ' today' : '') +
              (isFuture ? ' future' : '')
            }
            disabled={isFuture}
            onClick={() => onToggle(key)}
            style={done ? { '--habit-color': color } : undefined}
            title={key}
          >
            <span className="week-day-label">{weekLabel(i)}</span>
            <span className="week-day-dot">{done ? '✓' : d.getDate()}</span>
          </button>
        )
      })}
    </div>
  )
}
