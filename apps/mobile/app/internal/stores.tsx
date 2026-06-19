import { useState } from 'react'
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native'
import { C } from '@/constants/theme'
import { STORES, SUBSCRIPTIONS } from '@ttg/mock-data'

export default function InternalStores() {
  const [search, setSearch] = useState('')

  const filtered = STORES.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase())
  )

  function tierColor(tier: string) {
    if (tier === 'pro') return C.gold
    if (tier === 'basic') return C.purple
    return C.text4
  }

  return (
    <View style={s.screen}>
      <View style={s.searchWrap}>
        <TextInput
          style={s.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Search stores…"
          placeholderTextColor={C.text4}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={s => s.id}
        contentContainerStyle={s.list}
        renderItem={({ item: store }) => {
          const sub = SUBSCRIPTIONS.find(sub => sub.storeId === store.id)
          return (
            <View style={s.card}>
              <View style={s.row}>
                <View style={{ flex: 1 }}>
                  <Text style={s.name}>{store.name}</Text>
                  <Text style={s.city}>{store.city}, {store.country}</Text>
                </View>
                <View style={[s.badge, { borderColor: tierColor(store.tier) + '55' }]}>
                  <Text style={[s.badgeText, { color: tierColor(store.tier) }]}>{store.tier.toUpperCase()}</Text>
                </View>
              </View>
              <View style={s.meta}>
                <Text style={s.metaText}>
                  {store.adminIds.length} admins · {store.status}
                </Text>
                <Text style={[s.metaText, { color: sub ? C.green : C.text4 }]}>
                  {sub ? `${sub.billingCycle} billing` : 'free'}
                </Text>
              </View>
            </View>
          )
        }}
        ListHeaderComponent={
          <Text style={s.header}>{filtered.length} stores</Text>
        }
      />
    </View>
  )
}

const s = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: C.bg },
  searchWrap:{ padding: 12, paddingBottom: 8 },
  input:     { backgroundColor: C.bg2, borderRadius: 8, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 13, padding: 10 },
  list:      { padding: 12, paddingTop: 4, gap: 10 },
  header:    { fontSize: 12, color: C.text4, marginBottom: 8 },
  card:      { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
  row:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  name:      { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 2 },
  city:      { fontSize: 12, color: C.text3 },
  badge:     { borderRadius: 4, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 2, alignSelf: 'flex-start' },
  badgeText: { fontSize: 10, fontWeight: '600' },
  meta:      { flexDirection: 'row', justifyContent: 'space-between' },
  metaText:  { fontSize: 12, color: C.text3 },
})
