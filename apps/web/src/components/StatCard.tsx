interface StatCardProps {
  label: string
  value: number | string
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-surface-2 border border-line rounded-[8px] p-3 text-center">
      <p className="text-[24px] font-bold text-ink">{value}</p>
      <p className="text-[11px] text-ink-4">{label}</p>
    </div>
  )
}
