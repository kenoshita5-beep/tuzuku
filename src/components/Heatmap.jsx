import { toKey, addDays, startOfWeek } from '../lib/date.js'

// 直近約1年（53週）のGitHub風ヒートマップ
export default function Heatmap({ records, color }) {
  const weeks = 53
  const today = new Date()
  const start = addDays(startOfWeek(today), -(weeks - 1) * 7)

  const columns = []
  for (let w = 0; w < weeks; w++) {
    const col = []
    for (let d = 0; d < 7; d++) {
      const date = addDays(start, w * 7 + d)
      const key = toKey(date)
      const future = date > today
      col.push({ key, done: !!records[key], future })
    }
    columns.push(col)
  }

  const monthTicks = []
  let lastMonth = -1
  columns.forEach((col, i) => {
    const firstDay = new Date(col[0].key)
    const m = firstDay.getMonth()
    if (m !== lastMonth) {
      monthTicks.push({ i, label: `${m + 1}月` })
      lastMonth = m
    }
  })

  return (
    <div className="heatmap">
      <div className="heatmap-months">
        {monthTicks.map((t) => (
          <span key={t.i} style={{ gridColumnStart: t.i + 1 }}>{t.label}</span>
        ))}
      </div>
      <div className="heatmap-grid">
        {columns.map((col, i) => (
          <div className="heatmap-col" key={i}>
            {col.map((cell) => (
              <div
                key={cell.key}
                className={'heatmap-cell' + (cell.done ? ' filled' : '') + (cell.future ? ' future' : '')}
                style={cell.done ? { backgroundColor: color } : undefined}
                title={cell.key + (cell.done ? ' · 達成' : '')}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
