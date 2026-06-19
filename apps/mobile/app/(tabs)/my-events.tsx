import { useState, useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/auth'
import { getMyRegistrations, getEventsWithStore, getConfirmedCount, getEventStats, getRegistrationsWithUsers } from '@ttg/mock-data'
import { formatDate, registrationStatusLabel, registrationTypeLabel, calcFillPct } from '@ttg/utils'
import type { RegistrationWithUser, RegistrationStatus, EventStatus } from '@ttg/types'
import { C } from '@/constants/theme'

// ── Shared ────────────────────────────────────────────────────────────────────

function statusColor(s: RegistrationStatus): string {
  const map: Record<RegistrationStatus, string> = {
    registered:   C.gold,
    waitlisted:   C.text3,
    'checked-in': C.green,
    attended:     C.text3,
    cancelled:    C.red,
  }
  return map[s]
}

function StatusBadge({ status }: { status: RegistrationStatus }) {
  const color = statusColor(status)
  return (
    <View style={[s.badge, { backgroundColor: `${color}1a`, borderColor: `${color}33` }]}>
      <Text style={[s.badgeText, { color }]}>{registrationStatusLabel(status)}</Text>
    </View>
  )
}

// ── Admin view ─────────────────────────────────────────────────────────────────

const STATUS_FILTERS: (EventStatus | 'all')[] = ['all', 'upcoming', 'active', 'completed', 'cancelled']

function adminStatusColor(status: EventStatus) {
  if (status === 'active') return C.green
  if (status === 'upcoming') return '#5b9cf6'
  if (status === 'cancelled') return C.red
  return C.text4
}

function AdminEventsView() {
  const user = useAuthStore(st => st.user)
  const isSuperAdmin = user?.role === 'ttg-admin'
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showPlayersId, setShowPlayersId] = useState<string | null>(null)

  const allEvents = getEventsWithStore()
  const storeEvents = isSuperAdmin ? allEvents : allEvents.filter(e => e.storeId === user?.storeId)

  const filtered = storeEvents.filter(ev => {
    if (statusFilter !== 'all' && ev.status !== statusFilter) return false
    if (search && !ev.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <View style={s.screen}>
      <View style={s.filterBar}>
        <TextInput
          style={s.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search events…"
          placeholderTextColor={C.text4}
        />
      </View>

      <View style={s.chips}>
        {STATUS_FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[s.chip, statusFilter === f && s.chipActive]}
            onPress={() => setStatusFilter(f)}
            activeOpacity={0.75}
          >
            <Text style={[s.chipText, statusFilter === f && s.chipTextActive]}>
              {f === 'all' ? 'All' : f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={ev => ev.id}
        contentContainerStyle={s.list}
        renderItem={({ item: ev }) => {
          const reg = getConfirmedCount(ev.id)
          const fill = calcFillPct(reg, ev.capacity)
          const color = adminStatusColor(ev.status)
          const expanded = expandedId === ev.id
          const stats = expanded ? getEventStats(ev.id) : null
          const showPlayers = showPlayersId === ev.id
          const players = showPlayers ? getRegistrationsWithUsers(ev.id) : []

          return (
            <TouchableOpacity
              style={[s.card, expanded && s.cardExpanded]}
              onPress={() => setExpandedId(expanded ? null : ev.id)}
              activeOpacity={0.75}
            >
              <View style={s.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardName}>{ev.name}</Text>
                  {isSuperAdmin && <Text style={s.cardStore}>{ev.store.name}</Text>}
                </View>
                <View style={[s.statusBadge, { borderColor: color + '66' }]}>
                  <Text style={[s.statusText, { color }]}>{ev.status}</Text>
                </View>
              </View>
              <Text style={s.cardDate}>{formatDate(ev.date)} · {ev.time}</Text>
              <View style={s.fillRow}>
                <Text style={s.fillText}>{reg}/{ev.capacity} registered</Text>
                <View style={s.fillBar}>
                  <View style={[s.fillFill, { width: `${fill}%` as any, backgroundColor: fill >= 90 ? C.gold : C.green }]} />
                </View>
                <Text style={s.fillPct}>{fill}%</Text>
              </View>

              {expanded && stats && (
                <View style={s.statsBox}>
                  <View style={s.statsGrid}>
                    {[
                      { label: 'Confirmed',  value: `${stats.confirmed} / ${ev.capacity}` },
                      { label: 'Waitlisted', value: `${stats.waitlisted} / ${ev.waitlistCapacity}` },
                      { label: 'Checked In', value: String(stats.checkedIn) },
                      { label: 'Attended',   value: String(stats.attended) },
                      { label: 'Cancelled',  value: String(stats.cancelled) },
                      { label: 'Est. Revenue', value: stats.estimatedRevenue > 0 ? `${stats.estimatedRevenue} ${ev.currency}` : 'Free' },
                    ].map(item => (
                      <View key={item.label} style={s.statItem}>
                        <Text style={s.statItemLabel}>{item.label}</Text>
                        <Text style={s.statItemValue}>{item.value}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={s.editBtn}
                    onPress={() => setShowPlayersId(showPlayers ? null : ev.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={s.editBtnText}>{showPlayers ? 'Hide Players' : 'Show All Stats'}</Text>
                  </TouchableOpacity>

                  {showPlayers && (
                    <View style={s.playerList}>
                      {players.length === 0 ? (
                        <Text style={s.playerEmpty}>No registrations yet.</Text>
                      ) : players.map(reg => {
                        const nameColor = reg.status === 'registered' ? C.gold
                          : reg.status === 'checked-in' || reg.status === 'attended' ? C.green
                          : reg.status === 'waitlisted' ? C.text3
                          : C.red
                        return (
                          <View key={reg.id} style={s.playerRow}>
                            <View style={{ flex: 1 }}>
                              <Text style={s.playerName}>{reg.user.name}</Text>
                              <Text style={s.playerEmail}>{reg.user.email}</Text>
                              {reg.teammateName && (
                                <Text style={s.playerTeammate}>w/ {reg.teammateName}</Text>
                              )}
                            </View>
                            <Text style={[s.playerStatus, { color: nameColor }]}>{reg.status}</Text>
                          </View>
                        )
                      })}
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={<Text style={s.emptyText}>No events found.</Text>}
      />
    </View>
  )
}

// ── Player view ────────────────────────────────────────────────────────────────

function RegCard({ reg, eventName, storeName, date }: {
  reg: RegistrationWithUser
  eventName: string
  storeName: string
  date: string
}) {
  return (
    <TouchableOpacity
      style={s.card}
      onPress={() => router.push(`/events/${reg.eventId}`)}
      activeOpacity={0.75}
    >
      <View style={s.cardRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={s.eventName} numberOfLines={1}>{eventName}</Text>
          <Text style={s.storeName}>{storeName} · {formatDate(date)}</Text>
          <Text style={s.typeName}>{registrationTypeLabel(reg.type, reg.teammateName)}</Text>
        </View>
        <StatusBadge status={reg.status} />
      </View>
    </TouchableOpacity>
  )
}

function SignInPrompt() {
  return (
    <View style={s.empty}>
      <Text style={s.emptyTitle}>Sign in to see your events</Text>
      <Text style={s.emptySubtext}>Track registrations, waitlists, and event history</Text>
      <TouchableOpacity style={s.signInBtn} onPress={() => router.push('/(tabs)/profile')}>
        <Text style={s.signInBtnText}>Go to Profile →</Text>
      </TouchableOpacity>
    </View>
  )
}

function PlayerEventsView() {
  const user = useAuthStore(st => st.user)

  const { registrations, eventsMap } = useMemo(() => {
    if (!user) return { registrations: [], eventsMap: {} }
    const regs = getMyRegistrations(user.id)
    const allEvents = getEventsWithStore()
    const map: Record<string, typeof allEvents[0]> = {}
    allEvents.forEach(e => { map[e.id] = e })
    return { registrations: regs, eventsMap: map }
  }, [user])

  const upcoming = registrations.filter(r =>
    r.status === 'registered' || r.status === 'waitlisted' || r.status === 'checked-in'
  )
  const history = registrations.filter(r => r.status === 'attended')
  const cancelled = registrations.filter(r => r.status === 'cancelled')

  if (!user) return <View style={s.screen}><SignInPrompt /></View>

  return (
    <View style={s.screen}>
      <View style={s.statsRow}>
        {[
          { label: 'Upcoming', value: upcoming.length },
          { label: 'History', value: history.length },
          { label: 'Waitlisted', value: registrations.filter(r => r.status === 'waitlisted').length },
        ].map(stat => (
          <View key={stat.label} style={s.statCard}>
            <Text style={s.statValue}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={[
          ...upcoming,
          ...(history.length > 0 ? [{ separator: 'history' } as const] : []),
          ...history,
          ...(cancelled.length > 0 ? [{ separator: 'cancelled' } as const] : []),
          ...cancelled,
        ]}
        keyExtractor={(item, i) => 'separator' in item ? `sep-${item.separator}` : item.id + i}
        renderItem={({ item }) => {
          if ('separator' in item) {
            const label = item.separator === 'history' ? 'HISTORY' : 'CANCELLED'
            return (
              <View style={s.section}>
                <Text style={s.sectionLabel}>{label}</Text>
              </View>
            )
          }
          const ev = eventsMap[item.eventId]
          if (!ev) return null
          return (
            <RegCard
              reg={item as RegistrationWithUser}
              eventName={ev.name}
              storeName={ev.store.name}
              date={ev.date}
            />
          )
        }}
        ListHeaderComponent={
          upcoming.length > 0 ? (
            <View style={s.section}>
              <Text style={s.sectionLabel}>UPCOMING</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyTitle}>No registrations yet</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/')}>
              <Text style={[s.emptySubtext, { color: C.gold }]}>Browse events →</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  )
}

// ── Entry point ────────────────────────────────────────────────────────────────

export default function MyEventsScreen() {
  const user = useAuthStore(st => st.user)
  const isAdmin = user?.role === 'store-admin' || user?.role === 'ttg-admin'
  return isAdmin ? <AdminEventsView /> : <PlayerEventsView />
}

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: C.bg },
  list:          { padding: 12, gap: 10 },

  // Admin styles
  filterBar:     { padding: 12, paddingBottom: 0 },
  searchInput:   { backgroundColor: C.bg2, borderRadius: 8, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 13, padding: 10 },
  chips:         { flexDirection: 'row', gap: 6, paddingHorizontal: 12, paddingVertical: 10, flexWrap: 'wrap' },
  chip:          { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg2 },
  chipActive:    { backgroundColor: `${C.gold}1a`, borderColor: `${C.gold}4d` },
  chipText:      { fontSize: 11, color: C.text3, textTransform: 'capitalize' },
  chipTextActive:{ color: C.gold },
  cardHeader:    { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  cardName:      { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 2 },
  cardStore:     { fontSize: 11, color: C.text4 },
  statusBadge:   { borderRadius: 4, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 2 },
  statusText:    { fontSize: 10, fontWeight: '500', textTransform: 'capitalize' },
  cardDate:      { fontSize: 12, color: C.text3, marginBottom: 8 },
  fillRow:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fillText:      { fontSize: 11, color: C.text3 },
  fillBar:       { flex: 1, height: 3, backgroundColor: C.bg4, borderRadius: 2, overflow: 'hidden' },
  fillFill:      { height: '100%', borderRadius: 2 },
  fillPct:       { fontSize: 11, color: C.text4, width: 30, textAlign: 'right' },
  emptyText:     { textAlign: 'center', color: C.text4, fontSize: 13, padding: 32 },

  // Player styles
  statsRow:      { flexDirection: 'row', gap: 8, padding: 16, backgroundColor: C.bg1, borderBottomWidth: 1, borderBottomColor: C.border },
  statCard:      { flex: 1, backgroundColor: C.bg2, borderRadius: 8, borderWidth: 1, borderColor: C.border, padding: 10, alignItems: 'center' },
  statValue:     { fontSize: 22, fontWeight: '700', color: C.text },
  statLabel:     { fontSize: 10, color: C.text4, marginTop: 2 },
  section:       { paddingVertical: 10, paddingTop: 16 },
  sectionLabel:  { fontSize: 10, fontWeight: '600', color: C.text4, letterSpacing: 1 },
  cardRow:       { flexDirection: 'row', alignItems: 'flex-start' },
  eventName:     { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 2 },
  storeName:     { fontSize: 11, color: C.text3, marginBottom: 2 },
  typeName:      { fontSize: 10, color: C.text4 },
  badge:         { borderRadius: 5, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start' },
  badgeText:     { fontSize: 10, fontWeight: '600' },
  empty:         { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 8 },
  emptyTitle:    { fontSize: 16, fontWeight: '600', color: C.text },
  emptySubtext:  { fontSize: 13, color: C.text3 },
  signInBtn:     { marginTop: 12, backgroundColor: `${C.gold}1a`, borderRadius: 8, borderWidth: 1, borderColor: `${C.gold}4d`, paddingHorizontal: 20, paddingVertical: 10 },
  signInBtnText: { fontSize: 13, color: C.gold, fontWeight: '600' },

  // Shared
  card:          { backgroundColor: C.bg2, borderRadius: 9, borderWidth: 1, borderColor: C.border, padding: 13 },
  cardExpanded:  { borderColor: `${C.gold}4d` },

  statsBox:      { marginTop: 12, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12, gap: 10 },
  statsGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statItem:      { width: '30%', flexGrow: 1, backgroundColor: C.bg3, borderRadius: 7, borderWidth: 1, borderColor: C.border, padding: 8 },
  statItemLabel: { fontSize: 9, fontWeight: '600', color: C.text4, letterSpacing: 0.6, marginBottom: 4 },
  statItemValue: { fontSize: 14, fontWeight: '700', color: C.text },

  editBtn:       { backgroundColor: C.gold, borderRadius: 7, padding: 10, alignItems: 'center' },
  editBtnText:   { fontSize: 13, fontWeight: '700', color: C.bg },

  playerList:    { marginTop: 10, backgroundColor: C.bg2, borderRadius: 7, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  playerRow:     { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  playerName:    { fontSize: 12, fontWeight: '600', color: C.text },
  playerEmail:   { fontSize: 10, color: C.text4 },
  playerTeammate:{ fontSize: 10, color: C.text3, fontStyle: 'italic' },
  playerStatus:  { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  playerEmpty:   { fontSize: 12, color: C.text4, textAlign: 'center', padding: 16 },
})
