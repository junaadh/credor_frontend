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

export default function ChangePasswordScreen() {
  const { logout } = useSession();
  const { updateSettings } = useSettings();
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSave = async () => {
    if (!newPassword || !newPassword.trim()) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }

    if (!confirmPassword || !confirmPassword.trim()) {
      Alert.alert("Error", "Please enter confirm password.");
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert("Error", "Password must be minimum 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match.");
      return;
    }

    try {
      await updateSettings(null, null, newPassword, null);

      Alert.alert("Success", "Password updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            logout();
          },
        },
      ]);
    } catch (err) {
      console.error("Failed to update password:", err);
      Alert.alert(
        "Error",
        "Something went wrong while updating your password.",
      );
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
              <Text style={styles.title}>Change Password</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            This changes the password used for authentication for the user.
          </Text>

          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword ? newPassword : ""}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#878787"
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showNewPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#878787"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword ? confirmPassword : ""}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#878787"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#878787"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
          </View>

          {/* Password Requirements Note */}
          <View style={styles.requirementsContainer}>
            <Ionicons name="information-circle" size={13} color="#EFBD3D" />
            <Text style={styles.requirementsText}>
              Password must be minimum 8 characters long
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
    marginBottom: 30,
  },
  inputLabel: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#F5F5F5",
    lineHeight: 21,
    marginBottom: 10,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 16,
    color: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  eyeButton: {
    padding: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
  },
  requirementsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  requirementsText: {
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
