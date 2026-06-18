import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useEvent, useEventStats, useRegistrationsWithUsers } from '@ttg/hooks'
import { Badge, Button, Spinner, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Avatar } from '@ttg/ui'
import { formatDate, gameLabel, formatLabel, registrationStatusLabel, registrationTypeLabel, getInitials, formatCurrency, relativeTime } from '@ttg/utils'
import { downloadRegistrationsCsv } from '@ttg/csv-export'
import { ANNOUNCEMENTS } from '@ttg/mock-data'
import type { RegistrationWithUser } from '@ttg/types'

type Tab = 'registrations' | 'checkin' | 'waitlist' | 'announcements'

function TabBtn({ id, active, onClick, children }: { id: Tab; active: Tab; onClick: (t: Tab) => void; children: React.ReactNode }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors ${
        active === id ? 'border-gold text-gold' : 'border-transparent text-ink-3 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

export function EventDetailPage() {
  const { eventId } = useParams({ strict: false }) as { eventId: string }
  const { data: event, isLoading: eventLoading } = useEvent(eventId)
  const { data: stats } = useEventStats(eventId)
  const { data: registrations, isLoading: regsLoading } = useRegistrationsWithUsers(eventId)
  const [tab, setTab] = useState<Tab>('registrations')
  const [checkedIn, setCheckedIn] = useState<Set<string>>(new Set())
  const [promoted, setPromoted] = useState<Set<string>>(new Set())
  const [cancelled, setCancelled] = useState<Set<string>>(new Set())
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementBody, setAnnouncementBody] = useState('')
  const [announcementSent, setAnnouncementSent] = useState(false)

  if (eventLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!event) return <div className="p-8 text-ink-3">Event not found.</div>

  const regs = registrations ?? []
  const registered = regs.filter(r => r.status === 'registered' || r.status === 'checked-in' || promoted.has(r.id))
  const waitlisted = regs.filter(r => r.status === 'waitlisted' && !promoted.has(r.id) && !cancelled.has(r.id))
  const announcements = ANNOUNCEMENTS.filter(a => a.eventId === eventId)

  function effectiveStatus(r: RegistrationWithUser) {
    if (cancelled.has(r.id)) return 'cancelled'
    if (checkedIn.has(r.id)) return 'checked-in'
    if (promoted.has(r.id)) return 'registered'
    return r.status
  }

  function statusBadge(r: RegistrationWithUser) {
    const s = effectiveStatus(r)
    const map: Record<string, 'active' | 'sealed' | 'waitlisted' | 'neutral'> = {
      registered: 'sealed', 'checked-in': 'active', attended: 'neutral', cancelled: 'neutral', waitlisted: 'waitlisted',
    }
    return <Badge variant={map[s] ?? 'neutral'}>{registrationStatusLabel(s as never)}</Badge>
  }

  function handleCheckIn(id: string) {
    setCheckedIn(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function handlePromote(id: string) {
    setPromoted(prev => { const n = new Set(prev); n.add(id); return n })
  }
  function handleCancel(id: string) {
    setCancelled(prev => { const n = new Set(prev); n.add(id); return n })
  }

  function handleSendAnnouncement(e: React.FormEvent) {
    e.preventDefault()
    setAnnouncementSent(true)
    setTimeout(() => { setAnnouncementSent(false); setAnnouncementTitle(''); setAnnouncementBody('') }, 3000)
  }

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-ink-4 mb-5">
        <Link to="/" className="hover:text-ink-2 transition-colors">Events</Link>
        <span>/</span>
        <span className="text-ink-3">{event.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-[20px] font-semibold text-ink">{event.name}</h1>
            <Badge variant={event.status === 'active' ? 'active' : event.status === 'upcoming' ? 'pending' : 'neutral'}>
              {event.status}
            </Badge>
          </div>
          <p className="text-[12px] text-ink-3">{formatDate(event.date)} · {event.time} · {gameLabel(event.game)} · {formatLabel(event.format)}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => { if (registrations && event) downloadRegistrationsCsv(registrations, event) }}
        >
          ↓ Export CSV
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { label: 'Registered', value: stats?.confirmed ?? registered.length },
          { label: 'Capacity', value: event.capacity },
          { label: 'Checked In', value: (stats?.checkedIn ?? 0) + checkedIn.size },
          { label: 'Waitlisted', value: waitlisted.length },
          { label: 'Revenue', value: formatCurrency((stats?.estimatedRevenue ?? 0), event.currency) },
        ].map(s => (
          <div key={s.label} className="bg-surface-2 border border-line rounded-[8px] p-3 text-center">
            <p className="text-[18px] font-bold text-ink">{s.value}</p>
            <p className="text-[10px] text-ink-4">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-line mb-5 flex gap-0">
        <TabBtn id="registrations" active={tab} onClick={setTab}>
          Registrations ({registered.length})
        </TabBtn>
        <TabBtn id="checkin" active={tab} onClick={setTab}>
          Check-in
        </TabBtn>
        <TabBtn id="waitlist" active={tab} onClick={setTab}>
          Waitlist ({waitlisted.length})
        </TabBtn>
        <TabBtn id="announcements" active={tab} onClick={setTab}>
          Announcements ({announcements.length})
        </TabBtn>
      </div>

      {/* Tab: Registrations */}
      {tab === 'registrations' && (
        regsLoading ? <Spinner /> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registered.map(r => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar initials={getInitials(r.user.name)} size="sm" />
                      <div>
                        <p className="text-[12px] font-medium text-ink">{r.user.name}</p>
                        <p className="text-[10px] text-ink-4">{r.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{registrationTypeLabel(r.type, r.teammateName)}</TableCell>
                  <TableCell>{statusBadge(r)}</TableCell>
                  <TableCell className="text-ink-4">{relativeTime(r.registeredAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      {!cancelled.has(r.id) && (
                        <Button
                          size="xs"
                          variant={checkedIn.has(r.id) ? 'success' : 'ghost'}
                          onClick={() => handleCheckIn(r.id)}
                        >
                          {checkedIn.has(r.id) ? '✓ In' : 'Check In'}
                        </Button>
                      )}
                      {!cancelled.has(r.id) && (
                        <Button size="xs" variant="danger" onClick={() => handleCancel(r.id)}>Cancel</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {registered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-ink-4 py-8">No registrations yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )
      )}

      {/* Tab: Check-in */}
      {tab === 'checkin' && (
        <div>
          <p className="text-[12px] text-ink-3 mb-4">
            {checkedIn.size} / {registered.length} checked in this session
          </p>
          <div className="flex flex-col gap-1.5">
            {registered.filter(r => !cancelled.has(r.id)).map(r => {
              const isIn = checkedIn.has(r.id) || r.status === 'checked-in'
              return (
                <button
                  key={r.id}
                  onClick={() => handleCheckIn(r.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-[8px] border transition-colors ${
                    isIn
                      ? 'bg-green/10 border-green/30 text-green'
                      : 'bg-surface-2 border-line text-ink hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                      isIn ? 'border-green bg-green text-surface' : 'border-line'
                    }`}>
                      {isIn && '✓'}
                    </div>
                    <div className="text-left">
                      <p className="text-[13px] font-medium">{r.user.name}</p>
                      <p className="text-[11px] opacity-60">{registrationTypeLabel(r.type, r.teammateName)}</p>
                    </div>
                  </div>
                  <span className="text-[11px] opacity-50">{r.user.email}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab: Waitlist */}
      {tab === 'waitlist' && (
        <div>
          {waitlisted.length === 0 ? (
            <p className="text-[13px] text-ink-3 py-8 text-center">No players on the waitlist.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Waitlisted</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlisted.map((r, idx) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-ink-4 w-4">#{idx + 1}</span>
                        <Avatar initials={getInitials(r.user.name)} size="sm" />
                        <div>
                          <p className="text-[12px] font-medium text-ink">{r.user.name}</p>
                          <p className="text-[10px] text-ink-4">{r.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{registrationTypeLabel(r.type, r.teammateName)}</TableCell>
                    <TableCell className="text-ink-4">{relativeTime(r.registeredAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <Button size="xs" variant="success" onClick={() => handlePromote(r.id)}>
                          Promote
                        </Button>
                        <Button size="xs" variant="danger" onClick={() => handleCancel(r.id)}>
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {/* Tab: Announcements */}
      {tab === 'announcements' && (
        <div className="flex gap-6">
          {/* Sent */}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-ink-3 mb-3">Sent ({announcements.length})</p>
            {announcements.length === 0 ? (
              <p className="text-[13px] text-ink-4">No announcements sent yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {announcements.map(a => (
                  <div key={a.id} className="bg-surface-2 border border-line rounded-[8px] p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-[13px] font-medium text-ink">{a.title}</p>
                      <span className="text-[10px] text-ink-4 shrink-0">{relativeTime(a.sentAt)}</span>
                    </div>
                    <p className="text-[12px] text-ink-3 leading-relaxed mb-3">{a.body}</p>
                    <div className="flex gap-4 text-[11px] text-ink-4">
                      <span>Sent: {a.sentCount}</span>
                      <span>Opened: {a.openCount}</span>
                      <span>Rate: {Math.round(a.openCount / a.sentCount * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compose */}
          <div className="w-[300px] shrink-0">
            <p className="text-[12px] font-semibold text-ink-3 mb-3">Send Announcement</p>
            {announcementSent ? (
              <div className="bg-green/10 border border-green/30 rounded-[8px] p-4 text-center">
                <p className="text-[13px] text-green font-medium">✓ Sent to {registered.length} players</p>
              </div>
            ) : (
              <form onSubmit={handleSendAnnouncement} className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] text-ink-4 block mb-1">Subject</label>
                  <input
                    value={announcementTitle}
                    onChange={e => setAnnouncementTitle(e.target.value)}
                    placeholder="Reminder: event tomorrow"
                    required
                    className="w-full bg-surface-1 border border-line rounded-[7px] px-3 py-2 text-[12px] text-ink outline-none focus:border-gold placeholder:text-ink-4"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-ink-4 block mb-1">Message</label>
                  <textarea
                    value={announcementBody}
                    onChange={e => setAnnouncementBody(e.target.value)}
                    placeholder="Write your message…"
                    rows={4}
                    required
                    className="w-full bg-surface-1 border border-line rounded-[7px] px-3 py-2 text-[12px] text-ink outline-none focus:border-gold placeholder:text-ink-4 resize-none"
                  />
                </div>
                <p className="text-[11px] text-ink-4">Will be sent to {registered.length} registered players.</p>
                <Button type="submit" className="w-full" size="sm">Send Announcement</Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
