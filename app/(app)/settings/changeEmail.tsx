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
import { useSession } from "@/hooks/context";
import { useSettings } from "@/hooks/useSettings";

const { width } = Dimensions.get("window");

export default function ChangeEmailScreen() {
  const { logout } = useSession();
  const [newEmail, setNewEmail] = useState<string | null>(null);
  const { email, updateSettings, checkValid } = useSettings();

  const handleBackPress = () => {
    router.back();
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (!newEmail || !newEmail.trim()) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (!validateEmail(newEmail)) {
      Alert.alert(
        "Error",
        "Please enter a valid email format (e.g., example@gmail.com).",
      );
      return;
    }

    if (!(await checkValid(newEmail))) {
      Alert.alert("Error", "Email address taken already");
      return;
    }

    try {
      await updateSettings(null, newEmail, null, null);

      Alert.alert("Success", "Email updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            logout();
          },
        },
      ]);
    } catch (err) {
      console.error("Failed to update name:", err);
      Alert.alert("Error", "Something went wrong while updating your email.");
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
              <Text style={styles.title}>Change Email</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            This changes the email used for authentication for the user.
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={newEmail ? newEmail : ""}
              onChangeText={setNewEmail}
              placeholder={email}
              placeholderTextColor="#878787"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.divider} />
          </View>

          {/* Email Format Note */}
          <View style={styles.formatNoteContainer}>
            <Ionicons name="information-circle" size={13} color="#EFBD3D" />
            <Text style={styles.formatNoteText}>
              Email must be in a global format
            </Text>
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
    marginBottom: 20,
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
    backgroundColor: "transparent",
    fontSize: 16,
    color: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
  },
  formatNoteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  formatNoteText: {
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    fontWeight: "400",
    color: "#F5F5F5",
    lineHeight: 18,
    marginLeft: 8,
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
