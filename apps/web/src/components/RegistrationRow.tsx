import { Link } from '@tanstack/react-router'
import { Badge } from '@ttg/ui'
import { formatDate, registrationStatusLabel, registrationTypeLabel } from '@ttg/utils'
import type { Registration, EventWithStore } from '@ttg/types'
import { registrationStatusVariant } from '../utils/variants'

interface RegistrationRowProps {
  registration: Registration
  event?: EventWithStore
}

export function RegistrationRow({ registration: reg, event: ev }: RegistrationRowProps) {
  return (
    <div className="bg-surface-2 border border-line rounded-[8px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {ev ? (
            <Link
              to="/events/$eventId"
              params={{ eventId: ev.id }}
              className="text-[13px] font-medium text-ink hover:text-gold transition-colors block truncate"
            >
              {ev.name}
            </Link>
          ) : (
            <p className="text-[13px] font-medium text-ink truncate">{reg.eventId}</p>
          )}
          {ev && (
            <p className="text-[11px] text-ink-3 mt-0.5">
              {ev.store.name} · {formatDate(ev.date)} · {ev.time}
            </p>
          )}
          <p className="text-[11px] text-ink-4 mt-0.5">
            {registrationTypeLabel(reg.type, reg.teammateName)}
          </p>
        </div>
        <Badge variant={registrationStatusVariant(reg.status)}>
          {registrationStatusLabel(reg.status)}
        </Badge>
      </div>
    </div>
  )
}
