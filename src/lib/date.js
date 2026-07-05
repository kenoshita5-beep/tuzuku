// 日付ユーティリティ（ローカルタイム基準、外部ライブラリなし）

export function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayKey() {
  return toKey(new Date())
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function diffDays(aKey, bKey) {
  const a = fromKey(aKey)
  const b = fromKey(bKey)
  return Math.round((a - b) / 86400000)
}

// 週の始まりを月曜にする
export function startOfWeek(date) {
  const d = new Date(date)
  const day = (d.getDay() + 6) % 7 // Mon=0 ... Sun=6
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

const WEEK_LABELS = ['月', '火', '水', '木', '金', '土', '日']
export function weekLabel(index) {
  return WEEK_LABELS[index]
}

// 今週（月〜日）の7日分のDateを返す
export function currentWeekDays(base = new Date()) {
  const start = startOfWeek(base)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}
