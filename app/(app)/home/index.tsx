import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/hooks/context";
import { useNews } from "@/hooks/useNews";
import { router } from "expo-router";
import { format } from "date-fns";

const { width, height } = Dimensions.get("window");

const openExternalURL = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url); // Opens in external browser
  } else {
    console.warn("Can't open URL:", url);
  }
};

function parseISOWithMicrosecondsFix(timestamp: string): Date {
  // Example: "2025-07-27T17:11:42.324296Z" -> "2025-07-27T17:11:42.324Z"
  const fixed = timestamp.replace(/(\.\d{3})\d+Z$/, "$1Z");
  return new Date(fixed);
}

export default function HomeScreen() {
  const { news } = useNews();

  const handleQuickScanPress = () => {
    router.push("/(app)/home/facialScan");
  };

  const { session } = useSession();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Profile */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={require("../../../assets/images/credor.png")}
              style={styles.profileImage}
            />
            <Text style={styles.greeting}>{`Hi ${session?.name}!`}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
          ></TouchableOpacity>
        </View>

        {/* Quick Scan Section */}
        <View style={styles.quickScanSection}>
          <Text style={styles.quickScanTitle}>Quick Scan</Text>

          {/* Scan Circle */}
          <View style={styles.scanCircleContainer}>
            <View style={styles.scanCircleOuter}>
              <View style={styles.scanCircleMiddle}>
                <TouchableOpacity
                  style={styles.scanCircleInner}
                  onPress={handleQuickScanPress}
                >
                  <Ionicons name="scan" size={48} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.scanText}>SCAN</Text>
            <Text style={styles.scanSubtext}>Click for Quick Scan</Text>
          </View>
        </View>

        {/* News Section */}
        <View style={styles.newsSection}>
          <Text style={styles.newsTitle}>Latest News</Text>

          {/* News Card */}
          {news && news[0] && (
            <TouchableOpacity
              style={styles.newsCard}
              onPress={() => openExternalURL(news[0].url)}
            >
              <View style={styles.newsImageContainer}>
                <Image
                  source={{ uri: news[0].urlToImage }}
                  style={styles.newsImage}
                  resizeMode="cover"
                />
                <View style={styles.newsImageOverlay} />
              </View>

              <View style={styles.newsContent}>
                <View style={styles.newsHeader}>
                  <Text style={styles.newsSource}>{news[0].source}</Text>
                  <View style={styles.newsActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="share" size={16} color="#878787" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.newsTime}>
                    {format(
                      parseISOWithMicrosecondsFix(news[0].publishedAt),
                      "PPP p",
                    )}
                  </Text>
                </View>

                <Text style={styles.newsHeadline}>{news[0].title}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Math.min(38, width * 0.1),
    paddingTop: Math.min(79, height * 0.093),
    paddingBottom: Math.min(20, height * 0.023),
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: Math.min(30, width * 0.076),
    height: Math.min(30, width * 0.076),
    borderRadius: 15,
    marginRight: Math.min(9, width * 0.023),
  },
  greeting: {
    fontSize: Math.min(16, width * 0.041),
    color: "#F5F5F5",
    fontWeight: "bold",
  },
  notificationButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 1,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EFBD3D",
    borderWidth: 1.5,
    borderColor: "#1B170C",
  },
  quickScanSection: {
    alignItems: "center",
    paddingTop: Math.min(20, height * 0.023),
  },
  quickScanTitle: {
    fontSize: Math.min(16, width * 0.041),
    color: "#000000",
    fontWeight: "bold",
    marginBottom: Math.min(20, height * 0.023),
  },
  scanCircleContainer: {
    alignItems: "center",
  },
  scanCircleOuter: {
    width: Math.min(193, width * 0.491),
    height: Math.min(193, width * 0.491),
    borderRadius: Math.min(96.5, width * 0.245),
    backgroundColor: "rgba(239, 189, 61, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanCircleMiddle: {
    width: Math.min(175, width * 0.445),
    height: Math.min(175, width * 0.445),
    borderRadius: Math.min(87.5, width * 0.223),
    backgroundColor: "rgba(239, 189, 61, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanCircleInner: {
    width: Math.min(136, width * 0.346),
    height: Math.min(136, width * 0.346),
    borderRadius: Math.min(68, width * 0.173),
    backgroundColor: "#EFBD3D",
    justifyContent: "center",
    alignItems: "center",
  },
  scanText: {
    fontSize: Math.min(16, width * 0.041),
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: Math.min(20, height * 0.023),
  },
  scanSubtext: {
    fontSize: Math.min(14, width * 0.036),
    color: "#858585",
    marginTop: Math.min(8, height * 0.009),
  },
  newsSection: {
    paddingHorizontal: Math.min(38, width * 0.1),
    paddingTop: Math.min(37, height * 0.043),
  },
  newsTitle: {
    fontSize: Math.min(16, width * 0.041),
    color: "#F5F5F5",
    fontWeight: "bold",
    marginBottom: Math.min(20, height * 0.023),
  },
  newsCard: {
    backgroundColor: "rgba(246, 240, 231, 0.15)",
    borderRadius: 30,
    overflow: "hidden",
  },
  newsImageContainer: {
    position: "relative",
    height: Math.min(172, height * 0.202),
  },
  newsImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#333333",
  },
  newsImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  newsContent: {
    padding: Math.min(20, width * 0.051),
  },
  newsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Math.min(10, height * 0.012),
  },
  newsSourceImage: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: Math.min(7, width * 0.018),
  },
  newsSource: {
    fontSize: Math.min(10, width * 0.025),
    color: "#F5F5F5",
    flex: 1,
  },
  newsActions: {
    flexDirection: "row",
    marginRight: Math.min(15, width * 0.038),
  },
  actionButton: {
    marginRight: Math.min(8, width * 0.02),
  },
  newsViews: {
    fontSize: Math.min(10, width * 0.025),
    color: "#F5F5F5",
    marginRight: Math.min(10, width * 0.025),
  },
  newsTime: {
    fontSize: Math.min(10, width * 0.025),
    color: "#F5F5F5",
  },
  newsHeadline: {
    fontSize: Math.min(12, width * 0.031),
    color: "#F5F5F5",
    fontWeight: "bold",
    lineHeight: Math.min(16, width * 0.041),
    marginBottom: Math.min(15, height * 0.018),
  },
  newsPagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  paginationDot: {
    width: Math.min(6.32, width * 0.016),
    height: Math.min(6.32, width * 0.016),
    borderRadius: Math.min(3.16, width * 0.008),
    backgroundColor: "#878787",
    marginHorizontal: Math.min(4, width * 0.01),
  },
  paginationBar: {
    width: Math.min(18.97, width * 0.048),
    height: Math.min(6.32, width * 0.016),
    borderRadius: Math.min(3.16, width * 0.008),
    backgroundColor: "#D9D9D9",
    marginHorizontal: Math.min(4, width * 0.01),
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(246, 240, 231, 0.15)",
    paddingVertical: Math.min(20, height * 0.023),
    paddingHorizontal: Math.min(60, width * 0.153),
  },
  navButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
