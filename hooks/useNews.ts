import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";

export type NewsArticle = {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};

export type NewsResponse = {
  status: "ok" | string;
  totalResults: number;
  articles: NewsArticle[];
};

export type NewsResponseStripped = {
  source: string;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
};

const CACHE_KEY = "cached_news";
const LAST_FETCHED_KEY = "last_fetched_news";
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export const saveNewsCache = async (articles: NewsResponseStripped[]) => {
  try {
    const json = JSON.stringify(articles);
    await AsyncStorage.setItem(CACHE_KEY, json);
    await AsyncStorage.setItem(LAST_FETCHED_KEY, new Date().toISOString());
  } catch (err) {
    console.error("Failed to save news cache", err);
  }
};

export const getNewsCache = async (): Promise<
  NewsResponseStripped[] | null
> => {
  try {
    const json = await AsyncStorage.getItem(CACHE_KEY);
    return json ? JSON.parse(json) : null;
  } catch (err) {
    console.error("Failed to load news cache", err);
    return null;
  }
};

const fetchNewsStories = async (): Promise<NewsResponseStripped[]> => {
  const apiKey = process.env.EXPO_PUBLIC_NEWS_KEY;
  if (!apiKey) {
    throw new Error("NEWS_KEY environment variable is not set");
  }

  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const from = oneWeekAgo.toISOString().split("T")[0];
  const to = new Date(today.setDate(today.getDate() - 1))
    .toISOString()
    .split("T")[0];

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", "cybersecurity");
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);
  url.searchParams.set("sortBy", "popularity");
  url.searchParams.set("apiKey", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch news: ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.articles) {
    return [];
  }

  return data.articles.map(
    (article: any): NewsResponseStripped => ({
      source: article.source?.name ?? "Unknown",
      author: article.author,
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
    }),
  );
};

export const getLastFetchedTime = async (): Promise<string | null> => {
  return AsyncStorage.getItem(LAST_FETCHED_KEY);
};

export const useNews = () => {
  const [news, setNews] = useState<NewsResponseStripped[] | null>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<number | null>(null);

  const scheduleNextFetch = (from: string) => {
    const last = new Date(from).getTime();
    const now = Date.now();
    const delay = Math.max(0, TWO_HOURS_MS - (now - last));

    console.log(`Next refresh in ${delay / 1000}s`);

    timerRef.current = setTimeout(() => {
      refreshNews();
    }, delay);
  };

  const refreshNews = async () => {
    setLoading(true);
    try {
      const freshNews = await fetchNewsStories();
      setNews(freshNews);
      await saveNewsCache(freshNews);
      scheduleNextFetch(new Date().toISOString());
    } catch (err) {
      console.error("Failed to fetch latest news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const [cachedNews, lastFetched] = await Promise.all([
        getNewsCache(),
        getLastFetchedTime(),
      ]);

      if (!mounted) return;

      if (cachedNews) setNews(cachedNews);

      if (lastFetched) {
        const time = new Date(lastFetched).getTime();
        const expired = Date.now() - time > TWO_HOURS_MS;

        if (expired) {
          await refreshNews();
        } else {
          scheduleNextFetch(lastFetched);
          setLoading(false);
        }
      } else {
        await refreshNews();
      }
    };

    init();

    return () => {
      mounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { news, loading, refresh: refreshNews };
};
