import React from "react";
import {
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import NewsCard from "@/components/NewsCard";
import Header from "@/components/Header";
import { useNews } from "@/hooks/useNews";
const { width } = Dimensions.get("window");

export default function NewsScreen() {
  const { news, loading, refresh } = useNews();

  return (
    <LinearGradient
      colors={["#000000", "#C3A455"]}
      start={{ x: 0.5, y: 0.4 }}
      end={{ x: -0.76, y: -0.54 }}
      style={styles.container}
    >
      <SafeAreaView>
        <Header title="News" />
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <FlatList
              data={news ? news : []}
              renderItem={({ item }) => <NewsCard item={item} />}
              onRefresh={refresh}
              refreshing={loading}
            />
          </>
        )}
      </SafeAreaView>
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
  newsList: {
    paddingHorizontal: 0,
  },
});
