import { Stack } from "expo-router";

export default function SettingsController() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="updateSetting" />
    </Stack>
  );
}
