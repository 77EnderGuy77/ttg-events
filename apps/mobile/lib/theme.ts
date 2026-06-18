import { useColorScheme } from 'react-native'

export function useTheme() {
  const scheme = useColorScheme()
  const dark = scheme === 'dark'
  return {
    dark,
    c: {
      bg:       dark ? '#14161c' : '#f9fafb',
      bg2:      dark ? '#1e2028' : '#ffffff',
      bg3:      dark ? '#252830' : '#f3f4f6',
      border:   dark ? '#2c2f3a' : '#e5e7eb',
      text:     dark ? '#e8e0d0' : '#111827',
      textSub:  dark ? '#8f8880' : '#6b7280',
      textMut:  dark ? '#5f5850' : '#9ca3af',
      gold:     '#c8a85a',
      red:      '#ef4444',
      amber:    '#f59e0b',
    },
  }
}
