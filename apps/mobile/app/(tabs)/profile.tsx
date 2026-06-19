import { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore, ACCOUNTS } from '@/store/auth'
import { getInitials, formatIsoDate } from '@ttg/utils'
import { C } from '@/constants/theme'

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <View style={[s.avatarWrap, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[s.avatarText, { fontSize: size * 0.35 }]}>{getInitials(name)}</Text>
    </View>
  )
}

function DemoCard() {
  const { login, switchAccount } = useAuthStore()
  const user = useAuthStore(st => st.user)

  return (
    <View style={s.section}>
      <Text style={s.sectionLabel}>DEMO ACCOUNTS</Text>
      {ACCOUNTS.map(a => {
        const active = user?.email === a.email
        const roleLabel = a.role === 'player' ? 'Player' : a.role === 'store-admin' ? 'Store Admin' : 'TTG Admin'
        return (
          <TouchableOpacity
            key={a.email}
            style={[s.demoRow, active && s.demoRowActive]}
            onPress={() => user ? switchAccount(a.email) : login(a.email)}
            activeOpacity={0.75}
          >
            <Avatar name={a.name} size={32} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[s.demoName, active && s.demoNameActive]}>{a.name}</Text>
              <Text style={s.demoEmail}>{a.email}</Text>
            </View>
            <View style={s.rolePill}>
              <Text style={s.rolePillText}>{roleLabel}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const login = useAuthStore(s => s.login)

  function handleLogin() {
    setError('')
    const ok = login(email)
    if (!ok) setError('No account found. Try a demo account below.')
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.loginContent}>
      <Text style={s.loginTitle}>◆ TTG Events</Text>
      <Text style={s.loginSub}>Sign in to register for events and track your history</Text>

      <View style={s.inputWrap}>
        <TextInput
          style={s.input}
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          placeholderTextColor={C.text4}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {error ? <Text style={s.inputError}>{error}</Text> : null}
        <TouchableOpacity style={s.loginBtn} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={s.loginBtnText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <DemoCard />
    </ScrollView>
  )
}

export default function ProfileScreen() {
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)

  if (!user) return <LoginForm />

  const roleLabel = user.role === 'player' ? 'Player'
    : user.role === 'store-admin' ? 'Store Admin'
    : 'TTG Admin'

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      {/* Profile card */}
      <View style={s.profileCard}>
        <Avatar name={user.name} size={52} />
        <View style={{ marginLeft: 14 }}>
          <Text style={s.userName}>{user.name}</Text>
          <Text style={s.userEmail}>{user.email}</Text>
          <View style={s.roleBadge}>
            <Text style={s.roleBadgeText}>{roleLabel}</Text>
          </View>
        </View>
      </View>

      {/* Info grid */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>ACCOUNT DETAILS</Text>
        {[
          { label: 'Name', value: user.name },
          { label: 'Email', value: user.email },
          { label: 'Role', value: roleLabel },
          { label: 'Member since', value: formatIsoDate(user.createdAt) },
        ].map(row => (
          <View key={row.label} style={s.infoRow}>
            <Text style={s.infoLabel}>{row.label}</Text>
            <Text style={s.infoValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      {/* Demo switcher */}
      <DemoCard />

      {/* Role-gated panel links */}
      {(user.role === 'store-admin' || user.role === 'ttg-admin') && (
        <View style={s.section}>
          <Text style={s.sectionLabel}>PANEL ACCESS</Text>
          <TouchableOpacity
            style={s.panelRow}
            onPress={() => router.push('/admin' as never)}
            activeOpacity={0.75}
          >
            <Text style={s.panelIcon}>⚙️</Text>
            <Text style={s.panelLabel}>Admin Panel</Text>
            <Text style={s.panelArrow}>›</Text>
          </TouchableOpacity>
          {user.role === 'ttg-admin' && (
            <TouchableOpacity
              style={[s.panelRow, { borderBottomWidth: 0 }]}
              onPress={() => router.push('/internal' as never)}
              activeOpacity={0.75}
            >
              <Text style={s.panelIcon}>◆</Text>
              <Text style={[s.panelLabel, { color: C.purple }]}>Internal Dashboard</Text>
              <Text style={s.panelArrow}>›</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Sign out */}
      <TouchableOpacity style={s.signOutBtn} onPress={logout} activeOpacity={0.8}>
        <Text style={s.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={s.demoNote}>
        <Text style={s.demoNoteText}>
          This is a demo app. Switch accounts above to explore different roles.
        </Text>
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: C.bg },
  content:       { padding: 16, gap: 12 },
  loginContent:  { padding: 16, gap: 16, paddingTop: 40 },

  loginTitle:    { fontSize: 24, fontWeight: '700', color: C.gold, textAlign: 'center', marginBottom: 4 },
  loginSub:      { fontSize: 13, color: C.text3, textAlign: 'center', lineHeight: 20, marginBottom: 8 },

  inputWrap:     { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 16, gap: 10 },
  input:         { backgroundColor: C.bg1, borderRadius: 7, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 13, padding: 10 },
  inputError:    { fontSize: 12, color: C.red },
  loginBtn:      { backgroundColor: C.gold, borderRadius: 8, padding: 12, alignItems: 'center' },
  loginBtnText:  { fontSize: 14, fontWeight: '600', color: C.bg },

  profileCard:   { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 16, flexDirection: 'row', alignItems: 'center' },
  avatarWrap:    { backgroundColor: C.bg3, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  avatarText:    { color: C.text3, fontWeight: '600' },
  userName:      { fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 2 },
  userEmail:     { fontSize: 12, color: C.text3, marginBottom: 6 },
  roleBadge:     { alignSelf: 'flex-start', backgroundColor: `${C.gold}1a`, borderRadius: 4, borderWidth: 1, borderColor: `${C.gold}33`, paddingHorizontal: 7, paddingVertical: 2 },
  roleBadgeText: { fontSize: 10, color: C.gold, fontWeight: '600' },

  section:       { backgroundColor: C.bg2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14 },
  sectionLabel:  { fontSize: 10, fontWeight: '600', color: C.text4, letterSpacing: 0.8, marginBottom: 10 },

  infoRow:       { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.border },
  infoLabel:     { fontSize: 12, color: C.text3 },
  infoValue:     { fontSize: 12, color: C.text, fontWeight: '500' },

  demoRow:       { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 7, marginBottom: 6, backgroundColor: C.bg3 },
  demoRowActive: { backgroundColor: `${C.gold}1a` },
  demoName:      { fontSize: 13, fontWeight: '500', color: C.text, marginBottom: 1 },
  demoNameActive:{ color: C.gold },
  demoEmail:     { fontSize: 10, color: C.text4 },
  rolePill:      { backgroundColor: C.bg4, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  rolePillText:  { fontSize: 10, color: C.text4 },

  signOutBtn:    { backgroundColor: `${C.red}1a`, borderRadius: 8, borderWidth: 1, borderColor: `${C.red}33`, padding: 14, alignItems: 'center', marginTop: 4 },
  signOutText:   { fontSize: 14, fontWeight: '600', color: C.red },

  demoNote:      { padding: 16, alignItems: 'center' },
  demoNoteText:  { fontSize: 11, color: C.text4, textAlign: 'center', lineHeight: 16 },

  panelRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.border },
  panelIcon:     { fontSize: 16, marginRight: 10, width: 22 },
  panelLabel:    { flex: 1, fontSize: 14, color: C.text, fontWeight: '500' },
  panelArrow:    { fontSize: 18, color: C.text4 },
})
