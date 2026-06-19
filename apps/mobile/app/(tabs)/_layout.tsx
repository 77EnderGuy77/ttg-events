import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { C } from '@/constants/theme'

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20, lineHeight: 24 }}>{emoji}</Text>
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: C.bg1,
          borderTopColor: C.border,
          borderTopWidth: 1,
          height: 58,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: C.gold,
        tabBarInactiveTintColor: C.text4,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500', marginTop: 0 },
        headerStyle: { backgroundColor: C.bg1 },
        headerTintColor: C.text,
        headerTitleStyle: { fontWeight: '600', fontSize: 16 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          headerTitle: '◆ TTG Events',
          tabBarIcon: () => <TabIcon emoji="📅" />,
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: 'Stores',
          tabBarIcon: () => <TabIcon emoji="🏪" />,
        }}
      />
      <Tabs.Screen
        name="stores/index"
        options={{
          title: 'Stores',
          tabBarIcon: () => <TabIcon emoji="🏪" />,
        }}
      />
      <Tabs.Screen
        name="my-events"
        options={{
          title: 'My Events',
          tabBarIcon: () => <TabIcon emoji="☰" />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Updates',
          tabBarIcon: () => <TabIcon emoji="🔔" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <TabIcon emoji="👤" />,
        }}
      />
      <Tabs.Screen name="stores/[slug]" options={{ href: null }} />
      <Tabs.Screen name="dashboard" options={{ href: null }} />
      <Tabs.Screen name="dashboard/index" options={{ href: null }} />
    </Tabs>
  )
}
