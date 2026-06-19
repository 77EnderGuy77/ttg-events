import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/auth'
import { C } from '@/constants/theme'
import { EVENTS, STORE_APPLICATIONS, getEventsWithStore } from '@ttg/mock-data'
import { getConfirmedCount } from '@ttg/mock-data'
import { formatDate } from '@ttg/utils'

export default function AdminDashboard() {
  const user = useAuthStore(s => s.user)
  const isSuperAdmin = user?.role === 'ttg-admin'

  const allEvents = getEventsWithStore()
  const storeEvents = isSuperAdmin ? allEvents : allEvents.filter(e => e.storeId === user?.storeId)
  const upcoming = storeEvents.filter(e => e.status === 'upcoming' || e.status === 'active')
  const pendingCount = STORE_APPLICATIONS.filter(a => a.status === 'pending').length
  const totalReg = upcoming.reduce((sum, e) => sum + getConfirmedCount(e.id), 0)

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      {isSuperAdmin && pendingCount > 0 && (
        <TouchableOpacity
          style={s.banner}
          onPress={() => router.push('/admin/store-requests')}
          activeOpacity={0.8}
        >
          <Text style={s.bannerText}>⚠ {pendingCount} pending store request{pendingCount !== 1 ? 's' : ''}</Text>
          <Text style={s.bannerLink}>Review →</Text>
        </TouchableOpacity>
      )}

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={[s.statValue, { color: C.gold }]}>{upcoming.length}</Text>
          <Text style={s.statLabel}>Upcoming</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statValue}>{totalReg}</Text>
          <Text style={s.statLabel}>Registered</Text>
        </View>
        {isSuperAdmin && (
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: C.amber }]}>{pendingCount}</Text>
            <Text style={s.statLabel}>Pending</Text>
          </View>
        )}
      </View>

      {/* Quick nav */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>MANAGE</Text>
        {[
          { label: 'Events', icon: '🗓', route: '/admin/events' },
          ...(isSuperAdmin ? [
            { label: 'Stores', icon: '🏪', route: '/admin/stores' },
            { label: 'Store Requests', icon: '📋', route: '/admin/store-requests', badge: pendingCount },
          ] : []),
        ].map(item => (
          <TouchableOpacity
            key={item.route}
            style={s.navRow}
            onPress={() => router.push(item.route as never)}
            activeOpacity={0.75}
          >
            <Text style={s.navIcon}>{item.icon}</Text>
            <Text style={s.navLabel}>{item.label}</Text>
            {item.badge != null && item.badge > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{item.badge}</Text>
              </View>
            )}
            <Text style={s.navArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming events */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>UPCOMING EVENTS</Text>
        {upcoming.slice(0, 5).map(ev => {
          const reg = getConfirmedCount(ev.id)
          return (
            <View key={ev.id} style={s.eventRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.eventName}>{ev.name}</Text>
                {isSuperAdmin && <Text style={s.eventStore}>{ev.store.name}</Text>}
                <Text style={s.eventDate}>{formatDate(ev.date)}</Text>
              </View>
              <Text style={s.eventReg}>{reg}/{ev.capacity}</Text>
            </View>
          )
        })}
        {upcoming.length === 0 && (
          <Text style={s.empty}>No upcoming events.</Text>
        )}
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: C.bg },
  content:      { padding: 16, gap: 12 },

  banner:       { backgroundColor: `${C.gold}0d`, borderRadius: 8, borderWidth: 1, borderColor: `${C.gold}33`, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerText:   { fontSize: 13, color: C.gold },
  bannerLink:   { fontSize: 12, color: C.gold },

  statsRow:     { flexDirection: 'row', gap: 10 },
  statCard:     { flex: 1, backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14, alignItems: 'center' },
  statValue:    { fontSize: 24, fontWeight: '700', color: C.text },
  statLabel:    { fontSize: 11, color: C.text3, marginTop: 2 },

  section:      { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
  sectionLabel: { fontSize: 10, fontWeight: '600', color: C.text4, letterSpacing: 0.8, marginBottom: 10 },

  navRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.border },
  navIcon:      { fontSize: 16, marginRight: 10 },
  navLabel:     { flex: 1, fontSize: 14, color: C.text },
  navArrow:     { fontSize: 18, color: C.text4 },
  badge:        { backgroundColor: `${C.amber}33`, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, marginRight: 8 },
  badgeText:    { fontSize: 11, color: C.amber, fontWeight: '600' },

  eventRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  eventName:    { fontSize: 13, fontWeight: '500', color: C.text, marginBottom: 1 },
  eventStore:   { fontSize: 11, color: C.text4, marginBottom: 1 },
  eventDate:    { fontSize: 11, color: C.text3 },
  eventReg:     { fontSize: 13, color: C.text3 },

  empty:        { fontSize: 13, color: C.text4, textAlign: 'center', paddingVertical: 16 },
})
