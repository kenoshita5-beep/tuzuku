export default function OverviewBar({ total, doneToday, bestStreakValue, bestStreakUnit }) {
  const pct = total > 0 ? Math.round((doneToday / total) * 100) : 0
  return (
    <div className="container">
      <div className="overview">
        <div className="overview-progress">
          <div className="ring" style={{ '--pct': pct }}>
            <span>{pct}%</span>
          </div>
          <div className="overview-caption">
            <strong>今日の達成</strong>
            <span>{doneToday} / {total} の習慣</span>
          </div>
        </div>
        <div className="overview-stats">
          <div className="stat">
            <span className="stat-num">🔥 {bestStreakValue}{bestStreakUnit}</span>
            <span className="stat-label">最長の継続ストリーク</span>
          </div>
          <div className="stat">
            <span className="stat-num">{total}</span>
            <span className="stat-label">追跡中の習慣</span>
          </div>
        </div>
      </div>
    </div>
  )
}
