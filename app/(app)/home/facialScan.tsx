import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSession } from "@/hooks/context";

export default function FacialScanScreen() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [persmission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const cameraRef = useRef<CameraView | null>(null);

  if (!persmission) {
    return <View />;
  }

  if (!persmission.granted) {
    console.log("requesting permssions");
    requestPermission();
  }

  const handleScan = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: false,
        quality: 1,
      });

      console.log("Photo taken:", photo.uri);

      Alert.alert("Image Captured", "Continue processing picture or retake?", [
        {
          text: "Continue",
          onPress: () => uploadPhoto(photo.uri),
        },
        {
          text: "Retake",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Failed to take photo", error);
    }
  };

  const { session } = useSession();

  const uploadPhoto = async (uri: string) => {
    setIsProcessing(true);

    try {
      const extension = uri.split(".").pop()?.toLowerCase();
      const contentType =
        extension === "png"
          ? "image/png"
          : extension === "jpg" || extension === "jpeg"
            ? "image/jpeg"
            : "application/octet-stream"; // fallback

      const blob = await (await fetch(uri)).blob();

      const response = await fetch(`${apiUrl}/api/user/bucket`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.jwt}`,
          "Content-Type": contentType,
        },
        body: blob,
      });

      const json = await response.json();
      console.log("Server response:", json);

      // Navigate back or show result
      router.back();
    } catch (error) {
      console.error("Upload failed", error);
      Alert.alert("Error", "Failed to upload image.");
    } finally {
      setIsProcessing(false);
    }
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

      <Text style={styles.title}>Facial Scan</Text>
      <Text style={styles.subtitle}>
        The image should be clear and have your face fully in the frame
      </Text>

      {isProcessing ? (
        <ActivityIndicator style={{ marginTop: 200 }} />
      ) : (
        <>
          <TouchableOpacity style={styles.cameraContainer} onPress={handleScan}>
            <CameraView ref={cameraRef} style={styles.camera} facing="front" />
          </TouchableOpacity>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 110,
    paddingHorizontal: 38,
    backgroundColor: "#000000",
  },
  backButton: {
    position: "absolute",
    top: 80,
    left: 24,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontFamily: "DMSans-Bold",
    fontSize: 32,
    color: "#F5F5F5",
    textAlign: "left",
    marginTop: 30,
  },
  subtitle: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    color: "#F5F5F5",
    textAlign: "left",
    marginTop: 10,
    marginBottom: 0,
  },
  cameraContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "75%",
    borderRadius: 150, // oval shape
    overflow: "hidden",
    backgroundColor: "#333",
  },
});
