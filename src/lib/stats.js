import { toKey, fromKey, addDays, startOfWeek } from './date.js'

// ===== 目標頻度の正規化 =====
// habit.goal: { type:'daily' } または { type:'weekly', target:N(1..7) }
export function normalizeGoal(habit) {
  const g = habit && habit.goal
  if (g && g.type === 'weekly') {
    const t = Math.max(1, Math.min(7, Number(g.target) || 3))
    return { type: 'weekly', target: t }
  }
  return { type: 'daily' }
}

// ===== 共通 =====
export function totalDone(records) {
  return Object.values(records).filter(Boolean).length
}

function midnight(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

// 作成日(含む)〜今日(含む)の対象日数。windowで上限を設ける。
function windowDays(createdAtKey, window) {
  const today = midnight(new Date())
  let start = midnight(fromKey(createdAtKey))
  const earliest = addDays(today, -(window - 1))
  if (start < earliest) start = earliest
  if (start > today) start = today
  return Math.round((today - start) / 86400000) + 1
}

// ===== 毎日タイプ =====
export function currentStreak(records) {
  let streak = 0
  let cursor = new Date()
  if (!records[toKey(cursor)]) cursor = addDays(cursor, -1) // 今日未達成でも昨日までの連続は継続中
  while (records[toKey(cursor)]) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function longestStreak(records) {
  const keys = Object.keys(records).filter((k) => records[k]).sort()
  if (keys.length === 0) return 0
  let best = 1
  let run = 1
  for (let i = 1; i < keys.length; i++) {
    const gap = Math.round((fromKey(keys[i]) - fromKey(keys[i - 1])) / 86400000)
    run = gap === 1 ? run + 1 : 1
    if (run > best) best = run
  }
  return best
}

// 達成率（毎日）: 直近window日のうち作成日以降だけを分母にする
export function dailyCompletionRate(records, createdAtKey, window = 30) {
  const days = windowDays(createdAtKey, window)
  let done = 0
  for (let i = 0; i < days; i++) {
    if (records[toKey(addDays(new Date(), -i))]) done += 1
  }
  return Math.round((done / days) * 100)
}

// ===== 週N回タイプ =====
// 指定した週開始日(月曜)の週の達成回数
function weekCountFromStart(records, weekStart) {
  let c = 0
  for (let i = 0; i < 7; i++) {
    if (records[toKey(addDays(weekStart, i))]) c += 1
  }
  return c
}

// 今週の達成回数
export function weekCount(records, base = new Date()) {
  return weekCountFromStart(records, startOfWeek(base))
}

// 現在の連続達成「週」数（目標回数に到達した週の連続）
export function weeklyStreak(records, target, createdAtKey) {
  const createdWeek = startOfWeek(fromKey(createdAtKey))
  let ws = startOfWeek(new Date())
  let streak = 0
  // 今週：達成済みなら数える。未達成でも継続は途切れさせない（進行中）
  if (weekCountFromStart(records, ws) >= target) streak += 1
  ws = addDays(ws, -7)
  while (ws >= createdWeek) {
    if (weekCountFromStart(records, ws) >= target) {
      streak += 1
      ws = addDays(ws, -7)
    } else break
  }
  return streak
}

// 最長の連続達成週
export function longestWeeklyStreak(records, target, createdAtKey) {
  const createdWeek = startOfWeek(fromKey(createdAtKey))
  const nowWeek = startOfWeek(new Date())
  let ws = createdWeek
  let best = 0
  let run = 0
  while (ws <= nowWeek) {
    const isCurrent = ws.getTime() === nowWeek.getTime()
    const met = weekCountFromStart(records, ws) >= target
    if (met) {
      run += 1
      if (run > best) best = run
    } else if (!isCurrent) {
      run = 0 // 進行中の今週が未達成でも途切れ扱いにしない
    }
    ws = addDays(ws, 7)
  }
  return best
}

// 達成率（週N回）: 直近maxWeeks週で、各週min(達成,目標)の合計 ÷ (目標×週数)
export function weeklyCompletionRate(records, target, createdAtKey, maxWeeks = 8) {
  const createdWeek = startOfWeek(fromKey(createdAtKey))
  let ws = startOfWeek(new Date())
  let got = 0
  let weeks = 0
  while (ws >= createdWeek && weeks < maxWeeks) {
    got += Math.min(weekCountFromStart(records, ws), target)
    weeks += 1
    ws = addDays(ws, -7)
  }
  if (weeks === 0) return 0
  return Math.round((got / (target * weeks)) * 100)
}

// ===== まとめ: カードが使う統計 =====
export function computeStats(habit, records) {
  const goal = normalizeGoal(habit)
  const created = (habit && habit.createdAt) || toKey(new Date())
  const total = totalDone(records)

  if (goal.type === 'weekly') {
    return {
      mode: 'weekly',
      target: goal.target,
      weekCount: weekCount(records),
      streak: weeklyStreak(records, goal.target, created),
      streakUnit: '週',
      longest: longestWeeklyStreak(records, goal.target, created),
      rate: weeklyCompletionRate(records, goal.target, created),
      total,
    }
  }
  return {
    mode: 'daily',
    streak: currentStreak(records),
    streakUnit: '日',
    longest: longestStreak(records),
    rate: dailyCompletionRate(records, created),
    total,
  }
}
