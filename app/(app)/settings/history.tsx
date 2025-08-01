import React, { useEffect, useState } from "react";
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
  Modal,
  FlatList,
  Image,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSettings } from "@/hooks/useSettings";
import { useSession } from "@/hooks/context";
import { ScanJob } from "@/constants/Scan";
import { useScan } from "@/hooks/useScan";
import HistoryItem from "@/components/HistoryCard";

const { width } = Dimensions.get("window");

async function openBlueskyPost(uri: string) {
  const parts = uri.split("/");
  const did = parts[2];
  const rkey = parts[4];

  const res = await fetch(`https://plc.directory/${did}`);
  const data = await res.json();
  const handle = data.alsoKnownAs?.[0]?.replace("at://", "");

  if (!handle) {
    throw new Error("Could not resolve handle");
  }

  const url = `https://bsky.app/profile/${handle}/post/${rkey}`;
  return url;
}

const openExternalURL = async (url: string) => {
  const uri = await openBlueskyPost(url);
  console.log(uri);
  const supported = await Linking.canOpenURL(uri);
  if (supported) {
    await Linking.openURL(uri); // Opens in external browser
  } else {
    console.warn("Can't open URL:", uri);
  }
};

export default function ChangeHistoryScreen() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selected, setSelected] = useState<ScanJob | null>(null);

  const {
    completedItems,
    pendingItems,
    runningItems,
    refresh,
    detailedInfo,
    results,
    isLoading,
  } = useScan();

  const handleBackPress = () => {
    router.back();
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (selected) {
      detailedInfo(selected.job_id);
    }
  }, [selected, setSelected]);

  const { session } = useSession();

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
              <Text style={styles.title}>History</Text>
            </View>
          </View>

          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>In Progress</Text>
            {pendingItems.map((item) => (
              <HistoryItem
                key={item.job_id}
                item={item}
                onPress={() => {
                  setSelected(item);
                  setShowModal(true);
                }}
              />
            ))}
            {runningItems.map((item) => (
              <HistoryItem
                key={item.job_id}
                item={item}
                onPress={() => {
                  setSelected(item);
                  setShowModal(true);
                }}
              />
            ))}

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>History</Text>
            {completedItems.map((item) => (
              <HistoryItem
                key={item.job_id}
                item={item}
                onPress={() => {
                  setSelected(item);
                  setShowModal(true);
                }}
              />
            ))}
          </View>
        </SafeAreaView>
      </ScrollView>
      <Modal
        visible={showModal && selected !== null}
        onRequestClose={() => setShowModal(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <LinearGradient
          colors={["#000000", "#C3A455"]}
          start={{ x: 0.5, y: 0.4 }}
          end={{ x: -0.76, y: -0.54 }}
          style={{
            flex: 1,
            paddingHorizontal: 20,
            alignItems: "center",
            paddingBottom: 38,
            paddingTop: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Scan Results for job:
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            {selected?.job_id}
          </Text>
          <FlatList
            style={{ width: "100%" }}
            data={results}
            numColumns={2}
            keyExtractor={(res) => res.result_id}
            refreshing={isLoading}
            onRefresh={() => {
              detailedInfo(selected?.job_id!);
            }}
            contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
            columnWrapperStyle={{ gap: 12, justifyContent: "space-between" }}
            ListEmptyComponent={
              <Text
                style={{
                  color: isLoading ? "#fff" : "#aaa",
                  textAlign: "center",
                }}
              >
                {isLoading ? "Loading..." : "No results found"}
              </Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  backgroundColor: "#1E1E1E",
                  borderRadius: 12,
                  padding: 12,
                  flex: 1,
                }}
                onPress={() => openExternalURL(item.post_url)}
              >
                <Image
                  source={{ uri: item.media_url }}
                  style={{
                    width: "100%",
                    height: 120,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                  resizeMode="cover"
                />
                <Text style={{ color: "#EFBD3D", fontWeight: "bold" }}>
                  {(item.label || "Unknown Label") === "not_match"
                    ? `Not ${session?.name}`
                    : item.label || "Unknown Label"}
                </Text>
                <Text style={{ color: "#ccc", marginTop: 4 }}>
                  Confidence:
                  {item.confidence === -1.0
                    ? "100%"
                    : `${(item.confidence).toFixed(2)}%`}
                </Text>
                <Text style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                  Detected At:
                  {item.detected_at
                    ? new Date(item.detected_at).toLocaleString()
                    : "Unknown"}
                </Text>
              </TouchableOpacity>
            )}
          />
        </LinearGradient>
      </Modal>
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
  historySection: {
    marginTop: 30,
    // paddingHorizontal: 38,
  },
  sectionTitle: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    color: "#F5F5F5",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#595959",
    marginVertical: 20,
  },
});
