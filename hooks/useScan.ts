import { ScanJob, ScanResult } from "@/constants/Scan";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "./context";

export interface useScanProps {
  completedItems: ScanJob[];
  runningItems: ScanJob[];
  pendingItems: ScanJob[];
  refresh: () => Promise<void>;
  detailedInfo: (job_id: string) => Promise<void>;
  results: ScanResult[];
  startScan: (keyword: string) => Promise<void>;
  isLoading: boolean;
}

export const useScan = (): useScanProps => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { session } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allItems, setAllItems] = useState<ScanJob[]>([]);
  const [results, setResults] = useState<ScanResult[]>([]);

  const completedItems = useMemo<ScanJob[]>(
    () => allItems.filter((item) => item.status === "completed"),
    [allItems],
  );

  const runningItems = useMemo<ScanJob[]>(
    () => allItems.filter((item) => item.status === "running"),
    [allItems],
  );

  const pendingItems = useMemo<ScanJob[]>(
    () => allItems.filter((item) => item.status === "pending"),
    [allItems],
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/user/scan/history`, {
        method: "GET",
        headers: { Authorization: `Bearer ${session?.jwt}` },
      });
      if (!res.ok) throw new Error("Failed to fetch scan history");
      const rawData = await res.json();
      const simplifiedData: ScanJob[] = rawData.map((item: any) => ({
        job_id: item.job_id,
        user_id: item.user_id,
        status: item.status,
        timestamp: item.created_at,
      }));
      setAllItems(simplifiedData);
    } catch (err) {
      console.error("refreshItems error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const detailedInfo = useCallback(async (job_id: string): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/user/scan/${job_id}/results`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.jwt}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch scan history");
      const rawData = await res.json();
      const parsedRes = rawData.map((item: any) => ({
        result_id: item.result_id,
        job_id: item.job_id,
        confidence: item.confidence,
        label: item.label,
        detected_at: item.detected_at,
        media_url: item.media_url,
        post_url: item.post_url,
      }));
      setResults(parsedRes);
    } catch (err) {
      console.error("refreshItems error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startScan = useCallback(async (keyword: string): Promise<void> => {
    setIsLoading(true);
    try {
      const payload = { target: keyword };
      const res = await fetch(`${apiUrl}/api/user/scan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to fetch scan history");

      await refresh();
    } catch (err) {
      console.error("refreshItems error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    completedItems,
    runningItems,
    pendingItems,
    refresh,
    startScan,
    detailedInfo,
    results,
    isLoading,
  };
};
