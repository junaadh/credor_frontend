import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsOption({ option, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.optionButton}
      onPress={() => onPress(option)}
    >
      <View style={styles.optionContent}>
        <Ionicons
          name={option.icon}
          size={24}
          color={option.id === "logout" ? "#EFBD3D" : "#FFFFFF"}
        />
        <Text style={styles.optionText}>{option.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 38,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    color: "#F5F5F5",
    marginLeft: 15,
  },
});
