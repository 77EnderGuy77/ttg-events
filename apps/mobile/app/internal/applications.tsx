import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { C } from '@/constants/theme'
import { STORE_APPLICATIONS } from '@ttg/mock-data'
import { relativeTime } from '@ttg/utils'
import type { ApplicationStatus, StoreApplication } from '@ttg/types'

export default function InternalApplications() {
  const [overrides, setOverrides] = useState<Record<string, ApplicationStatus>>({})
  const [filter, setFilter] = useState<'pending' | 'all'>('pending')

  function effectiveStatus(app: StoreApplication): ApplicationStatus {
    return overrides[app.id] ?? app.status
  }
  function decide(id: string, decision: 'approved' | 'rejected') {
    setOverrides(prev => ({ ...prev, [id]: decision }))
  }

  const apps = STORE_APPLICATIONS.map(a => ({ ...a, status: effectiveStatus(a) }))
  const filtered = filter === 'pending' ? apps.filter(a => a.status === 'pending') : apps
  const pendingCount = apps.filter(a => a.status === 'pending').length

  function statusColor(s: ApplicationStatus) {
    if (s === 'pending') return C.amber
    if (s === 'approved') return C.green
    return C.red
  }

  return (
    <View style={s.screen}>
      <View style={s.tabs}>
        {(['pending', 'all'] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[s.tab, filter === t && s.tabActive]}
            onPress={() => setFilter(t)}
            activeOpacity={0.75}
          >
            <Text style={[s.tabText, filter === t && s.tabTextActive]}>
              {t === 'pending' ? `Pending (${pendingCount})` : 'All'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={a => a.id}
        contentContainerStyle={s.list}
        renderItem={({ item: app }) => (
          <View style={s.card}>
            <View style={s.cardHead}>
              <View style={{ flex: 1 }}>
                <Text style={s.storeName}>{app.storeName}</Text>
                <Text style={s.meta}>{app.city}, {app.country}</Text>
                <Text style={s.meta}>{app.contactName} · {app.contactEmail}</Text>
                <Text style={s.time}>Submitted {relativeTime(app.submittedAt)}</Text>
              </View>
              <View style={[s.badge, { borderColor: statusColor(app.status) + '55' }]}>
                <Text style={[s.badgeText, { color: statusColor(app.status) }]}>{app.status}</Text>
              </View>
            </View>
            {app.wpn && (
              <Text style={s.wpn}>✓ WPN Member</Text>
            )}
            {app.status === 'pending' && (
              <View style={s.actions}>
                <TouchableOpacity style={[s.btn, s.approveBtn]} onPress={() => decide(app.id, 'approved')} activeOpacity={0.8}>
                  <Text style={[s.btnText, { color: C.green }]}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btn, s.rejectBtn]} onPress={() => decide(app.id, 'rejected')} activeOpacity={0.8}>
                  <Text style={[s.btnText, { color: C.red }]}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>No {filter === 'pending' ? 'pending ' : ''}applications.</Text>}
      />
    </View>
  )
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: C.bg },
  tabs:         { flexDirection: 'row', gap: 8, padding: 12 },
  tab:          { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg2 },
  tabActive:    { backgroundColor: `${C.purple}1a`, borderColor: `${C.purple}4d` },
  tabText:      { fontSize: 12, color: C.text3 },
  tabTextActive:{ color: C.purple },
  list:         { padding: 12, paddingTop: 0, gap: 10 },
  card:         { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
  cardHead:     { flexDirection: 'row', gap: 10, marginBottom: 8 },
  storeName:    { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 3 },
  meta:         { fontSize: 11, color: C.text3 },
  time:         { fontSize: 11, color: C.text4, marginTop: 3 },
  badge:        { borderRadius: 4, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start' },
  badgeText:    { fontSize: 10, fontWeight: '500', textTransform: 'capitalize' },
  wpn:          { fontSize: 11, color: C.gold, marginBottom: 8 },
  actions:      { flexDirection: 'row', gap: 8 },
  btn:          { flex: 1, borderRadius: 7, borderWidth: 1, paddingVertical: 8, alignItems: 'center' },
  approveBtn:   { borderColor: `${C.green}55`, backgroundColor: `${C.green}0d` },
  rejectBtn:    { borderColor: `${C.red}55`, backgroundColor: `${C.red}0d` },
  btnText:      { fontSize: 13, fontWeight: '500' },
  empty:        { textAlign: 'center', color: C.text4, fontSize: 13, padding: 32 },
})
