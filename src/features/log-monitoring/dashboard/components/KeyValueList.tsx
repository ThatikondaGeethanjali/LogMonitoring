type KeyValueListProps = {
  items: readonly (readonly [string, string])[]
  compact?: boolean
}

export function KeyValueList({ items, compact = false }: KeyValueListProps) {
  return (
    <div className={compact ? "mt-3 space-y-2" : "mt-4 space-y-2.5"}>
      {items.map(([label, value]) => (
        <div
          key={label}
          className={`grid gap-2 ${compact ? "grid-cols-[104px_1fr]" : "grid-cols-[140px_1fr]"}`}
        >
          <span className="text-xs text-slate-500">{label}</span>
          <span className="text-xs leading-5 text-slate-700">{value}</span>
        </div>
      ))}
    </div>
  )
}
