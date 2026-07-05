import { toKey, todayKey, addDays, fromKey } from './date.js'

// あるフラグ集合（{dateKey: true}）から現在の連続日数を計算
export function currentStreak(records) {
  let streak = 0
  let cursor = new Date()
  // 今日が未達成でも、昨日までの連続は継続中とみなす
  if (!records[toKey(cursor)]) {
    cursor = addDays(cursor, -1)
  }
  while (records[toKey(cursor)]) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

// 過去全体での最長連続日数
export function longestStreak(records) {
  const keys = Object.keys(records).filter((k) => records[k]).sort()
  if (keys.length === 0) return 0
  let best = 1
  let run = 1
  for (let i = 1; i < keys.length; i++) {
    const prev = fromKey(keys[i - 1])
    const cur = fromKey(keys[i])
    const gap = Math.round((cur - prev) / 86400000)
    run = gap === 1 ? run + 1 : 1
    if (run > best) best = run
  }
  return best
}

export function totalDone(records) {
  return Object.values(records).filter(Boolean).length
}

// 直近N日間の達成率
export function completionRate(records, days = 30) {
  let done = 0
  for (let i = 0; i < days; i++) {
    const key = toKey(addDays(new Date(), -i))
    if (records[key]) done += 1
  }
  return Math.round((done / days) * 100)
}
