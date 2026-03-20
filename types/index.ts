export type UploadStatus = 'processing' | 'done' | 'error';

export type BillingCycle = 'monthly' | 'yearly' | 'weekly';

export type SubscriptionCategory =
  | 'entertainment'
  | 'productivity'
  | 'fitness'
  | 'food'
  | 'other';

export interface Upload {
  id: string;
  created_at: string;
  file_name: string;
  file_url: string;
  status: UploadStatus;
  session_id: string;
}

export interface Subscription {
  id: string;
  upload_id: string;
  service_name: string;
  amount: number;
  currency: string;
  billing_cycle: BillingCycle;
  last_charged: string;
  times_charged: number;
  category: SubscriptionCategory;
  is_forgotten: boolean;
  logo_url: string | null;
  cancel_url: string | null;
}

export interface Recommendation {
  service_name: string;
  action: 'cancel' | 'downgrade' | 'keep' | 'negotiate';
  reason: string;
  estimated_savings: number;
}

export interface AIAnalysis {
  id: string;
  upload_id: string;
  total_monthly_burn: number;
  potential_savings: number;
  summary: string;
  recommendations: Recommendation[];
  created_at: string;
}

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
}

export interface SubscriptionDetectionResult {
  subscriptions: Omit<Subscription, 'id' | 'upload_id'>[];
  raw_transactions: ParsedTransaction[];
}

export interface AnalyzeRequest {
  upload_id: string;
  transactions: ParsedTransaction[];
}

export interface AnalyzeResponse {
  subscriptions: Subscription[];
  analysis: AIAnalysis;
}

export interface CancelLetterRequest {
  service_name: string;
  user_name?: string;
  reason?: string;
}

export interface CancelLetterResponse {
  letter: string;
  subject: string;
}
