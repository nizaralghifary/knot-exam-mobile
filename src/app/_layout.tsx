import '../global.css';

import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="verify" options={{ presentation: "modal" }} />
      </Stack>
      <PortalHost />
    </>
  );
}
