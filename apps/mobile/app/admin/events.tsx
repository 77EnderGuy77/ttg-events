import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { useAuthStore } from '@/store/auth'
import { C } from '@/constants/theme'
import { getEventsWithStore, getConfirmedCount } from '@ttg/mock-data'
import { formatDate, calcFillPct } from '@ttg/utils'
import type { EventStatus } from '@ttg/types'

const STATUS_FILTERS: (EventStatus | 'all')[] = ['all', 'upcoming', 'active', 'completed', 'cancelled']

export default function AdminEvents() {
  const user = useAuthStore(s => s.user)
  const isSuperAdmin = user?.role === 'ttg-admin'
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const allEvents = getEventsWithStore()
  const storeEvents = isSuperAdmin ? allEvents : allEvents.filter(e => e.storeId === user?.storeId)

  const filtered = storeEvents.filter(ev => {
    if (statusFilter !== 'all' && ev.status !== statusFilter) return false
    if (search && !ev.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function statusColor(status: EventStatus) {
    if (status === 'active') return C.green
    if (status === 'upcoming') return '#5b9cf6'
    if (status === 'cancelled') return C.red
    return C.text4
  }

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
          return (
            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardName}>{ev.name}</Text>
                  {isSuperAdmin && <Text style={s.cardStore}>{ev.store.name}</Text>}
                </View>
                <View style={[s.statusBadge, { borderColor: statusColor(ev.status) + '66' }]}>
                  <Text style={[s.statusText, { color: statusColor(ev.status) }]}>
                    {ev.status}
                  </Text>
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
            </View>
          )
        }}
        ListEmptyComponent={<Text style={s.empty}>No events found.</Text>}
      />
    </View>
  )
}

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: C.bg },
  filterBar:     { padding: 12, paddingBottom: 0 },
  searchInput:   { backgroundColor: C.bg2, borderRadius: 8, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 13, padding: 10 },
  chips:         { flexDirection: 'row', gap: 6, paddingHorizontal: 12, paddingVertical: 10, flexWrap: 'wrap' },
  chip:          { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg2 },
  chipActive:    { backgroundColor: `${C.gold}1a`, borderColor: `${C.gold}4d` },
  chipText:      { fontSize: 11, color: C.text3, textTransform: 'capitalize' },
  chipTextActive:{ color: C.gold },
  list:          { padding: 12, gap: 10 },
  card:          { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
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
  empty:         { textAlign: 'center', color: C.text4, fontSize: 13, padding: 32 },
})
