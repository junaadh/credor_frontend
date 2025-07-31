import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ScanJob } from "@/constants/Scan";
import { format } from "date-fns";

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return { backgroundColor: "#4CAF50" }; // Green
    case "pending":
      return { backgroundColor: "#FF9800" }; // Orange
    case "failed":
      return { backgroundColor: "#F44336" }; // Red
    default:
      return { backgroundColor: "#9E9E9E" }; // Grey
  }
}

function parseISOWithMicrosecondsFix(timestamp?: string): Date | null {
  if (!timestamp) return null;
  // Example: "2025-07-27T17:11:42.324296Z" -> "2025-07-27T17:11:42.324Z"
  const fixed = timestamp.replace(/(\.\d{3})\d+Z$/, "$1Z");
  return new Date(fixed);
}

export default function HistoryItem({
  item,
  onPress,
}: {
  item: ScanJob;
  onPress?: () => void;
}) {
  const parsedDate = parseISOWithMicrosecondsFix(item.timestamp);
  const formattedDate = parsedDate
    ? format(parsedDate, "PPP p")
    : item.timestamp; // e.g., "Jul 27, 2025 at 4:15 PM"

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.cardContent}>
        <View style={styles.left}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.jobId}>Job: {item.job_id.slice(0, 10)}...</Text>
        </View>
        <View style={styles.right}>
          <View style={[styles.statusBadge, getStatusColor(item.status)]}>
            <Text style={styles.statusText}>
              {item.status.length !== 9
                ? `${" ".repeat((9 - item.status.length) / 2)}${item.status}${" ".repeat((9 - item.status.length) / 2)}`
                : item.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "column",
  },
  date: {
    fontSize: 13,
    color: "#AAA",
    fontFamily: "DMSans-Regular",
    marginBottom: 4,
  },
  jobId: {
    fontSize: 15,
    color: "#F5F5F5",
    fontFamily: "DMSans-Bold",
  },
  right: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "DMSans-Bold",
    color: "#1E1E1E",
    textTransform: "capitalize",
  },
});
