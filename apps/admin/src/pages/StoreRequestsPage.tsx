import { useState } from 'react'
import { useStoreApplications } from '@ttg/hooks'
import { Spinner, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ttg/ui'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return `${Math.floor(diff / 60_000)}m ago`
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const STATUS_TABS = ['pending', 'approved', 'rejected', 'all'] as const

export function StoreRequestsPage() {
  const { data: apps = [], isLoading } = useStoreApplications()
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')

  const filtered = tab === 'all' ? apps : apps.filter(a => a.status === tab)
  const pendingCount = apps.filter(a => a.status === 'pending').length

  return (
    <div className="p-5 page-enter">
      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {STATUS_TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'text-[11px] px-[10px] py-[5px] rounded-[6px] border transition-colors capitalize',
              tab === t
                ? 'bg-gold/10 border-gold/30 text-gold'
                : 'bg-transparent border-line text-ink-3 hover:border-ink-4',
            ].join(' ')}
          >
            {t}
            {t === 'pending' && pendingCount > 0 && (
              <span className="ml-1 bg-gold text-bg text-[9px] font-bold rounded-full px-[5px] py-[1px]">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="bg-surface-2 border border-line rounded-[8px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>WPN</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(app => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="text-[12px] font-medium text-ink">{app.storeName}</div>
                    {app.website && (
                      <div className="text-[10px] text-ink-4">{app.website.replace('https://', '')}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-[11px] text-ink-2">{app.contactName}</div>
                    <div className="text-[10px] text-ink-4">{app.contactEmail}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px]">{app.city}</span>
                    <span className="text-[10px] text-ink-4 ml-1">{app.country}</span>
                  </TableCell>
                  <TableCell>
                    {app.wpn ? (
                      <span className="text-[10px] text-green bg-green/10 border border-green/20 rounded-[4px] px-[6px] py-[2px]">WPN</span>
                    ) : (
                      <span className="text-[10px] text-ink-4">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] text-ink-3">{timeAgo(app.submittedAt)}</span>
                  </TableCell>
                  <TableCell>
                    {app.status === 'pending' && (
                      <span className="text-[10px] text-amber border border-amber/30 rounded-[4px] px-[7px] py-[2px]">Pending</span>
                    )}
                    {app.status === 'approved' && (
                      <span className="text-[10px] text-green border border-green/30 rounded-[4px] px-[7px] py-[2px]">Approved</span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="text-[10px] text-red border border-red/30 rounded-[4px] px-[7px] py-[2px]">Rejected</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {app.status === 'pending' && (
                      <div className="flex gap-1">
                        <button className="text-[10px] text-green border border-green/30 rounded-[4px] px-[7px] py-[2px] bg-transparent cursor-pointer hover:bg-green/5 transition-colors">
                          Approve
                        </button>
                        <button className="text-[10px] text-red border border-red/20 rounded-[4px] px-[7px] py-[2px] bg-transparent cursor-pointer hover:bg-red/5 transition-colors">
                          Reject
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-[14px] py-8 text-center text-[13px] text-ink-4">
                    No {tab === 'all' ? '' : tab} requests.
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
