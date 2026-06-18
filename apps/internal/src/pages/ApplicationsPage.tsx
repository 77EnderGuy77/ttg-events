import { useState } from 'react'
import { useStoreApplications } from '@ttg/hooks'
import { Badge, Button, Spinner } from '@ttg/ui'
import { formatIsoDate, relativeTime } from '@ttg/utils'
import type { ApplicationStatus } from '@ttg/types'

type Filter = 'all' | 'pending' | 'approved' | 'rejected'

function statusVariant(status: ApplicationStatus): 'pending' | 'active' | 'neutral' {
  return status === 'pending' ? 'pending' : status === 'approved' ? 'active' : 'neutral'
}

export function ApplicationsPage() {
  const { data: applications, isLoading } = useStoreApplications()
  const [filter, setFilter] = useState<Filter>('pending')
  const [approved, setApproved] = useState<Set<string>>(new Set())
  const [rejected, setRejected] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<string | null>(null)

  function effectiveStatus(id: string, orig: ApplicationStatus): ApplicationStatus {
    if (approved.has(id)) return 'approved'
    if (rejected.has(id)) return 'rejected'
    return orig
  }

  const all = applications ?? []
  const filtered = all.filter(a => {
    const s = effectiveStatus(a.id, a.status)
    return filter === 'all' || s === filter
  })

  const pendingCount = all.filter(a => effectiveStatus(a.id, a.status) === 'pending').length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-ink">Store Applications</h1>
        <p className="text-[12px] text-ink-3 mt-0.5">{pendingCount} pending review</p>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-5">
        {(['pending', 'approved', 'rejected', 'all'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[12px] px-3 py-1.5 rounded-[6px] border capitalize transition-colors ${
              filter === f
                ? 'bg-purple/10 text-purple-light border-purple/30'
                : 'bg-surface-2 text-ink-3 border-line hover:text-ink'
            }`}
          >
            {f === 'all' ? 'All' : f}
            {f === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 bg-amber/20 text-amber text-[10px] px-1 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-2 border border-line rounded-[10px] p-8 text-center">
          <p className="text-[13px] text-ink-3">No {filter === 'all' ? '' : filter} applications.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(app => {
            const status = effectiveStatus(app.id, app.status)
            const isPending = status === 'pending'
            const isOpen = expanded === app.id

            return (
              <div key={app.id} className="bg-surface-2 border border-line rounded-[10px] overflow-hidden">
                <div
                  className="px-5 py-4 cursor-pointer hover:bg-surface-3 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : app.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-[14px] font-semibold text-ink">{app.storeName}</p>
                        <Badge variant={statusVariant(status)}>{status}</Badge>
                        {app.wpn && (
                          <span className="text-[10px] text-gold bg-gold/10 border border-gold/20 rounded px-1.5 py-0.5">WPN</span>
                        )}
                      </div>
                      <p className="text-[12px] text-ink-3">{app.city}, {app.country} · {app.contactName} · {app.contactEmail}</p>
                      <p className="text-[11px] text-ink-4 mt-0.5">Submitted {relativeTime(app.submittedAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isPending && (
                        <>
                          <Button
                            size="xs"
                            variant="success"
                            onClick={e => { e.stopPropagation(); setApproved(p => new Set(p).add(app.id)) }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="xs"
                            variant="danger"
                            onClick={e => { e.stopPropagation(); setRejected(p => new Set(p).add(app.id)) }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <span className="text-[12px] text-ink-4">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-line px-5 py-4 bg-surface-1">
                    <div className="grid grid-cols-2 gap-4 text-[12px]">
                      {[
                        { label: 'Store Name', value: app.storeName },
                        { label: 'Contact', value: app.contactName },
                        { label: 'Email', value: app.contactEmail },
                        { label: 'City', value: `${app.city}, ${app.country}` },
                        { label: 'Address', value: app.address ?? '—' },
                        { label: 'Website', value: app.website ?? '—' },
                        { label: 'WPN Member', value: app.wpn ? 'Yes' : 'No' },
                        { label: 'Submitted', value: formatIsoDate(app.submittedAt) },
                        { label: 'Status', value: status },
                        ...(app.reviewedAt ? [{ label: 'Reviewed', value: formatIsoDate(app.reviewedAt) }] : []),
                      ].map(row => (
                        <div key={row.label}>
                          <p className="text-ink-4 mb-0.5">{row.label}</p>
                          <p className="text-ink">{row.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
