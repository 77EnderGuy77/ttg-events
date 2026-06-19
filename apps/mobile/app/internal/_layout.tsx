import { Stack, router } from 'expo-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { C } from '@/constants/theme'

export default function InternalLayout() {
  const user = useAuthStore(s => s.user)

  useEffect(() => {
    if (!user || user.role !== 'ttg-admin') {
      router.replace('/(tabs)/profile')
    }
  }, [user])

  if (!user || user.role !== 'ttg-admin') return null

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: C.bg1 },
        headerTintColor: C.purple,
        headerTitleStyle: { fontWeight: '600', fontSize: 15, color: C.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: C.bg },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Internal Overview' }} />
      <Stack.Screen name="applications" options={{ title: 'Applications' }} />
      <Stack.Screen name="stores" options={{ title: 'Stores' }} />
      <Stack.Screen name="users" options={{ title: 'Users' }} />
      <Stack.Screen name="subscriptions" options={{ title: 'Subscriptions' }} />
    </Stack>
  )
}
