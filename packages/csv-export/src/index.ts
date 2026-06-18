import type { RegistrationWithUser, Event } from '@ttg/types'
import { registrationStatusLabel, registrationTypeLabel, formatIsoDate } from '@ttg/utils'

// ─── CSV builder ─────────────────────────────────────────────────────────────

function escape(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function row(...cells: (string | number)[]): string {
  return cells.map(escape).join(',')
}

export function exportRegistrations(
  registrations: RegistrationWithUser[],
  event: Event,
): string {
  const header = row(
    'Name',
    'Email',
    'Status',
    'Type',
    'Teammate',
    'Companion Name',
    'Registered At',
  )

  const rows = registrations.map(r =>
    row(
      r.user.name,
      r.user.email,
      registrationStatusLabel(r.status),
      registrationTypeLabel(r.type, r.teammateName),
      r.teammateName ?? '',
      r.companionName ?? '',
      formatIsoDate(r.registeredAt),
    ),
  )

  const meta = [
    `# Event: ${event.name}`,
    `# Date: ${event.date} ${event.time}`,
    `# Exported: ${new Date().toISOString()}`,
    '',
  ]

  return [...meta, header, ...rows].join('\n')
}

// ─── Browser download ────────────────────────────────────────────────────────

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** Convenience: build CSV and trigger download in one call */
export function downloadRegistrationsCsv(
  registrations: RegistrationWithUser[],
  event: Event,
): void {
  const slug = event.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const filename = `registrations-${slug}-${event.date}`
  downloadCsv(filename, exportRegistrations(registrations, event))
}
