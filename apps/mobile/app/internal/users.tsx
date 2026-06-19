import { useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { C } from '@/constants/theme'
import { USERS } from '@ttg/mock-data'
import { getInitials, formatIsoDate } from '@ttg/utils'
import type { UserRole } from '@ttg/types'

const ROLES: (UserRole | 'all')[] = ['all', 'player', 'store-admin', 'ttg-admin']

export default function InternalUsers() {
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = USERS.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function roleColor(r: UserRole) {
    if (r === 'ttg-admin') return C.gold
    if (r === 'store-admin') return C.purple
    return C.text3
  }
  function roleLabel(r: UserRole) {
    if (r === 'ttg-admin') return 'TTG Admin'
    if (r === 'store-admin') return 'Store Admin'
    return 'Player'
  }

  return (
    <View style={s.screen}>
      <View style={s.searchWrap}>
        <TextInput
          style={s.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or email…"
          placeholderTextColor={C.text4}
        />
      </View>
      <View style={s.chips}>
        {ROLES.map(r => (
          <TouchableOpacity
            key={r}
            style={[s.chip, roleFilter === r && s.chipActive]}
            onPress={() => setRoleFilter(r)}
            activeOpacity={0.75}
          >
            <Text style={[s.chipText, roleFilter === r && s.chipTextActive]}>
              {r === 'all' ? 'All' : r.replace('-', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={u => u.id}
        contentContainerStyle={s.list}
        renderItem={({ item: u }) => (
          <View style={s.card}>
            <View style={s.avatarWrap}>
              <Text style={s.avatarText}>{getInitials(u.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{u.name}</Text>
              <Text style={s.email}>{u.email}</Text>
              <Text style={s.since}>Since {formatIsoDate(u.createdAt)}</Text>
            </View>
            <View style={[s.roleBadge, { borderColor: roleColor(u.role) + '55' }]}>
              <Text style={[s.roleText, { color: roleColor(u.role) }]}>{roleLabel(u.role)}</Text>
            </View>
          </View>
        )}
        ListHeaderComponent={<Text style={s.header}>{filtered.length} users</Text>}
        ListEmptyComponent={<Text style={s.empty}>No users found.</Text>}
      />
    </View>
  )
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: C.bg },
  searchWrap:   { padding: 12, paddingBottom: 0 },
  input:        { backgroundColor: C.bg2, borderRadius: 8, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 13, padding: 10 },
  chips:        { flexDirection: 'row', gap: 6, padding: 10, paddingHorizontal: 12, flexWrap: 'wrap' },
  chip:         { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg2 },
  chipActive:   { backgroundColor: `${C.purple}1a`, borderColor: `${C.purple}4d` },
  chipText:     { fontSize: 11, color: C.text3, textTransform: 'capitalize' },
  chipTextActive:{ color: C.purple },
  list:         { padding: 12, paddingTop: 4, gap: 8 },
  header:       { fontSize: 12, color: C.text4, marginBottom: 4 },
  card:         { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap:   { width: 36, height: 36, borderRadius: 18, backgroundColor: C.bg3, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  avatarText:   { fontSize: 13, fontWeight: '600', color: C.text3 },
  name:         { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 2 },
  email:        { fontSize: 11, color: C.text3, marginBottom: 1 },
  since:        { fontSize: 10, color: C.text4 },
  roleBadge:    { borderRadius: 4, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start' },
  roleText:     { fontSize: 10, fontWeight: '500' },
  empty:        { textAlign: 'center', color: C.text4, fontSize: 13, padding: 32 },
})
