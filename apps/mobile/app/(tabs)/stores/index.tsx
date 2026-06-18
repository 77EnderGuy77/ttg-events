import { useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { getStores } from '@ttg/mock-data'
import type { Store } from '@ttg/types'
import { C } from '@/constants/theme'

function tierColor(tier: Store['tier']): string {
  if (tier === 'pro') return C.purple
  if (tier === 'basic') return '#60a5fa'
  return C.text4
}

export default function StoresScreen() {
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('')

  const stores = getStores().filter(s => s.status === 'active')
  const cities = [...new Set(stores.map(s => s.city))].sort()

  const filtered = stores.filter(s => {
    const matchCity = !cityFilter || s.city === cityFilter
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase())
    return matchCity && matchSearch
  })

  return (
    <View style={s.screen}>
      <View style={s.filterBar}>
        <TextInput
          style={s.input}
          placeholder="Search stores…"
          placeholderTextColor={C.text4}
          value={search}
          onChangeText={setSearch}
        />
        <View style={s.chips}>
          {(['', ...cities] as string[]).map(city => {
            const active = city === cityFilter
            return (
              <TouchableOpacity
                key={city || '__all'}
                style={[s.chip, active && s.chipActive]}
                onPress={() => setCityFilter(city)}
                activeOpacity={0.7}
              >
                <Text style={[s.chipText, active && s.chipTextActive]}>{city || 'All'}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <Text style={s.count}>{filtered.length} store{filtered.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            onPress={() => router.push(`/(tabs)/stores/${item.slug}`)}
            activeOpacity={0.75}
          >
            <View style={s.cardRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.city}>{item.city}, {item.country}</Text>
              </View>
              <Text style={[s.tier, { color: tierColor(item.tier) }]}>
                {item.tier.toUpperCase()}
              </Text>
            </View>
            <Text style={s.address} numberOfLines={1}>{item.address}</Text>
            {item.website && (
              <Text style={s.website} numberOfLines={1}>{item.website}</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: C.bg },
  filterBar:     { backgroundColor: C.bg1, borderBottomWidth: 1, borderBottomColor: C.border, padding: 12, gap: 8 },
  input:         { backgroundColor: C.bg3, borderRadius: 8, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 13, paddingHorizontal: 12, paddingVertical: 8 },
  chips:         { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip:          { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg2 },
  chipActive:    { backgroundColor: `${C.gold}1a`, borderColor: `${C.gold}4d` },
  chipText:      { fontSize: 12, color: C.text3, fontWeight: '500' },
  chipTextActive:{ color: C.gold },
  count:         { fontSize: 11, color: C.text4 },
  list:          { padding: 12, paddingBottom: 24 },
  card:          { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
  cardRow:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  name:          { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 2 },
  city:          { fontSize: 12, color: C.text3 },
  tier:          { fontSize: 11, fontWeight: '600' },
  address:       { fontSize: 11, color: C.text4 },
  website:       { fontSize: 11, color: C.gold, marginTop: 3 },
})
