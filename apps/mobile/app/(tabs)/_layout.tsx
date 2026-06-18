import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { C } from '@/constants/theme'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

function icon(focused: boolean, name: IoniconName, nameOff: IoniconName) {
  return <Ionicons name={focused ? name : nameOff} size={22} color={focused ? C.gold : C.text4} />
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: C.bg1, borderTopColor: C.border, height: 60, paddingBottom: 8 },
        tabBarActiveTintColor: C.gold,
        tabBarInactiveTintColor: C.text4,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
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
          tabBarIcon: ({ focused }) => icon(focused, 'calendar', 'calendar-outline'),
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: 'Stores',
          tabBarIcon: ({ focused }) => icon(focused, 'storefront', 'storefront-outline'),
        }}
      />
      <Tabs.Screen
        name="my-events"
        options={{
          title: 'My Events',
          tabBarIcon: ({ focused }) => icon(focused, 'list', 'list-outline'),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Updates',
          tabBarIcon: ({ focused }) => icon(focused, 'notifications', 'notifications-outline'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => icon(focused, 'person', 'person-outline'),
        }}
      />
      <Tabs.Screen name="dashboard" options={{ href: null }} />
    </Tabs>
  )
}
