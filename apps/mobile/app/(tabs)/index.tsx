import { useState, useMemo } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  ScrollView, StyleSheet, StatusBar,
} from 'react-native'
import { router } from 'expo-router'
import { getEventsWithStore } from '@ttg/mock-data'
import { formatDate, gameLabel, formatLabel, calcFillPct } from '@ttg/utils'
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

function CapacityBar({ filled, capacity }: { filled: number; capacity: number }) {
  const pct = calcFillPct(filled, capacity)
  const color = pct >= 100 ? C.red : pct >= 75 ? C.amber : C.gold
  return (
    <View style={s.barTrack}>
      <View style={[s.barFill, { width: `${Math.min(pct, 100)}%` as `${number}%`, backgroundColor: color }]} />
    </View>
  )
}

function FormatBadge({ label }: { label: string }) {
  return (
    <View style={s.badge}>
      <Text style={s.badgeText}>{label.toUpperCase()}</Text>
    </View>
  )
}

function EventCard({ event }: { event: EventWithStore }) {
  const filled = event.capacity - 4
  const full = filled >= event.capacity

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
        <FormatBadge label={formatLabel(event.format)} />
      </View>

      <View style={s.cardMeta}>
        <Text style={s.cardMetaText}>{formatDate(event.date)} · {event.time}</Text>
        <Text style={s.cardMetaText}>
          {event.entryFee > 0 ? `${event.entryFee} ${event.currency}` : 'Free'}
        </Text>
      </View>

      <CapacityBar filled={filled} capacity={event.capacity} />

      <View style={s.cardFooter}>
        <Text style={s.cardFooterText}>
          {filled}/{event.capacity} registered
          {full && ' · FULL'}
        </Text>
        {event.status === 'active' && (
          <View style={s.liveDot}>
            <Text style={s.liveText}>LIVE</Text>
          </View>
        )}
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

      {/* Game filter chips */}
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

      {/* Events list */}
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
  screen:        { flex: 1, backgroundColor: C.bg },
  filtersWrap:   { backgroundColor: C.bg1, borderBottomWidth: 1, borderBottomColor: C.border },
  filters:       { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  chip:          { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg2 },
  chipActive:    { backgroundColor: `${C.gold}1a`, borderColor: `${C.gold}4d` },
  chipText:      { fontSize: 12, color: C.text3, fontWeight: '500' },
  chipTextActive:{ color: C.gold },

  list:          { padding: 16 },
  empty:         { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle:    { fontSize: 16, color: C.text, fontWeight: '600', marginBottom: 4 },
  emptyText:     { fontSize: 13, color: C.text3 },

  card:          { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
  cardFull:      { borderColor: `${C.red}66` },
  cardHeader:    { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle:     { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 2 },
  cardSub:       { fontSize: 11, color: C.text3 },

  badge:         { backgroundColor: `${C.gold}1a`, borderRadius: 4, borderWidth: 1, borderColor: `${C.gold}33`, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText:     { fontSize: 9, color: C.gold, fontWeight: '600', letterSpacing: 0.5 },

  cardMeta:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardMetaText:  { fontSize: 11, color: C.text4 },

  barTrack:      { height: 3, backgroundColor: C.bg4, borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  barFill:       { height: 3, borderRadius: 2 },

  cardFooter:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardFooterText:{ fontSize: 10, color: C.text4 },
  liveDot:       { backgroundColor: `${C.green}1a`, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  liveText:      { fontSize: 9, color: C.green, fontWeight: '700' },
})
