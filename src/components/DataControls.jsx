import { useRef } from 'react'

export default function DataControls({ onExport, onImport }) {
  const inputRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files && e.target.files[0]
    if (file) onImport(file)
    e.target.value = '' // 同じファイルを連続で選べるようにリセット
  }

  return (
    <section className="data-controls">
      <div className="data-controls-head">
        <span className="data-controls-title">データのバックアップ</span>
        <span className="data-controls-note">記録はこの端末のブラウザに保存されています。書き出して保管しておくと安心です。</span>
      </div>
      <div className="data-controls-actions">
        <button className="ghost-btn" onClick={onExport}>⬇ 書き出す（JSON）</button>
        <button className="ghost-btn" onClick={() => inputRef.current && inputRef.current.click()}>⬆ 読み込む</button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
      </div>
    </section>
  )
}
