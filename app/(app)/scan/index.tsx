import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Text,
  RefreshControl,
  Modal,
  FlatList,
  Linking,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HistoryItem from "@/components/HistoryCard";
import { Ionicons } from "@expo/vector-icons";
import { ScanJob } from "@/constants/Scan";
import { useScan } from "@/hooks/useScan";
import { useSession } from "@/hooks/context";
const { width } = Dimensions.get("window");

const filters = ["All", "Political", "Meme", "NSFW"];

const openExternalURL = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url); // Opens in external browser
  } else {
    console.warn("Can't open URL:", url);
  }
};

export default function ScanScreen() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selected, setSelected] = useState<ScanJob | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const {
    completedItems,
    pendingItems,
    runningItems,
    refresh,
    startScan,
    detailedInfo,
    results,
    isLoading,
  } = useScan();

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (selected) {
      detailedInfo(selected.job_id);
    }
  }, [selected, setSelected]);

  const onScan = () => {
    startScan("deepfake");
  };

  const { session } = useSession();

  return (
    <LinearGradient
      colors={["#000000", "#C3A455"]}
      start={{ x: 0.5, y: 0.4 }}
      end={{ x: -0.76, y: -0.54 }}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} />
        }
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#ADADAD"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={21} color="#FFFFFF" />
        </View>

        <View style={styles.scanSection}>
          <View style={styles.scanCircle2}>
            <View style={styles.scanCircle1}>
              <TouchableOpacity style={styles.scanButton} onPress={onScan}>
                <Ionicons name="scan" size={60} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.scanText}>SCAN</Text>
        </View>

        {/*        <ActionButtons
          primaryButton
          primaryText="Update Scan"
          onPrimaryPress={() => navigation.navigate("FacialScan")}
        />
*/}
        <View style={styles.filterBar}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
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
                    : `${(item.confidence * 100).toFixed(2)}%`}
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
    // paddingBottom: 100,
  },
  scrollView: {
    flex: 1,
    height: "120%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 38,
    marginTop: 78,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 19,
    height: 35,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    marginRight: 10,
  },
  scanSection: {
    alignItems: "center",
    marginTop: 52,
  },
  scanCircle2: {
    width: 217,
    height: 217,
    borderRadius: 108.5,
    backgroundColor: "rgba(239, 189, 61, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanCircle1: {
    width: 197,
    height: 197,
    borderRadius: 98.5,
    backgroundColor: "rgba(239, 189, 61, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButton: {
    width: 152,
    height: 152,
    borderRadius: 76,
    backgroundColor: "#EFBD3D",
    justifyContent: "center",
    alignItems: "center",
  },
  scanText: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    color: "#F5F5F5",
    marginTop: 20,
  },
  filterBar: {
    flexDirection: "row",
    marginTop: 40,
    height: 54,
    backgroundColor: "#202020",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  filterButton: {
    marginRight: 23,
    height: 37,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  filterButtonActive: {
    backgroundColor: "#EFBD3D",
    borderRadius: 10,
  },
  filterText: {
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    color: "#9D9D9D",
  },
  filterTextActive: {
    color: "#000000",
    fontFamily: "DMSans-Bold",
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
