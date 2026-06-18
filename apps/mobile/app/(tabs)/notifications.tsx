import { View, Text, FlatList, StyleSheet } from 'react-native'
import { ANNOUNCEMENTS, getEventsWithStore } from '@ttg/mock-data'
import { relativeTime } from '@ttg/utils'
import { C } from '@/constants/theme'
import { useMemo } from 'react'

type AnnType = 'reminder' | 'capacity' | 'schedule' | 'general'

const TYPE_COLOR: Record<AnnType, string> = {
  reminder: C.gold, capacity: C.green, schedule: C.amber, general: C.text3,
}
const TYPE_ICON: Record<AnnType, string> = {
  reminder: '🔔', capacity: '📊', schedule: '📅', general: '📢',
}

export default function UpdatesScreen() {
  const eventsMap = useMemo(() => {
    const map: Record<string, string> = {}
    getEventsWithStore().forEach(e => { map[e.id] = e.name })
    return map
  }, [])

  const sorted = [...ANNOUNCEMENTS].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  )

  return (
    <View style={s.screen}>
      <FlatList
        data={sorted}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const type = item.type as AnnType
          const color = TYPE_COLOR[type] ?? C.text3
          const icon = TYPE_ICON[type] ?? '📢'
          const openRate = Math.round(item.openCount / item.sentCount * 100)
          return (
            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={[s.iconWrap, { backgroundColor: `${color}1a` }]}>
                  <Text style={s.iconText}>{icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.title}>{item.title}</Text>
                  <Text style={s.meta}>{eventsMap[item.eventId] ?? item.eventId} · {relativeTime(item.sentAt)}</Text>
                </View>
              </View>
              <Text style={s.body} numberOfLines={3}>{item.body}</Text>
              <View style={s.footer}>
                <Text style={s.footerText}>Sent to {item.sentCount} players</Text>
                <View style={s.pill}>
                  <Text style={s.pillText}>Opened {openRate}%</Text>
                </View>
              </View>
            </View>
          )
        }}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={
          <View style={s.listHeader}>
            <Text style={s.listHeaderTitle}>Store Announcements</Text>
            <Text style={s.listHeaderSub}>{sorted.length} recent updates</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyText}>No announcements yet</Text>
          </View>
        }
      />
    </View>
  )
}

const s = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: C.bg },
  list:            { padding: 16 },
  listHeader:      { marginBottom: 16 },
  listHeaderTitle: { fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 2 },
  listHeaderSub:   { fontSize: 12, color: C.text3 },
  card:            { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
  cardHeader:      { flexDirection: 'row', gap: 10, marginBottom: 10 },
  iconWrap:        { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  iconText:        { fontSize: 18 },
  title:           { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 2 },
  meta:            { fontSize: 11, color: C.text3 },
  body:            { fontSize: 12, color: C.text2, lineHeight: 18, marginBottom: 10 },
  footer:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerText:      { fontSize: 11, color: C.text4 },
  pill:            { backgroundColor: C.bg3, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  pillText:        { fontSize: 10, color: C.text4 },
  empty:           { alignItems: 'center', paddingTop: 80 },
  emptyText:       { fontSize: 14, color: C.text3 },
})
