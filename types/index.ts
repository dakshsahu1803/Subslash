export type UploadStatus = 'processing' | 'done' | 'error';

export type BillingCycle = 'monthly' | 'yearly' | 'weekly';

export type SubscriptionCategory =
  | 'entertainment'
  | 'productivity'
  | 'fitness'
  | 'food'
  | 'utilities'
  | 'education'
  | 'other';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

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
  is_cancelled: boolean;
  next_renewal: string | null;
  price_increased: boolean;
  original_amount: number | null;
  is_manually_added: boolean;
  notes: string | null;
  lifetime_spent: number;
  session_id: string;
  confidence: ConfidenceLevel;
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
  duplicate_groups: string[][];
  category_breakdown: Record<string, number>;
  total_yearly_projection: number;
  potential_yearly_savings: number;
  top_recommendation: string;
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

// --- Notification types ---

export type NotificationType =
  | 'renewal_reminder'
  | 'forgotten_alert'
  | 'price_increase'
  | 'savings_tip'
  | 'trial_expiry'
  | 'audit_reminder';

export interface Notification {
  id: string;
  session_id: string;
  type: NotificationType;
  title: string;
  message: string;
  service_name: string | null;
  is_read: boolean;
  created_at: string;
}

// --- Score types ---

export interface ScoreBreakdown {
  label: string;
  deduction: number;
  detail: string;
}

export interface SubscriptionScore {
  score: number;
  grade: string;
  breakdown: ScoreBreakdown[];
  insight: string;
}

// --- Alternatives & Family Plans ---

export interface Alternative {
  free: string[];
  cheaper: string[];
  tip: string;
}

export interface FamilyPlan {
  solo_price: number;
  family_price: number;
  max_members: number;
  price_per_person: number;
  saving_per_person: number;
}

// --- Feedback ---

export interface Feedback {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  created_at: string;
}

// --- User Settings (localStorage) ---

export interface NotificationPrefs {
  renewal_reminders: boolean;
  price_increase_alerts: boolean;
  savings_tips: boolean;
  audit_reminder: boolean;
  trial_expiry: boolean;
  reminder_days_before: number;
}

export interface UserSettings {
  name: string;
  email: string;
  currency: 'INR' | 'USD' | 'EUR';
  default_cycle: BillingCycle;
  date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY';
  compact_view: boolean;
  notification_prefs: NotificationPrefs;
}

// --- Budget ---

export interface BudgetConfig {
  category: string;
  limit: number;
}

// --- Charge events for heatmap/timeline ---

export interface ChargeEvent {
  date: string;
  service_name: string;
  amount: number;
  category: SubscriptionCategory;
}
