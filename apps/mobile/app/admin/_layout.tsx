import { Stack, router } from 'expo-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { C } from '@/constants/theme'

export default function AdminLayout() {
  const user = useAuthStore(s => s.user)

  useEffect(() => {
    if (!user || (user.role !== 'store-admin' && user.role !== 'ttg-admin')) {
      router.replace('/(tabs)/profile')
    }
  }, [user])

  if (!user || (user.role !== 'store-admin' && user.role !== 'ttg-admin')) return null

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: C.bg1 },
        headerTintColor: C.gold,
        headerTitleStyle: { fontWeight: '600', fontSize: 15, color: C.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: C.bg },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="events" options={{ title: 'Events' }} />
      <Stack.Screen name="stores" options={{ title: 'Stores' }} />
      <Stack.Screen name="store-requests" options={{ title: 'Store Requests' }} />
      <Stack.Screen name="event-edit" options={{ title: 'Edit Event' }} />
    </Stack>
  )
}
