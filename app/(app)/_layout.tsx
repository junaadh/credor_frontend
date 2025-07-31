import { HapticTab } from "@/components/HapticTab";
import { Ionicons } from "@expo/vector-icons";
import { withLayoutContext } from "expo-router";
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
} from "@bottom-tabs/react-navigation";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

export default function TabNavigator() {
  // return <Stack screenOptions={{ headerShown: false }} />;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#EFBD3D",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: () => ({ sfSymbol: "house" }),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: () => ({ sfSymbol: "shield" }),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          tabBarIcon: () => ({ sfSymbol: "newspaper" }),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: () => ({ sfSymbol: "gearshape" }),
        }}
      />
    </Tabs>
  );
}
