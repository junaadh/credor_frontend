import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SettingsOption from "@/components/SettingsOption";

export default function SettingsList({ settingsOptions, onOptionPress }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>General</Text>
      <View style={styles.divider} />

      <View style={styles.optionsContainer}>
        {settingsOptions.map((option: { id: any }) => (
          <SettingsOption
            key={option.id}
            option={option}
            onPress={onOptionPress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 71,
  },
  sectionTitle: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    color: "#F5F5F5",
    marginLeft: 38,
  },
  divider: {
    height: 1,
    backgroundColor: "#595959",
    marginTop: 19,
    marginHorizontal: 38,
  },
  optionsContainer: {
    marginTop: 15,
  },
});
