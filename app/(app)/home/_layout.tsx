import { Stack } from "expo-router";

export default function HomeController() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="facialScan" />
    </Stack>
  );
}
