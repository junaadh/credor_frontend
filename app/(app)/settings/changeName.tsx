import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSettings } from "@/hooks/useSettings";
import { useSession } from "@/hooks/context";

const { width } = Dimensions.get("window");

export default function ChangeNameScreen() {
  const [newName, setNewName] = useState<string | null>(null);
  const { name, updateSettings } = useSettings();
  const { refreshContext } = useSession();

  const handleBackPress = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!newName || !newName.trim()) {
      Alert.alert("Error", "Please enter a valid name.");
      return;
    }

    try {
      await updateSettings(newName.trim(), null, null, null);

      // Now show success alert AFTER saving
      Alert.alert("Success", "Name updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            refreshContext();
            router.back();
          },
        },
      ]);
    } catch (err) {
      console.error("Failed to update name:", err);
      Alert.alert("Error", "Something went wrong while updating your name.");
    }
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Change Name</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            This changes the name displayed to refer the user in the
            application.
          </Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New Name</Text>
            <TextInput
              style={styles.textInput}
              value={newName ? newName : ""}
              onChangeText={setNewName}
              placeholder={name}
              placeholderTextColor="#878787"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontFamily: "DMSans-Bold",
    fontSize: 32,
    fontWeight: "700",
    color: "#F5F5F5",
    lineHeight: 42,
  },
  description: {
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    fontWeight: "400",
    color: "#F5F5F5",
    lineHeight: 18,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 40,
  },
  inputLabel: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#F5F5F5",
    lineHeight: 21,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: "#F5F5F5",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  saveButton: {
    width: 212,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EFBD3D",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EFBD3D",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 21.4,
    elevation: 5,
  },
  saveButtonText: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#1F1F1F",
    lineHeight: 21,
  },
});
