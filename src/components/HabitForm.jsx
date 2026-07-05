import { useState, useEffect } from 'react'

const EMOJIS = ['💧', '📖', '🚶', '🏃', '🧘', '💪', '🍎', '😴', '✍️', '🎧', '🧹', '🌱', '☕', '💊', '🦷', '🧠']
const COLORS = ['#38bdf8', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#fb7185', '#60a5fa', '#4ade80']

export default function HabitForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '')
  const [emoji, setEmoji] = useState(initial?.emoji || '🌱')
  const [color, setColor] = useState(initial?.color || COLORS[0])

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
    onSave({ id: initial?.id, name: trimmed, emoji, color })
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
          <span>{name.trim() || 'プレビュー'}</span>
        </div>

        <div className="modal-actions">
          <button type="button" className="ghost-btn" onClick={onClose}>キャンセル</button>
          <button type="submit" className="primary-btn">{initial ? '保存' : '追加'}</button>
        </div>
      </form>
    </div>
  )
}
