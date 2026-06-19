import { View, Text, FlatList, StyleSheet } from 'react-native'
import { C } from '@/constants/theme'
import { SUBSCRIPTIONS, STORES } from '@ttg/mock-data'
import { formatCurrency, formatIsoDate } from '@ttg/utils'
import type { PlanTier } from '@ttg/types'

function tierColor(t: PlanTier) {
  if (t === 'pro') return C.gold
  if (t === 'basic') return C.purple
  return C.text4
}

export default function InternalSubscriptions() {
  const active = SUBSCRIPTIONS.filter(s => s.status === 'active')
  const mrr = active.filter(s => s.billingCycle === 'monthly').reduce((n, s) => n + s.amount, 0)
  const arr = active.reduce((n, s) => n + (s.billingCycle === 'monthly' ? s.amount * 12 : s.amount), 0)

  function storeName(id: string) {
    return STORES.find(s => s.id === id)?.name ?? id
  }

  return (
    <FlatList
      data={SUBSCRIPTIONS}
      keyExtractor={s => s.id}
      contentContainerStyle={s.list}
      ListHeaderComponent={() => (
        <View>
          <View style={s.statsRow}>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: C.green }]}>{formatCurrency(mrr, 'EUR')}</Text>
              <Text style={s.statLabel}>MRR</Text>
            </View>
            <View style={s.statCard}>
              <Text style={s.statValue}>{formatCurrency(arr, 'EUR')}</Text>
              <Text style={s.statLabel}>ARR</Text>
            </View>
            <View style={s.statCard}>
              <Text style={s.statValue}>{active.length}</Text>
              <Text style={s.statLabel}>Active</Text>
            </View>
          </View>
          <View style={s.tiersRow}>
            {(['pro', 'basic', 'free'] as PlanTier[]).map(tier => {
              const count = active.filter(s => s.tier === tier).length
              const tierMrr = active.filter(s => s.tier === tier && s.billingCycle === 'monthly').reduce((n, s) => n + s.amount, 0)
              return (
                <View key={tier} style={[s.tierCard, { borderTopColor: tierColor(tier), borderTopWidth: 2 }]}>
                  <Text style={[s.tierLabel, { color: tierColor(tier) }]}>{tier.toUpperCase()}</Text>
                  <Text style={s.tierCount}>{count} stores</Text>
                  <Text style={s.tierMrr}>{tierMrr > 0 ? formatCurrency(tierMrr, 'EUR') + '/mo' : '—'}</Text>
                </View>
              )
            })}
          </View>
          <Text style={s.tableHeader}>All Subscriptions</Text>
        </View>
      )}
      renderItem={({ item: sub }) => (
        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.storeName}>{storeName(sub.storeId)}</Text>
            <Text style={s.meta}>Renews {formatIsoDate(sub.currentPeriodEnd)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <View style={[s.badge, { borderColor: tierColor(sub.tier) + '55' }]}>
              <Text style={[s.badgeText, { color: tierColor(sub.tier) }]}>{sub.tier.toUpperCase()}</Text>
            </View>
            <Text style={s.amount}>{formatCurrency(sub.amount, sub.currency)}/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</Text>
          </View>
        </View>
      )}
    />
  )
}

const s = StyleSheet.create({
  list:        { padding: 12, gap: 8 },
  statsRow:    { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard:    { flex: 1, backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 12 },
  statValue:   { fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 2 },
  statLabel:   { fontSize: 11, color: C.text3 },
  tiersRow:    { flexDirection: 'row', gap: 10, marginBottom: 16 },
  tierCard:    { flex: 1, backgroundColor: C.bg2, borderRadius: 8, borderWidth: 1, borderColor: C.border, padding: 10 },
  tierLabel:   { fontSize: 11, fontWeight: '700', marginBottom: 3 },
  tierCount:   { fontSize: 11, color: C.text3, marginBottom: 2 },
  tierMrr:     { fontSize: 12, fontWeight: '600', color: C.text },
  tableHeader: { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 8 },
  row:         { backgroundColor: C.bg2, borderRadius: 8, borderWidth: 1, borderColor: C.border, padding: 12, flexDirection: 'row', alignItems: 'center' },
  storeName:   { fontSize: 13, fontWeight: '500', color: C.text, marginBottom: 3 },
  meta:        { fontSize: 11, color: C.text4 },
  badge:       { borderRadius: 4, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText:   { fontSize: 10, fontWeight: '600' },
  amount:      { fontSize: 12, color: C.text3 },
})
