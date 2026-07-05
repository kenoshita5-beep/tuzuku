export default function Header({ theme, onToggleTheme, onAdd }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <span className="brand-mark">続</span>
          <div className="brand-text">
            <h1>つづく</h1>
            <p>Habit Tracker</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={onToggleTheme} title="テーマ切り替え" aria-label="テーマ切り替え">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="primary-btn" onClick={onAdd}>
            <span className="plus">＋</span> 習慣を追加
          </button>
        </div>
      </div>
    </header>
  )
}
