import { useState, useMemo } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  ScrollView, StyleSheet, StatusBar,
} from 'react-native'
import { router } from 'expo-router'
import { getEventsWithStore, getConfirmedCount } from '@ttg/mock-data'
import { formatDate, getEventBadge } from '@ttg/utils'
import type { GameType, EventWithStore } from '@ttg/types'
import { C } from '@/constants/theme'

const GAME_FILTERS: Array<{ label: string; value: GameType | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'MTG', value: 'mtg' },
  { label: 'Pokémon', value: 'pokemon' },
  { label: 'Lorcana', value: 'lorcana' },
  { label: 'One Piece', value: 'one-piece' },
  { label: 'Yu-Gi-Oh!', value: 'yugioh' },
  { label: 'FAB', value: 'fab' },
]

function CapacityBar({ confirmed, capacity }: { confirmed: number; capacity: number }) {
  const pct = capacity > 0 ? Math.round((confirmed / capacity) * 100) : 0
  const color = pct >= 100 ? C.red : pct >= 75 ? C.amber : C.gold
  return (
    <View style={s.barTrack}>
      <View style={[s.barFill, { width: `${Math.min(pct, 100)}%` as `${number}%`, backgroundColor: color }]} />
    </View>
  )
}

function EventCard({ event }: { event: EventWithStore }) {
  const confirmed = getConfirmedCount(event.id)
  const spotsLeft = event.capacity - confirmed
  const full = spotsLeft <= 0
  const badge = getEventBadge(event.format, event.type)
  const feeStr = event.entryFee > 0 ? `${event.entryFee} ${event.currency}` : 'Free'

  return (
    <TouchableOpacity
      style={[s.card, full && s.cardFull]}
      onPress={() => router.push(`/events/${event.id}`)}
      activeOpacity={0.75}
    >
      <View style={s.cardHeader}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={s.cardTitle} numberOfLines={1}>{event.name}</Text>
          <Text style={s.cardSub}>{event.store.name} · {event.store.city}</Text>
        </View>
        {badge && (
          <View style={s.badge}>
            <Text style={s.badgeText}>{badge.label.toUpperCase()}</Text>
          </View>
        )}
      </View>

      <View style={s.cardMeta}>
        <Text style={s.cardMetaText}>📅 {formatDate(event.date)} · {event.time}</Text>
        <Text style={s.cardMetaText}>👥 {confirmed} / {event.capacity}</Text>
      </View>

      <CapacityBar confirmed={confirmed} capacity={event.capacity} />

      <View style={s.cardFooter}>
        <Text style={[
          s.spotsText,
          full ? s.spotsTextFull : spotsLeft <= 3 ? s.spotsTextWarn : null,
        ]}>
          {full
            ? 'Event is full'
            : spotsLeft <= 3
            ? `⚠ Only ${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`
            : `${spotsLeft} spots available`}
        </Text>
        <View style={s.actionRow}>
          {event.status === 'active' && (
            <View style={s.liveDot}><Text style={s.liveText}>LIVE</Text></View>
          )}
          <Text style={s.feeText}>{feeStr}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function DiscoverScreen() {
  const [gameFilter, setGameFilter] = useState<GameType | 'all'>('all')

  const events = useMemo(() => {
    const all = getEventsWithStore({ status: 'upcoming' })
    const active = getEventsWithStore({ status: 'active' })
    const combined = [...active, ...all]
    if (gameFilter === 'all') return combined
    return combined.filter(e => e.game === gameFilter)
  }, [gameFilter])

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg1} />

      <View style={s.filtersWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
          {GAME_FILTERS.map(f => {
            const active = gameFilter === f.value
            return (
              <TouchableOpacity
                key={f.value}
                style={[s.chip, active && s.chipActive]}
                onPress={() => setGameFilter(f.value)}
                activeOpacity={0.7}
              >
                <Text style={[s.chipText, active && s.chipTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {events.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyTitle}>No events found</Text>
          <Text style={s.emptyText}>Try a different game filter</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <EventCard event={item} />}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  )
}

const s = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: C.bg },
  filtersWrap:    { backgroundColor: C.bg1, borderBottomWidth: 1, borderBottomColor: C.border },
  filters:        { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  chip:           { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg2 },
  chipActive:     { backgroundColor: `${C.gold}1a`, borderColor: `${C.gold}4d` },
  chipText:       { fontSize: 12, color: C.text3, fontWeight: '500' },
  chipTextActive: { color: C.gold },

  list:           { padding: 16 },
  empty:          { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle:     { fontSize: 16, color: C.text, fontWeight: '600', marginBottom: 4 },
  emptyText:      { fontSize: 13, color: C.text3 },

  card:           { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
  cardFull:       { borderColor: `${C.red}66` },
  cardHeader:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle:      { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 2 },
  cardSub:        { fontSize: 11, color: C.text3 },

  badge:          { backgroundColor: `${C.gold}1a`, borderRadius: 4, borderWidth: 1, borderColor: `${C.gold}33`, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText:      { fontSize: 9, color: C.gold, fontWeight: '600', letterSpacing: 0.5 },

  cardMeta:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardMetaText:   { fontSize: 11, color: C.text3 },

  barTrack:       { height: 3, backgroundColor: C.bg4, borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  barFill:        { height: 3, borderRadius: 2 },

  cardFooter:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spotsText:      { fontSize: 10, color: C.text4 },
  spotsTextFull:  { color: C.red },
  spotsTextWarn:  { color: C.amber },

  actionRow:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot:        { backgroundColor: `${C.green}1a`, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  liveText:       { fontSize: 9, color: C.green, fontWeight: '700' },
  feeText:        { fontSize: 10, color: C.text4 },
})
