export default function EmptyState({ onAdd }) {
  return (
    <div className="empty">
      <div className="empty-emoji">🌱</div>
      <h2>最初の習慣を植えよう</h2>
      <p>小さな一歩の積み重ねが、大きな変化になります。<br />続けたいことを1つ追加してみましょう。</p>
      <button className="primary-btn" onClick={onAdd}>
        <span className="plus">＋</span> 習慣を追加
      </button>
    </div>
  )
}
