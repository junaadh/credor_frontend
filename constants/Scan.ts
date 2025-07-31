export interface ScanResult {
  result_id: string;
  job_id: string;
  confidence: number;
  label: string;
  detected_at: string;
  media_url: string;
  post_url: string;
}

export interface ScanJob {
  job_id: string;
  user_id: string;
  status: string;
  timestamp: string;
}
