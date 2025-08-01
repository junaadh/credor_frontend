import { Stack } from "expo-router";

export default function HomeController() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="facialScan" />
    </Stack>
  );
}
