import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useAuthStore } from '@/store/auth'
import { C } from '@/constants/theme'
import { STORES, SUBSCRIPTIONS, EVENTS } from '@ttg/mock-data'

export default function AdminStores() {
  const user = useAuthStore(s => s.user)
  if (user?.role !== 'ttg-admin') return null

  function tierColor(tier: string) {
    if (tier === 'pro') return C.gold
    if (tier === 'basic') return C.purple
    return C.text4
  }

  return (
    <FlatList
      data={STORES}
      keyExtractor={s => s.id}
      contentContainerStyle={s.list}
      renderItem={({ item: store }) => {
        const sub = SUBSCRIPTIONS.find(sub => sub.storeId === store.id)
        const eventCount = EVENTS.filter(e => e.storeId === store.id && (e.status === 'upcoming' || e.status === 'active')).length
        return (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.storeName}>{store.name}</Text>
                <Text style={s.storeCity}>{store.city}, {store.country}</Text>
              </View>
              <View style={[s.tierBadge, { borderColor: tierColor(store.tier) + '55' }]}>
                <Text style={[s.tierText, { color: tierColor(store.tier) }]}>
                  {store.tier.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={s.row}>
              <Text style={s.meta}>{eventCount} active events</Text>
              <Text style={[s.meta, { color: sub ? C.green : C.text4 }]}>
                {sub ? 'subscribed' : 'free'}
              </Text>
            </View>
          </View>
        )
      }}
      ListHeaderComponent={
        <Text style={s.header}>{STORES.length} stores</Text>
      }
    />
  )
}

const s = StyleSheet.create({
  list:       { padding: 12, gap: 10 },
  header:     { fontSize: 12, color: C.text4, marginBottom: 8 },
  card:       { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  storeName:  { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 2 },
  storeCity:  { fontSize: 12, color: C.text3 },
  tierBadge:  { borderRadius: 4, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 2 },
  tierText:   { fontSize: 10, fontWeight: '600' },
  row:        { flexDirection: 'row', justifyContent: 'space-between' },
  meta:       { fontSize: 12, color: C.text3 },
})
