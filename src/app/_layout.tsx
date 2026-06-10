import '../global.css';

import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';

export default function TabLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
