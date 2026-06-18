import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore, ACCOUNTS } from '@/store/auth'
import { C } from '@/constants/theme'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const login = useAuthStore(s => s.login)

  function handleSubmit() {
    setError('')
    const ok = login(email)
    if (ok) router.replace('/(tabs)/')
    else setError('No account found. Try a demo account below.')
  }

  function handleDemo(demoEmail: string) {
    login(demoEmail)
    router.replace('/(tabs)/')
  }

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.screen} contentContainerStyle={s.content}>
        <View style={s.hero}>
          <Text style={s.heroIcon}>◆</Text>
          <Text style={s.heroTitle}>TTG Events</Text>
          <Text style={s.heroSub}>Find and register for events near you</Text>
        </View>

        <View style={s.card}>
          <Text style={s.label}>Email</Text>
          <TextInput
            style={s.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={C.text4}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error ? <Text style={s.error}>{error}</Text> : null}
          <TouchableOpacity style={s.btn} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={s.btnText}>Sign in</Text>
          </TouchableOpacity>
        </View>

        <View style={s.card}>
          <Text style={s.sectionLabel}>DEMO ACCOUNTS</Text>
          {ACCOUNTS.map(a => (
            <TouchableOpacity
              key={a.email}
              style={s.demoRow}
              onPress={() => handleDemo(a.email)}
              activeOpacity={0.75}
            >
              <View style={{ flex: 1 }}>
                <Text style={s.demoName}>{a.name}</Text>
                <Text style={s.demoEmail}>{a.email}</Text>
              </View>
              <View style={s.rolePill}>
                <Text style={s.rolePillText}>{a.role}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <Text style={s.hint}>Any password works for demo accounts.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  flex:        { flex: 1, backgroundColor: C.bg },
  screen:      { flex: 1, backgroundColor: C.bg },
  content:     { padding: 20, paddingTop: 60, gap: 14 },

  hero:        { alignItems: 'center', gap: 6, marginBottom: 8 },
  heroIcon:    { fontSize: 36, color: C.gold },
  heroTitle:   { fontSize: 24, fontWeight: '700', color: C.text },
  heroSub:     { fontSize: 13, color: C.text3 },

  card:        { backgroundColor: C.bg2, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 16, gap: 10 },
  label:       { fontSize: 12, color: C.text3 },
  input:       { backgroundColor: C.bg3, borderRadius: 8, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 13, paddingHorizontal: 12, paddingVertical: 10 },
  error:       { fontSize: 12, color: C.red },
  btn:         { backgroundColor: C.gold, borderRadius: 8, padding: 13, alignItems: 'center' },
  btnText:     { fontSize: 14, fontWeight: '700', color: C.bg },

  sectionLabel:{ fontSize: 10, fontWeight: '600', color: C.text4, letterSpacing: 0.8 },
  demoRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg3, borderRadius: 8, padding: 11 },
  demoName:    { fontSize: 13, fontWeight: '500', color: C.text, marginBottom: 1 },
  demoEmail:   { fontSize: 11, color: C.text4 },
  rolePill:    { backgroundColor: C.bg4, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3 },
  rolePillText:{ fontSize: 10, color: C.text4, textTransform: 'capitalize' },
  hint:        { fontSize: 11, color: C.text4 },
})
