import { Stack } from "expo-router";

export default function SettingsController() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="personalInformation" />
      <Stack.Screen name="changeEmail" />
      <Stack.Screen name="changePassword" />
      <Stack.Screen name="changeName" />
      <Stack.Screen name="changeAge" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
