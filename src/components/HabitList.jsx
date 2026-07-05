import HabitCard from './HabitCard.jsx'

export default function HabitList({ habits, records, onToggle, onEdit, onDelete }) {
  return (
    <div className="habit-list">
      {habits.map((h) => (
        <HabitCard
          key={h.id}
          habit={h}
          records={records[h.id] || {}}
          onToggle={(dateKey) => onToggle(h.id, dateKey)}
          onEdit={() => onEdit(h)}
          onDelete={() => onDelete(h.id)}
        />
      ))}
    </div>
  )
}
