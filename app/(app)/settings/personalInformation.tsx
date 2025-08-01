import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSession } from "@/hooks/context";
import { useSettings } from "@/hooks/useSettings";

export default function PersonalInformationScreen() {
  const { delete: delete_, logout } = useSession();
  const { name, age, email } = useSettings();

  const handleBackPress = () => {
    router.back();
  };

  const handleChangeName = () => {
    router.push("/(app)/settings/changeName");
  };

  const handleChangeEmail = () => {
    router.push("/(app)/settings/changeEmail");
  };

  const handleChangeDateOfBirth = () => {
    router.push("/(app)/settings/changeAge");
  };

  const handleChangePassword = () => {
    router.push("/(app)/settings/changePassword");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await delete_();
              logout();
            } catch (err) {
              console.log("failed to delete user", err);
              Alert.alert("Error", "Failed to delete user");
            }
          },
        },
      ],
      { cancelable: true },
    );
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
              <Text style={styles.title}>Personal Information</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            Update Application and Profile settings here.
          </Text>

          {/* Profile Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <View style={styles.divider} />

            {/* Name */}
            <View style={styles.fieldContainer}>
              <Text
                style={styles.fieldLabel}
              >{`Name: ${name.slice(0, 20)}`}</Text>
              <TouchableOpacity
                onPress={handleChangeName}
                style={styles.changeButton}
              >
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text
                style={styles.fieldLabel}
              >{`Email: ${email.slice(0, 20)}`}</Text>
              <TouchableOpacity
                onPress={handleChangeEmail}
                style={styles.changeButton}
              >
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* Age */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>{`Age: ${age}`}</Text>
              <TouchableOpacity
                onPress={handleChangeDateOfBirth}
                style={styles.changeButton}
              >
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Security Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <View style={styles.divider} />

            {/* Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TouchableOpacity
                onPress={handleChangePassword}
                style={styles.changeButton}
              >
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleDeleteAccount}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete Account</Text>
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
    paddingHorizontal: 38,
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
    fontSize: 30,
    fontWeight: "600",
    color: "#F5F5F5",
    lineHeight: 42,
  },
  description: {
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    fontWeight: "400",
    color: "#F5F5F5",
    lineHeight: 18,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#F5F5F5",
    lineHeight: 21,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#595959",
    marginBottom: 20,
  },
  fieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  fieldLabel: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#F5F5F5",
    lineHeight: 21,
  },
  changeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  changeText: {
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    fontWeight: "400",
    color: "#878787",
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 16,
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 40,
  },
  deleteButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F11111",
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
  deleteButtonText: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#1F1F1F",
    lineHeight: 21,
  },
});
