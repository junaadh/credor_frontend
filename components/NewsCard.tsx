import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { NewsResponseStripped } from "@/hooks/useNews";
import { format } from "date-fns";

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

export default function NewsCard({ item }: { item: NewsResponseStripped }) {
  const parsedDate = parseISOWithMicrosecondsFix(item.publishedAt);
  const formattedDate = format(parsedDate, "PPP p");
  return (
    <TouchableOpacity
      style={styles.newsCard}
      onPress={() => openExternalURL(item.url)}
    >
      <Image
        source={{ uri: item.urlToImage }}
        style={styles.newsImage}
        resizeMode="cover"
      />
      <Text style={styles.newsTitle}>{item.title}</Text>
      <View style={styles.newsFooter}>
        <View style={styles.sourceContainer}>
          <Text style={styles.sourceText}>{item.source}</Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>{formattedDate}</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  newsCard: {
    marginBottom: 30,
  },
  newsImage: {
    width: "100%",
    height: 88,
    borderRadius: 10,
    marginBottom: 12,
  },
  newsTitle: {
    fontFamily: "DMSans-Bold",
    fontSize: 12,
    color: "#F5F5F5",
    marginBottom: 18,
    lineHeight: 16,
  },
  newsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sourceIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 7,
  },
  sourceText: {
    fontFamily: "DMSans-Regular",
    fontSize: 10,
    color: "#F5F5F5",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  statText: {
    fontFamily: "DMSans-Regular",
    fontSize: 10,
    color: "#F5F5F5",
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#595959",
    marginTop: 8,
  },
});
