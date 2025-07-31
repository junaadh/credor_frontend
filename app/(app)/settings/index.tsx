import React from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const { width } = Dimensions.get("window");

import SettingsList from "@/components/SettingsList";
import Header from "@/components/Header";
import { router } from "expo-router";
import { useSession } from "@/hooks/context";

export default function SettingsScreen() {
  const { logout } = useSession();

  const settingsOptions = [
    {
      id: "personal",
      title: "Personal Information",
      icon: "person-outline",
      onPress: () => {
        router.push("/(app)/settings/updateSetting");
      },
    },
    {
      id: "facial",
      title: "Update Facial Scan",
      icon: "scan-outline",
      onPress: () => {
        router.push("/(app)/home/facialScan");
      },
    },
    {
      id: "history",
      title: "History",
      icon: "time-outline",
      onPress: () => {
        Alert.alert("Coming Soon", "History will be available soon.");
      },
    },
    {
      id: "about",
      title: "About Us",
      icon: "information-circle-outline",
      onPress: () => {
        Alert.alert("Coming Soon", "About Us section will be available soon.");
      },
    },
    {
      id: "terms",
      title: "Terms of Service",
      icon: "document-text-outline",
      onPress: () => {
        Alert.alert("Coming Soon", "Terms of Service will be available soon.");
      },
    },
    {
      id: "logout",
      title: "Log Out",
      icon: "log-out-outline",
      onPress: () => {
        Alert.alert(
          "Log Out",
          "Are you sure you want to log out?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Log Out",
              onPress: () => {
                logout();
                router.replace("/");
              },
              style: "destructive",
            },
          ],
          { cancelable: true },
        );
      },
    },
  ];

  const handleOptionPress = (option: any) => {
    option.onPress();
  };

  return (
    <LinearGradient
      colors={["#000000", "#C3A455"]}
      start={{ x: 0.5, y: 0.4 }}
      end={{ x: -0.76, y: -0.54 }}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <SafeAreaView>
          <Header title="Settings" />
          <SettingsList
            settingsOptions={settingsOptions}
            onOptionPress={handleOptionPress}
          />
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Math.min(38, width * 0.1),
  },
  scrollView: {
    flex: 1,
  },
});
