import { useState, useEffect } from 'react'

const EMOJIS = ['💧', '📖', '🚶', '🏃', '🧘', '💪', '🍎', '😴', '✍️', '🎧', '🧹', '🌱', '☕', '💊', '🦷', '🧠']
const COLORS = ['#38bdf8', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#fb7185', '#60a5fa', '#4ade80']

export default function HabitForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '')
  const [emoji, setEmoji] = useState(initial?.emoji || '🌱')
  const [color, setColor] = useState(initial?.color || COLORS[0])

  const initGoal = initial?.goal
  const [freqType, setFreqType] = useState(initGoal?.type === 'weekly' ? 'weekly' : 'daily')
  const [weeklyTarget, setWeeklyTarget] = useState(
    initGoal?.type === 'weekly' ? Math.max(1, Math.min(7, initGoal.target || 3)) : 3
  )

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function submit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const goal = freqType === 'weekly' ? { type: 'weekly', target: weeklyTarget } : { type: 'daily' }
    onSave({ id: initial?.id, name: trimmed, emoji, color, goal })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{initial ? '習慣を編集' : '新しい習慣'}</h2>

        <label className="field">
          <span>名前</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 毎朝ストレッチ"
            maxLength={40}
          />
        </label>

        <div className="field">
          <span>目標の頻度</span>
          <div className="segmented">
            <button
              type="button"
              className={'segment' + (freqType === 'daily' ? ' active' : '')}
              onClick={() => setFreqType('daily')}
            >毎日</button>
            <button
              type="button"
              className={'segment' + (freqType === 'weekly' ? ' active' : '')}
              onClick={() => setFreqType('weekly')}
            >週に決めた回数</button>
          </div>
          {freqType === 'weekly' && (
            <div className="stepper">
              <span>週</span>
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setWeeklyTarget((n) => Math.max(1, n - 1))}
                aria-label="回数を減らす"
              >−</button>
              <strong className="stepper-val">{weeklyTarget}</strong>
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setWeeklyTarget((n) => Math.min(7, n + 1))}
                aria-label="回数を増やす"
              >＋</button>
              <span>回</span>
            </div>
          )}
        </div>

        <div className="field">
          <span>アイコン</span>
          <div className="emoji-grid">
            {EMOJIS.map((e) => (
              <button
                type="button"
                key={e}
                className={'emoji-pick' + (emoji === e ? ' selected' : '')}
                onClick={() => setEmoji(e)}
              >{e}</button>
            ))}
          </div>
        </div>

        <div className="field">
          <span>カラー</span>
          <div className="color-grid">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                className={'color-pick' + (color === c ? ' selected' : '')}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <div className="preview" style={{ '--habit-color': color }}>
          <span className="preview-icon">{emoji}</span>
          <span className="preview-text">
            {name.trim() || 'プレビュー'}
            <em>{freqType === 'weekly' ? `週${weeklyTarget}回` : '毎日'}</em>
          </span>
        </div>

        <div className="modal-actions">
          <button type="button" className="ghost-btn" onClick={onClose}>キャンセル</button>
          <button type="submit" className="primary-btn">{initial ? '保存' : '追加'}</button>
        </div>
      </form>
    </div>
  )
}
