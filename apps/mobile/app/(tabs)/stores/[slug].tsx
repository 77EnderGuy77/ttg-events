import { useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { getStoreBySlug, getEventsWithStore, getEventStats } from '@ttg/mock-data'
import { formatDate, formatLabel, gameLabel, calcFillPct } from '@ttg/utils'
import { C } from '@/constants/theme'

function CapacityBar({ filled, capacity }: { filled: number; capacity: number }) {
  const pct = calcFillPct(filled, capacity)
  const color = pct >= 100 ? C.red : pct >= 75 ? C.amber : C.gold
  return (
    <View style={s.barTrack}>
      <View style={[s.barFill, { width: `${Math.min(pct, 100)}%` as `${number}%`, backgroundColor: color }]} />
    </View>
  )
}

export default function StoreDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()

  const { store, upcoming, past } = useMemo(() => {
    const st = slug ? getStoreBySlug(slug) : null
    if (!st) return { store: null, upcoming: [], past: [] }
    const evs = getEventsWithStore({ storeId: st.id })
    return {
      store: st,
      upcoming: evs.filter(e => e.status !== 'completed' && e.status !== 'cancelled'),
      past: evs.filter(e => e.status === 'completed'),
    }
  }, [slug])

  if (!store) {
    return (
      <View style={s.center}>
        <Text style={s.notFoundText}>Store not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: C.gold, fontSize: 14 }}>← Go back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Store header */}
      <View style={s.header}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{store.name[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
            <Text style={s.storeName}>{store.name}</Text>
            <View style={s.tierBadge}>
              <Text style={s.tierText}>{store.tier.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={s.storeCity}>{store.city}, {store.country}</Text>
          <Text style={s.storeAddr}>{store.address}</Text>
          {store.website && <Text style={s.storeWeb} numberOfLines={1}>{store.website}</Text>}
        </View>
      </View>

      {/* Upcoming */}
      <Text style={s.section}>Upcoming Events</Text>
      {upcoming.length === 0 ? (
        <View style={s.card}>
          <Text style={s.empty}>No upcoming events</Text>
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          {upcoming.map(ev => {
            const stats = getEventStats(ev.id)
            const confirmed = stats?.confirmed ?? 0
            const full = confirmed >= ev.capacity
            return (
              <TouchableOpacity
                key={ev.id}
                style={[s.card, full && { borderColor: `${C.red}44` }]}
                onPress={() => router.push(`/events/${ev.id}`)}
                activeOpacity={0.75}
              >
                <View style={s.evRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={s.evName} numberOfLines={1}>{ev.name}</Text>
                    <Text style={s.evMeta}>{formatDate(ev.date)} · {ev.time}</Text>
                  </View>
                  <View style={s.fmtBadge}>
                    <Text style={s.fmtText}>{formatLabel(ev.format).toUpperCase()}</Text>
                  </View>
                </View>
                <View style={s.evFooter}>
                  <Text style={s.evInfo}>{gameLabel(ev.game)}</Text>
                  <Text style={s.evInfo}>{ev.entryFee > 0 ? `${ev.entryFee} ${ev.currency}` : 'Free'}</Text>
                </View>
                <CapacityBar filled={confirmed} capacity={ev.capacity} />
                <Text style={s.capText}>
                  {confirmed}/{ev.capacity} registered{full ? ' · FULL' : ''}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}

      {/* Past */}
      {past.length > 0 && (
        <>
          <Text style={[s.section, { marginTop: 20 }]}>Past Events</Text>
          <View style={{ gap: 6 }}>
            {past.map(ev => (
              <View key={ev.id} style={[s.card, { opacity: 0.55 }]}>
                <View style={s.evRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.evName}>{ev.name}</Text>
                    <Text style={s.evMeta}>{formatDate(ev.date)}</Text>
                  </View>
                  <View style={s.fmtBadge}>
                    <Text style={s.fmtText}>{formatLabel(ev.format).toUpperCase()}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: C.bg },
  content:      { padding: 16, gap: 12 },
  center:       { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 16, color: C.text },

  header:    { flexDirection: 'row', gap: 12, backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
  avatar:    { width: 48, height: 48, borderRadius: 8, backgroundColor: `${C.gold}1a`, borderWidth: 1, borderColor: `${C.gold}33`, alignItems: 'center', justifyContent: 'center' },
  avatarText:{ fontSize: 22, fontWeight: '700', color: C.gold },
  storeName: { fontSize: 16, fontWeight: '700', color: C.text },
  storeCity: { fontSize: 12, color: C.text3 },
  storeAddr: { fontSize: 11, color: C.text4, marginTop: 1 },
  storeWeb:  { fontSize: 11, color: C.gold, marginTop: 3 },
  tierBadge: { backgroundColor: `${C.gold}1a`, borderRadius: 4, borderWidth: 1, borderColor: `${C.gold}33`, paddingHorizontal: 6, paddingVertical: 2 },
  tierText:  { fontSize: 9, color: C.gold, fontWeight: '700' },

  section:   { fontSize: 15, fontWeight: '600', color: C.text, marginTop: 4 },
  card:      { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 13 },
  empty:     { fontSize: 13, color: C.text3, textAlign: 'center', paddingVertical: 8 },

  evRow:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  evName:    { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 2 },
  evMeta:    { fontSize: 11, color: C.text3 },
  evFooter:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  evInfo:    { fontSize: 11, color: C.text4 },
  fmtBadge:  { backgroundColor: `${C.gold}1a`, borderRadius: 4, borderWidth: 1, borderColor: `${C.gold}33`, paddingHorizontal: 5, paddingVertical: 2, alignSelf: 'flex-start' },
  fmtText:   { fontSize: 9, color: C.gold, fontWeight: '600' },
  barTrack:  { height: 3, backgroundColor: C.bg4, borderRadius: 2, overflow: 'hidden', marginBottom: 4 },
  barFill:   { height: 3, borderRadius: 2 },
  capText:   { fontSize: 10, color: C.text4 },
})
