import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/hooks/context";
import { CredorResponse } from "@/constants/response";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function RegisterScreen() {
  const [name, setName] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string | null>(null);
  const [password, setPassword] = React.useState<string | null>(null);
  const [gender, setGender] = React.useState<"male" | "female">("male");
  const [day, setDay] = React.useState<string | null>(null);
  const [month, setMonth] = React.useState<string | null>(null);
  const [year, setYear] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const { register } = useSession();

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleGenderSelect = (selectedGender: "male" | "female") => {
    setGender(selectedGender);
  };

  const handleYearSelect = (year: string) => {
    const currentYear = new Date().getFullYear(); // e.g. 2025
    return currentYear - parseInt(year, 10);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleNextPress = async () => {
    if (email && password && gender && day && month && year && name) {
      if (!validateEmail(email)) {
        alert("Email Address is invalid");
        return;
      }

      const age = handleYearSelect(year);
      let response: CredorResponse | null = null;
      try {
        response = await register(name, age, gender, email, password);
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        alert("invalid response from server");
      }
      if (response && response.status === 200 && response.jwt.length != 0) {
        router.replace("/(app)/home");
      } else if (
        response &&
        response.status === 500 &&
        response.errorMsg &&
        response.errorMsg.includes("user_already_exists")
      ) {
        alert("Email Address already taken");
        return;
      } else {
        alert("Registration failed");
        return;
      }
    } else {
      alert("Please fill all fields");
    }
  };

  const handleSignInPress = () => {
    router.push("/(auth)/login");
  };

  const handleBackPress = () => {
    router.canGoBack() ? router.back() : router.replace("/");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Register</Text>

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

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="name"
          placeholderTextColor="#878787"
          value={name ? name : ""}
          onChangeText={setName}
          keyboardType="default"
          autoCapitalize="none"
        />
        <View style={styles.inputLine} />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Minimum 8 characters"
            placeholderTextColor="#878787"
            value={password ? password : ""}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
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

        {/* Gender Selector */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => handleGenderSelect("male")}
          >
            <View
              style={[
                styles.radioButton,
                gender === "male" && styles.radioButtonSelected,
              ]}
            >
              {gender === "male" && <View style={styles.radioButtonInner} />}
            </View>
            <Text
              style={[
                styles.genderText,
                gender === "male" && styles.genderTextSelected,
              ]}
            >
              Male
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => handleGenderSelect("female")}
          >
            <View
              style={[
                styles.radioButton,
                gender === "female" && styles.radioButtonSelected,
              ]}
            >
              {gender === "female" && <View style={styles.radioButtonInner} />}
            </View>
            <Text
              style={[
                styles.genderText,
                gender === "female" && styles.genderTextSelected,
              ]}
            >
              Female
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputLine} />

        {/* Date of Birth */}
        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.dateContainer}>
          <TextInput
            style={styles.dateInput}
            placeholder="DD"
            placeholderTextColor="#878787"
            value={day ? day : ""}
            onChangeText={setDay}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text style={styles.dateSeparator}>/</Text>
          <TextInput
            style={styles.dateInput}
            placeholder="MM"
            placeholderTextColor="#878787"
            value={month ? month : ""}
            onChangeText={setMonth}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text style={styles.dateSeparator}>/</Text>
          <TextInput
            style={styles.dateInput}
            placeholder="YYYY"
            placeholderTextColor="#878787"
            value={year ? year : ""}
            onChangeText={setYear}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
        <View style={styles.inputLine} />

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.signInLink}>
          <Text style={styles.signInLinkText}>Already have an account?</Text>
          <TouchableOpacity
            style={{ paddingLeft: 5 }}
            onPress={handleSignInPress}
          >
            <Text style={{ color: "#ffff00", fontSize: 12 }}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Math.min(38, width * 0.1),
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
    fontSize: Math.min(32, width * 0.08),
    color: "#F5F5F5",
    fontWeight: "bold",
    marginTop: Math.min(98, height * 0.115),
    marginBottom: Math.min(39, height * 0.046),
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
  genderContainer: {
    flexDirection: "row",
    marginBottom: Math.min(10, height * 0.012),
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Math.min(50, width * 0.13),
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#878787",
    marginRight: Math.min(15, width * 0.04),
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#EFBD3D",
    backgroundColor: "#EFBD3D",
  },
  radioButtonInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#000000",
  },
  genderText: {
    fontSize: Math.min(14, width * 0.035),
    color: "#878787",
  },
  genderTextSelected: {
    color: "#F5F5F5",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Math.min(10, height * 0.012),
  },
  dateInput: {
    fontSize: Math.min(14, width * 0.035),
    color: "#F5F5F5",
    paddingVertical: Math.min(11, height * 0.013),
    paddingHorizontal: 0,
    minWidth: Math.min(40, width * 0.1),
  },
  dateSeparator: {
    fontSize: Math.min(14, width * 0.035),
    color: "#F5F5F5",
    marginHorizontal: Math.min(8, width * 0.02),
  },
  nextButton: {
    width: Math.min(212, width * 0.55),
    height: Math.min(38, width * 0.1),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFBD3D",
    alignSelf: "center",
    marginTop: Math.min(52, height * 0.061),
    marginBottom: Math.min(51, height * 0.06),
    shadowColor: "#EFBD3D",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 21.4,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: Math.min(16, width * 0.04),
    color: "#1F1F1F",
    fontWeight: "bold",
  },
  signInLink: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: Math.min(50, height * 0.059),
  },
  signInLinkText: {
    fontSize: Math.min(12, width * 0.03),
    color: "#ffffff",
    textAlign: "center",
  },
});
