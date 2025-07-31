import { useSession } from "@/hooks/context";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function LandingScreen() {
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      router.replace("/(app)/home");
    }
  }, [session]);

  const handleRegisterPress = () => {
    console.log(session);
    router.replace("/(auth)/register");
  };

  const handleSignInPress = () => {
    console.log("login pressed");
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Credor</Text>
        <Text style={styles.subtitle}>An AI-Powered Privacy Solution</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRegisterPress}
          >
            <Text style={styles.primaryButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSignInPress}
          >
            <Text style={styles.secondaryButtonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Math.min(20, width * 0.05),
  },
  title: {
    fontSize: Math.min(32, width * 0.08),
    color: "#F5F5F5",
    marginTop: height * 0.2,
    marginBottom: 12,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: Math.min(16, width * 0.04),
    color: "#F5F5F5",
    marginTop: 12,
    textAlign: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    paddingBottom: Math.min(100, height * 0.12),
  },
  primaryButton: {
    width: Math.min(212, width * 0.55),
    height: Math.min(38, width * 0.1),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFBD3D",
    marginBottom: 20,
  },
  primaryButtonText: {
    fontSize: Math.min(16, width * 0.04),
    color: "#1F1F1F",
    fontWeight: "bold",
  },
  secondaryButton: {
    width: Math.min(212, width * 0.55),
    height: Math.min(38, width * 0.1),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#EFBD3D",
  },
  secondaryButtonText: {
    fontSize: Math.min(16, width * 0.04),
    color: "#F5F5F5",
    fontWeight: "bold",
  },
});
