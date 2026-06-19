import { useState } from 'react'
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, StyleSheet, Alert,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { getEventById, updateEvent } from '@ttg/mock-data'
import { C } from '@/constants/theme'
import type { EventStatus } from '@ttg/types'

const STATUSES: EventStatus[] = ['upcoming', 'active', 'completed', 'cancelled']

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      {children}
    </View>
  )
}

export default function EventEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const event = getEventById(id ?? '')

  if (!event) {
    return (
      <View style={s.center}>
        <Text style={s.notFound}>Event not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={s.back}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const [name, setName] = useState(event.name)
  const [date, setDate] = useState(event.date)
  const [time, setTime] = useState(event.time)
  const [capacity, setCapacity] = useState(String(event.capacity))
  const [waitlist, setWaitlist] = useState(String(event.waitlistCapacity))
  const [entryFee, setEntryFee] = useState(String(event.entryFee))
  const [status, setStatus] = useState<EventStatus>(event.status)
  const [notes, setNotes] = useState(event.notes ?? '')

  function handleSave() {
    const cap = parseInt(capacity, 10)
    const wait = parseInt(waitlist, 10)
    const fee = parseInt(entryFee, 10)

    if (!name.trim()) { Alert.alert('Error', 'Name is required.'); return }
    if (isNaN(cap) || cap < 1) { Alert.alert('Error', 'Invalid capacity.'); return }
    if (isNaN(fee) || fee < 0) { Alert.alert('Error', 'Invalid entry fee.'); return }

    updateEvent(event.id, {
      name: name.trim(),
      date,
      time,
      capacity: cap,
      waitlistCapacity: isNaN(wait) ? 0 : wait,
      entryFee: fee,
      status,
      notes: notes.trim() || undefined,
    })

    Alert.alert('Saved', 'Event updated.', [
      { text: 'OK', onPress: () => router.back() },
    ])
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Field label="NAME">
        <TextInput style={s.input} value={name} onChangeText={setName} />
      </Field>

      <Field label="STATUS">
        <View style={s.statusRow}>
          {STATUSES.map(st => (
            <TouchableOpacity
              key={st}
              style={[s.statusChip, status === st && s.statusChipActive]}
              onPress={() => setStatus(st)}
              activeOpacity={0.75}
            >
              <Text style={[s.statusChipText, status === st && s.statusChipTextActive]}>
                {st}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Field>

      <View style={s.row}>
        <View style={{ flex: 1 }}>
          <Field label="DATE (YYYY-MM-DD)">
            <TextInput style={s.input} value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" />
          </Field>
        </View>
        <View style={{ width: 100 }}>
          <Field label="TIME (HH:MM)">
            <TextInput style={s.input} value={time} onChangeText={setTime} keyboardType="numbers-and-punctuation" />
          </Field>
        </View>
      </View>

      <View style={s.row}>
        <View style={{ flex: 1 }}>
          <Field label="CAPACITY">
            <TextInput style={s.input} value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="WAITLIST">
            <TextInput style={s.input} value={waitlist} onChangeText={setWaitlist} keyboardType="numeric" />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label={`FEE (${event.currency})`}>
            <TextInput style={s.input} value={entryFee} onChangeText={setEntryFee} keyboardType="numeric" />
          </Field>
        </View>
      </View>

      <Field label="NOTES">
        <TextInput
          style={[s.input, s.textarea]}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Optional notes…"
          placeholderTextColor={C.text4}
        />
      </Field>

      <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <Text style={s.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.cancelBtn} onPress={() => router.back()} activeOpacity={0.75}>
        <Text style={s.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen:              { flex: 1, backgroundColor: C.bg },
  content:             { padding: 16, gap: 14, paddingBottom: 40 },

  field:               { gap: 5 },
  label:               { fontSize: 10, fontWeight: '600', color: C.text4, letterSpacing: 0.8 },
  input:               { backgroundColor: C.bg2, borderWidth: 1, borderColor: C.border, borderRadius: 8, color: C.text, fontSize: 14, padding: 11 },
  textarea:            { minHeight: 80 },

  row:                 { flexDirection: 'row', gap: 10 },

  statusRow:           { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  statusChip:          { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg2 },
  statusChipActive:    { backgroundColor: `${C.gold}1a`, borderColor: `${C.gold}4d` },
  statusChipText:      { fontSize: 12, color: C.text3, textTransform: 'capitalize' },
  statusChipTextActive:{ color: C.gold, fontWeight: '600' },

  saveBtn:             { backgroundColor: C.gold, borderRadius: 9, padding: 14, alignItems: 'center', marginTop: 6 },
  saveBtnText:         { fontSize: 15, fontWeight: '700', color: C.bg },
  cancelBtn:           { borderRadius: 9, padding: 12, alignItems: 'center' },
  cancelBtnText:       { fontSize: 14, color: C.text3 },

  center:              { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  notFound:            { fontSize: 15, color: C.text3, marginBottom: 16 },
  back:                { padding: 10 },
  backText:            { fontSize: 14, color: C.gold },
})
