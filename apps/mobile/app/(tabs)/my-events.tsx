import { useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/auth'
import { getMyRegistrations, getEventsWithStore } from '@ttg/mock-data'
import { formatDate, registrationStatusLabel, registrationTypeLabel } from '@ttg/utils'
import type { RegistrationWithUser, RegistrationStatus } from '@ttg/types'
import { C } from '@/constants/theme'

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
      <Text style={s.emptyText}>Track registrations, waitlists, and event history</Text>
      <TouchableOpacity style={s.signInBtn} onPress={() => router.push('/(tabs)/profile')}>
        <Text style={s.signInBtnText}>Go to Profile →</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function MyEventsScreen() {
  const user = useAuthStore(s => s.user)

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
  const past = registrations.filter(r =>
    r.status === 'attended' || r.status === 'cancelled'
  )

  if (!user) return <View style={s.screen}><SignInPrompt /></View>

  return (
    <View style={s.screen}>
      {/* Stats row */}
      <View style={s.statsRow}>
        {[
          { label: 'Upcoming', value: upcoming.length },
          { label: 'Attended', value: registrations.filter(r => r.status === 'attended').length },
          { label: 'Waitlisted', value: registrations.filter(r => r.status === 'waitlisted').length },
        ].map(stat => (
          <View key={stat.label} style={s.statCard}>
            <Text style={s.statValue}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={[...upcoming, ...(past.length > 0 ? [{ separator: 'past' } as const] : []), ...past]}
        keyExtractor={(item, i) => 'separator' in item ? 'sep' : item.id + i}
        renderItem={({ item }) => {
          if ('separator' in item) {
            return (
              <View style={s.section}>
                <Text style={s.sectionLabel}>PAST</Text>
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
              <Text style={[s.emptyText, { color: C.gold }]}>Browse events →</Text>
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

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: C.bg },
  list:         { padding: 16, paddingTop: 0 },

  statsRow:     { flexDirection: 'row', gap: 8, padding: 16, backgroundColor: C.bg1, borderBottomWidth: 1, borderBottomColor: C.border },
  statCard:     { flex: 1, backgroundColor: C.bg2, borderRadius: 8, borderWidth: 1, borderColor: C.border, padding: 10, alignItems: 'center' },
  statValue:    { fontSize: 22, fontWeight: '700', color: C.text },
  statLabel:    { fontSize: 10, color: C.text4, marginTop: 2 },

  section:      { paddingVertical: 10, paddingTop: 16 },
  sectionLabel: { fontSize: 10, fontWeight: '600', color: C.text4, letterSpacing: 1 },

  card:         { backgroundColor: C.bg2, borderRadius: 9, borderWidth: 1, borderColor: C.border, padding: 13 },
  cardRow:      { flexDirection: 'row', alignItems: 'flex-start' },
  eventName:    { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 2 },
  storeName:    { fontSize: 11, color: C.text3, marginBottom: 2 },
  typeName:     { fontSize: 10, color: C.text4 },

  badge:        { borderRadius: 5, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start' },
  badgeText:    { fontSize: 10, fontWeight: '600' },

  empty:        { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 8 },
  emptyTitle:   { fontSize: 16, fontWeight: '600', color: C.text },
  emptyText:    { fontSize: 13, color: C.text3 },
  signInBtn:    { marginTop: 12, backgroundColor: `${C.gold}1a`, borderRadius: 8, borderWidth: 1, borderColor: `${C.gold}4d`, paddingHorizontal: 20, paddingVertical: 10 },
  signInBtnText:{ fontSize: 13, color: C.gold, fontWeight: '600' },
})
