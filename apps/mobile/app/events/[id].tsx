import { useState, useMemo } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { getEventWithStore, getEventStats, getMyRegistrations } from '@ttg/mock-data'
import { formatDate, gameLabel, formatLabel, calcFillPct } from '@ttg/utils'
import { useAuthStore } from '@/store/auth'
import { C } from '@/constants/theme'
import type { RegistrationType } from '@ttg/types'

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[s.badge, { backgroundColor: `${color}1a`, borderColor: `${color}33` }]}>
      <Text style={[s.badgeText, { color }]}>{label.toUpperCase()}</Text>
    </View>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  )
}

type RegOption = { type: RegistrationType; label: string }

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const user = useAuthStore(s => s.user)
  const [regType, setRegType] = useState<RegistrationType>('1v1')
  const [teammateName, setTeammateName] = useState('')
  const [registered, setRegistered] = useState(false)

  const { event, stats, existingReg } = useMemo(() => {
    if (!id) return { event: null, stats: null, existingReg: null }
    const ev = getEventWithStore(id)
    const st = ev ? getEventStats(id) : null
    const myRegs = user ? getMyRegistrations(user.id) : []
    const existing = myRegs.find(r => r.eventId === id) ?? null
    return { event: ev ?? null, stats: st, existingReg: existing }
  }, [id, user])

  if (!event) {
    return (
      <View style={s.center}>
        <Text style={s.notFoundText}>Event not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backBtnText}>← Go back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const confirmed = stats?.confirmed ?? 0
  const waitlisted = stats?.waitlisted ?? 0
  const pct = calcFillPct(confirmed, event.capacity)
  const full = confirmed >= event.capacity
  const waitlistFull = full && waitlisted >= event.waitlistCapacity
  const is2hg = event.format === '2hg'
  const feeStr = event.entryFee > 0 ? `${event.entryFee} ${event.currency}` : 'Free'

  const barColor = pct >= 100 ? C.red : pct >= 75 ? C.amber : C.gold

  const regOptions: RegOption[] = [
    { type: '1v1', label: '1v1 — Solo' },
    ...(is2hg ? [
      { type: '2v2-solo' as RegistrationType, label: '2HG — Looking for partner' },
      { type: '2v2-team' as RegistrationType, label: '2HG — Register with teammate' },
    ] : []),
  ]

  function handleRegister() {
    if (!user) {
      Alert.alert('Sign in required', 'Go to Profile tab to sign in.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go to Profile', onPress: () => router.push('/(tabs)/profile') },
      ])
      return
    }
    if (regType === '2v2-team' && !teammateName.trim()) {
      Alert.alert('Teammate required', 'Please enter your teammate\'s name.')
      return
    }
    setRegistered(true)
  }

  if (registered) {
    return (
      <View style={s.center}>
        <Text style={s.successIcon}>✅</Text>
        <Text style={s.successTitle}>{full ? 'You\'re on the waitlist!' : 'You\'re registered!'}</Text>
        <Text style={s.successSub}>{event.name}</Text>
        <Text style={s.successDate}>{formatDate(event.date)} · {event.time}</Text>
        <TouchableOpacity style={s.successBtn} onPress={() => router.push('/(tabs)/my-events')} activeOpacity={0.8}>
          <Text style={s.successBtnText}>View My Events</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.successBtnGhost} onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={s.successBtnGhostText}>← Back to event</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.badges}>
          <Badge label={gameLabel(event.game)} color={C.gold} />
          <Badge label={formatLabel(event.format)} color={C.purple} />
          {event.status === 'active' && <Badge label="LIVE" color={C.green} />}
        </View>
        <Text style={s.title}>{event.name}</Text>
        <Text style={s.storeName}>{event.store.name} · {event.store.city}</Text>
      </View>

      {/* Info grid */}
      <View style={s.card}>
        <InfoRow label="Date" value={formatDate(event.date)} />
        <InfoRow label="Time" value={event.time} />
        <InfoRow label="Entry Fee" value={feeStr} />
        <InfoRow label="Location" value={`${event.store.city}, ${event.store.country}`} />
        <InfoRow label="Address" value={event.store.address} />
      </View>

      {/* Capacity */}
      <View style={s.card}>
        <View style={s.capacityHeader}>
          <Text style={s.cardLabel}>Capacity</Text>
          <Text style={s.capacityCount}>{confirmed} / {event.capacity}</Text>
        </View>
        <View style={s.barTrack}>
          <View style={[s.barFill, { width: `${Math.min(pct, 100)}%` as `${number}%`, backgroundColor: barColor }]} />
        </View>
        {full ? (
          <Text style={s.fullText}>
            Event full · {waitlisted}/{event.waitlistCapacity} on waitlist
          </Text>
        ) : (
          <Text style={s.spotsText}>{event.capacity - confirmed} spots remaining</Text>
        )}
      </View>

      {/* Notes */}
      {event.notes && (
        <View style={s.card}>
          <Text style={s.cardLabel}>Notes</Text>
          <Text style={s.notes}>{event.notes}</Text>
        </View>
      )}

      {/* Registration */}
      <View style={s.card}>
        <Text style={s.cardLabel}>Register</Text>

        {existingReg ? (
          <View style={s.alreadyReg}>
            <Text style={s.alreadyRegTitle}>
              {existingReg.status === 'registered' ? "You're registered ✓"
                : existingReg.status === 'waitlisted' ? "You're on the waitlist"
                : existingReg.status === 'checked-in' ? "You're checked in ✓"
                : existingReg.status === 'attended' ? "You attended this event"
                : "Registration cancelled"}
            </Text>
            <Text style={s.alreadyRegSub}>{
              existingReg.teammateName ? `Team with ${existingReg.teammateName}` :
              existingReg.type === '2v2-solo' ? 'Looking for partner' : '1v1 Solo'
            }</Text>
          </View>
        ) : event.status === 'completed' || event.status === 'cancelled' ? (
          <Text style={s.closedText}>This event is {event.status}.</Text>
        ) : waitlistFull ? (
          <Text style={s.closedText}>Event and waitlist are full.</Text>
        ) : (
          <>
            {full && (
              <View style={s.waitlistNote}>
                <Text style={s.waitlistNoteText}>Event is full — you'll join the waitlist.</Text>
              </View>
            )}

            {regOptions.map(opt => (
              <TouchableOpacity
                key={opt.type}
                style={[s.regOption, regType === opt.type && s.regOptionActive]}
                onPress={() => setRegType(opt.type)}
                activeOpacity={0.7}
              >
                <View style={[s.regDot, regType === opt.type && s.regDotActive]} />
                <Text style={[s.regOptionText, regType === opt.type && s.regOptionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={s.registerBtn}
              onPress={handleRegister}
              activeOpacity={0.85}
            >
              <Text style={s.registerBtnText}>
                {full ? 'Join Waitlist' : 'Register'} {user ? '' : '(Sign in first)'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen:              { flex: 1, backgroundColor: C.bg },
  content:             { padding: 16, gap: 12 },
  center:              { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },

  notFoundText:        { fontSize: 16, color: C.text, marginBottom: 16 },
  backBtn:             { padding: 12 },
  backBtnText:         { fontSize: 14, color: C.gold },

  header:              { gap: 6 },
  badges:              { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  badge:               { borderRadius: 4, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start' },
  badgeText:           { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  title:               { fontSize: 20, fontWeight: '700', color: C.text },
  storeName:           { fontSize: 13, color: C.gold },

  card:                { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14, gap: 2 },
  cardLabel:           { fontSize: 10, fontWeight: '600', color: C.text4, letterSpacing: 0.8, marginBottom: 8 },

  infoRow:             { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.border },
  infoLabel:           { fontSize: 12, color: C.text3 },
  infoValue:           { fontSize: 12, color: C.text, fontWeight: '500', flex: 1, textAlign: 'right' },

  capacityHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  capacityCount:       { fontSize: 13, fontWeight: '600', color: C.text },
  barTrack:            { height: 5, backgroundColor: C.bg4, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  barFill:             { height: 5, borderRadius: 3 },
  fullText:            { fontSize: 11, color: C.red },
  spotsText:           { fontSize: 11, color: C.text4 },

  notes:               { fontSize: 13, color: C.text2, lineHeight: 20 },

  alreadyReg:          { backgroundColor: `${C.gold}0d`, borderRadius: 7, borderWidth: 1, borderColor: `${C.gold}33`, padding: 12 },
  alreadyRegTitle:     { fontSize: 14, fontWeight: '600', color: C.gold, marginBottom: 2 },
  alreadyRegSub:       { fontSize: 12, color: C.text3 },

  closedText:          { fontSize: 13, color: C.text3, paddingVertical: 8 },

  waitlistNote:        { backgroundColor: `${C.amber}1a`, borderRadius: 7, borderWidth: 1, borderColor: `${C.amber}33`, padding: 10, marginBottom: 10 },
  waitlistNoteText:    { fontSize: 12, color: C.amber },

  regOption:           { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, borderRadius: 7, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg3, marginBottom: 6 },
  regOptionActive:     { borderColor: `${C.gold}66`, backgroundColor: `${C.gold}0d` },
  regDot:              { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: C.border },
  regDotActive:        { borderColor: C.gold, backgroundColor: C.gold },
  regOptionText:       { fontSize: 13, color: C.text3 },
  regOptionTextActive: { color: C.gold, fontWeight: '500' },

  registerBtn:         { backgroundColor: C.gold, borderRadius: 9, padding: 14, alignItems: 'center', marginTop: 6 },
  registerBtnText:     { fontSize: 14, fontWeight: '700', color: C.bg },

  successIcon:         { fontSize: 52, marginBottom: 16 },
  successTitle:        { fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 4, textAlign: 'center' },
  successSub:          { fontSize: 14, color: C.text2, textAlign: 'center', marginBottom: 2 },
  successDate:         { fontSize: 12, color: C.text3, marginBottom: 24 },
  successBtn:          { backgroundColor: C.gold, borderRadius: 9, paddingHorizontal: 24, paddingVertical: 13, marginBottom: 10 },
  successBtnText:      { fontSize: 14, fontWeight: '700', color: C.bg },
  successBtnGhost:     { padding: 10 },
  successBtnGhostText: { fontSize: 13, color: C.text3 },
})
