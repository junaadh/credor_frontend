import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/hooks/context";
import { router } from "expo-router";
import { CredorResponse } from "@/constants/response";

const { width, height } = Dimensions.get("window");

export default function SignInScreen() {
  const [email, setEmail] = React.useState<string | null>(null);
  const [password, setPassword] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen when implemented
    console.log("Forgot password pressed");
  };

  const { login, session } = useSession();

  const handleSignIn = async () => {
    let response: CredorResponse | null = null;
    if (email && password) {
      try {
        response = await login(email, password);

        console.log(response);
        if (response.status === 200 && response.jwt.length !== 0) {
          // Save token if needed, then navigate
          console.log(session);
          router.replace("/(app)/home");
          // router.replace("/");
        } else if (
          response.errorMsg &&
          response.errorMsg.includes("invalid_credentials")
        ) {
          alert("Invalid Credentials");
        } else {
          alert("Login failed");
        }
      } catch (error) {
        alert("Network error");
      }
    }
  };

  const handleRegister = () => {
    router.navigate("/register");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/")
        }
      >
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Sign in</Text>

      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="example@gmail.com"
        placeholderTextColor="#878787"
        value={email ? email : ""}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.inputLine} />

      {/* Password Input */}
      <Text style={styles.passwordLabel}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your password"
          placeholderTextColor="#878787"
          value={password ? password : ""}
          onChangeText={handlePasswordChange}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={handleTogglePassword}
          style={styles.passwordToggle}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#F5F5F5"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputLine} />

      {/* Forgot Password */}
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInButtonText}>Sign in</Text>
      </TouchableOpacity>

      {/* Register Link */}
      <View style={styles.registerLink}>
        <Text style={styles.registerLinkText}>Didn't have an account?</Text>
        <TouchableOpacity
          onPress={handleRegister}
          style={{
            paddingLeft: 5,
          }}
        >
          <Text style={{ color: "#ffff00" }}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: Math.min(38, width * 0.1),
  },
  backButton: {
    position: "absolute",
    top: 80,
    left: Math.min(38, width * 0.1),
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  title: {
    fontSize: Math.min(32, width * 0.08),
    color: "#F5F5F5",
    fontWeight: "bold",
    marginTop: Math.min(173, height * 0.2),
    marginBottom: Math.min(39, height * 0.05),
  },
  label: {
    fontSize: Math.min(16, width * 0.04),
    color: "#F5F5F5",
    fontWeight: "bold",
    marginBottom: Math.min(17, height * 0.02),
  },
  input: {
    fontSize: Math.min(14, width * 0.035),
    color: "#F5F5F5",
    paddingVertical: Math.min(11, height * 0.013),
    paddingHorizontal: 0,
    marginBottom: Math.min(10, height * 0.012),
  },
  inputLine: {
    height: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
    marginBottom: Math.min(39, height * 0.046),
  },
  passwordLabel: {
    fontSize: Math.min(16, width * 0.04),
    color: "#F5F5F5",
    fontWeight: "bold",
    marginBottom: Math.min(17, height * 0.02),
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Math.min(10, height * 0.012),
  },
  passwordInput: {
    flex: 1,
    fontSize: Math.min(14, width * 0.035),
    color: "#F5F5F5",
    paddingVertical: Math.min(11, height * 0.013),
    paddingHorizontal: 0,
  },
  passwordToggle: {
    width: 21,
    height: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPassword: {
    fontSize: Math.min(10, width * 0.025),
    color: "#F12727",
    marginBottom: Math.min(68, height * 0.08),
  },
  signInButton: {
    width: Math.min(212, width * 0.55),
    height: Math.min(38, width * 0.1),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFBD3D",
    alignSelf: "center",
    marginBottom: Math.min(260, height * 0.3),
    shadowColor: "#EFBD3D",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 21.4,
    elevation: 5,
  },
  signInButtonText: {
    fontSize: Math.min(16, width * 0.04),
    color: "#1F1F1F",
    fontWeight: "bold",
  },
  registerLink: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 40,
    alignSelf: "center",
  },
  registerLinkText: {
    fontSize: Math.min(12, width * 0.03),
    color: "#ffffff",
    textAlign: "center",
  },
});
