import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { C } from '@/constants/theme'
import { STORES, STORE_APPLICATIONS, SUBSCRIPTIONS, getEventsWithStore } from '@ttg/mock-data'
import { formatCurrency } from '@ttg/utils'

export default function InternalOverview() {
  const allEvents = getEventsWithStore()
  const activeStores = STORES.filter(s => s.status === 'active').length
  const upcomingEvents = allEvents.filter(e => e.status === 'upcoming' || e.status === 'active').length
  const pendingApps = STORE_APPLICATIONS.filter(a => a.status === 'pending').length
  const mrr = SUBSCRIPTIONS
    .filter(s => s.status === 'active' && s.billingCycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0)

  const NAV = [
    { label: 'Applications', icon: '📋', route: '/internal/applications', badge: pendingApps },
    { label: 'Stores', icon: '🏪', route: '/internal/stores' },
    { label: 'Users', icon: '👥', route: '/internal/users' },
    { label: 'Subscriptions', icon: '💳', route: '/internal/subscriptions' },
  ]

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <View style={s.statsGrid}>
        {[
          { label: 'Active Stores', value: activeStores },
          { label: 'Upcoming Events', value: upcomingEvents },
          { label: 'Pending Apps', value: pendingApps, color: C.amber },
          { label: 'MRR', value: formatCurrency(mrr, 'EUR'), color: C.green },
        ].map(stat => (
          <View key={stat.label} style={s.statCard}>
            <Text style={[s.statValue, stat.color ? { color: stat.color } : {}]}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={s.section}>
        <Text style={s.sectionLabel}>NAVIGATE</Text>
        {NAV.map(item => (
          <TouchableOpacity
            key={item.route}
            style={s.navRow}
            onPress={() => router.push(item.route as never)}
            activeOpacity={0.75}
          >
            <Text style={s.navIcon}>{item.icon}</Text>
            <Text style={s.navLabel}>{item.label}</Text>
            {item.badge != null && item.badge > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{item.badge}</Text>
              </View>
            )}
            <Text style={s.navArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.section}>
        <Text style={s.sectionLabel}>SUBSCRIPTIONS</Text>
        {(['pro', 'basic', 'free'] as const).map(tier => {
          const subs = SUBSCRIPTIONS.filter(s => s.tier === tier && s.status === 'active')
          const tierMrr = subs.filter(s => s.billingCycle === 'monthly').reduce((n, s) => n + s.amount, 0)
          const color = tier === 'pro' ? C.gold : tier === 'basic' ? C.purple : C.text4
          return (
            <View key={tier} style={s.tierRow}>
              <View style={[s.tierPill, { borderColor: color + '55' }]}>
                <Text style={[s.tierText, { color }]}>{tier.toUpperCase()}</Text>
              </View>
              <Text style={s.tierStores}>{subs.length} stores</Text>
              <Text style={s.tierMrr}>{tierMrr > 0 ? formatCurrency(tierMrr, 'EUR') + '/mo' : '—'}</Text>
            </View>
          )
        })}
        <View style={s.mrrTotal}>
          <Text style={s.mrrLabel}>Total MRR</Text>
          <Text style={s.mrrValue}>{formatCurrency(mrr, 'EUR')}</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: C.bg },
  content:      { padding: 16, gap: 12 },
  statsGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard:     { width: '47%', backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
  statValue:    { fontSize: 22, fontWeight: '700', color: C.text, marginBottom: 2 },
  statLabel:    { fontSize: 11, color: C.text3 },
  section:      { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
  sectionLabel: { fontSize: 10, fontWeight: '600', color: C.text4, letterSpacing: 0.8, marginBottom: 10 },
  navRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.border },
  navIcon:      { fontSize: 16, marginRight: 10 },
  navLabel:     { flex: 1, fontSize: 14, color: C.text },
  navArrow:     { fontSize: 18, color: C.text4 },
  badge:        { backgroundColor: `${C.amber}33`, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, marginRight: 8 },
  badgeText:    { fontSize: 11, color: C.amber, fontWeight: '600' },
  tierRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  tierPill:     { borderRadius: 4, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 2 },
  tierText:     { fontSize: 10, fontWeight: '600' },
  tierStores:   { flex: 1, fontSize: 12, color: C.text3 },
  tierMrr:      { fontSize: 12, color: C.text, fontWeight: '500' },
  mrrTotal:     { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginTop: 4 },
  mrrLabel:     { fontSize: 13, fontWeight: '600', color: C.text },
  mrrValue:     { fontSize: 14, fontWeight: '700', color: C.green },
})
