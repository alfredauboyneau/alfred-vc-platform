import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la base de données
export type VentureCapital = {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  website: string;
  sectors: string[];
  stages: string[];
  ticket_min: number;
  ticket_max: number;
  investment_thesis: string;
  notable_investments: string | null;
  contact_email: string;
  created_at: string;
};

export type Startup = {
  id: string;
  name: string;
  tagline: string;
  website: string | null;
  logo_url: string | null;
  sector: string;
  stage: string;
  amount_sought: number;
  founded_year: number;
  team_size: number;
  mrr: number | null;
  arr: number | null;
  growth_mom: number | null;
  burn_rate: number | null;
  runway_months: number | null;
  cac: number | null;
  ltv: number | null;
  gross_margin: number | null;
  active_customers: number | null;
  revenue_last_year: number | null;
  problem: string;
  solution: string;
  market_size: string;
  traction: string;
  pitch_deck_url: string | null;
  contact_email: string;
  user_id: string | null;
  financial_analysis: FinancialAnalysis | null;
  created_at: string;
};

export type FinancialAnalysis = {
  financial_health_score: number;
  growth_trajectory: "weak" | "moderate" | "strong" | "exceptional";
  unit_economics: {
    ltv_cac_ratio: number | null;
    assessment: string;
    comment: string;
  };
  burn_efficiency: string;
  key_strengths: string[];
  key_risks: string[];
  investment_readiness: "not_ready" | "soon" | "ready";
  summary: string;
};

export type Match = {
  id: string;
  startup_id: string;
  vc_id: string;
  score: number;
  analysis: string;
  status: "pending" | "contacted" | "in_discussion" | "closed" | "rejected";
  created_at: string;
  venture_capital?: VentureCapital;
  startup?: Startup;
};
