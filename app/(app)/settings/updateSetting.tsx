import { useSession } from "@/hooks/context";
import { useSettings } from "@/hooks/useSettings";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function UpdateSetting() {
  const { name, email, checkValid, updateSettings } = useSettings();

  const { refreshContext } = useSession();
  const [newName, setNewName] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);

  const handleUpdate = async () => {
    console.log(newEmail, newName, newPassword);

    if (newEmail) {
      const isEmailValid = await checkValid(newEmail);

      if (!isEmailValid) {
        Alert.alert(
          "Email address is already taken",
          "Use another email address",
        );
        return;
      }
    }

    await updateSettings(newName, newEmail, newPassword);
    refreshContext();
    router.back();
  };

  return (
    <LinearGradient
      colors={["#000000", "#C3A455"]}
      start={{ x: 0.5, y: 0.4 }}
      end={{ x: -0.76, y: -0.54 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <SafeAreaView>
        <Text style={styles.title}>Update Info</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={newName ? newName : ""}
          onChangeText={setNewName}
          placeholder={name}
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={newEmail ? newEmail : ""}
          onChangeText={setNewEmail}
          placeholder={email}
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={newPassword ? newPassword : ""}
          onChangeText={setNewPassword}
          placeholder="••••••••"
          placeholderTextColor="#aaa"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    flexGrow: 1,
    paddingHorizontal: 38,
    backgroundColor: "#F8F8F8",
  },
  backButton: {
    position: "absolute",
    top: 80,
    left: 38,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 40,
    textAlign: "center",
    color: "white",
    fontFamily: Platform.OS === "ios" ? "San Francisco" : undefined,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#F5F5F5",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#efbd3d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
