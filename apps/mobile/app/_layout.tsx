import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { C } from '@/constants/theme'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: C.bg1 },
          headerTintColor: C.text,
          headerTitleStyle: { fontWeight: '600', fontSize: 16 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: C.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="events/[id]" options={{ title: '' }} />
      </Stack>
    </>
  )
}
