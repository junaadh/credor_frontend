import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Header({
  title,
  subtitle,
  showBackButton = false,
  showLogo = false,
}: {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
}) {
  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {showLogo && (
        <Image
          source={require("../assets/images/credor.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      )}

      {title && <Text style={styles.title}>{title}</Text>}

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingHorizontal: Math.min(20, width * 0.05),
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: Math.min(50, height * 0.06),
    left: Math.min(20, width * 0.05),
    width: 40,
    height: 40,
    justifyContent: "center",
    zIndex: 1,
  },
  logo: {
    width: Math.min(238, width * 0.6),
    height: Math.min(201, height * 0.25),
    marginTop: height * 0.2,
  },
  title: {
    fontFamily: "DMSans-Bold",
    fontSize: Math.min(32, width * 0.08),
    color: "#F5F5F5",
    marginTop: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: "DMSans-Regular",
    fontSize: Math.min(16, width * 0.04),
    color: "#F5F5F5",
    marginTop: 12,
    textAlign: "center",
  },
});
