"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowRight, Loader2, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLanguage, LanguageToggle } from "@/lib/i18n";

const SECTORS = [
  // 🖥️ Tech & Digital
  "SaaS / Logiciel",
  "FinTech",
  "HealthTech / MedTech",
  "DeepTech / IA",
  "GreenTech / CleanTech",
  "Cybersécurité",
  "Marketplace",
  "EdTech",
  "InsurTech / Assurance",
  "LegalTech / RegTech",
  "RH / Recrutement",
  // 🛍️ Commerce & Consumer
  "E-commerce / Retail",
  "Mode / Luxe",
  "Cosmétique / Beauté",
  "Sport & Lifestyle",
  "Médias / Divertissement",
  "Gaming / Jeux Vidéo",
  // 🍽️ Food & Agriculture
  "Restauration / FoodService",
  "FoodTech / AgriTech",
  // 🏙️ Real Estate & Mobility
  "PropTech / Immobilier",
  "Mobilité / Transport",
  "BTP / Construction",
  // 🌍 Tourisme & Services
  "Tourisme / Hôtellerie",
  "Services B2B",
  "Industrie / Manufacturing",
  "Énergie",
  // Autre
  "Autre",
];

const STAGES = ["Pre-seed", "Seed", "Série A", "Série B", "Série B+"];

type FormData = {
  // Étape 1 — Infos générales
  name: string;
  tagline: string;
  website: string;
  contact_email: string;
  sector: string;
  stage: string;
  amount_sought: string;
  founded_year: string;
  team_size: string;
  problem: string;
  solution: string;
  market_size: string;
  traction: string;
  // Étape 2 — Données financières
  mrr: string;
  arr: string;
  growth_mom: string;
  burn_rate: string;
  runway_months: string;
  cac: string;
  ltv: string;
  gross_margin: string;
  active_customers: string;
  revenue_last_year: string;
};

const initialForm: FormData = {
  name: "",
  tagline: "",
  website: "",
  contact_email: "",
  sector: "",
  stage: "",
  amount_sought: "",
  founded_year: "",
  team_size: "",
  problem: "",
  solution: "",
  market_size: "",
  traction: "",
  mrr: "",
  arr: "",
  growth_mom: "",
  burn_rate: "",
  runway_months: "",
  cac: "",
  ltv: "",
  gross_margin: "",
  active_customers: "",
  revenue_last_year: "",
};

export default function StartupSubmitPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const s = t.submit;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const setSelect = (field: keyof FormData) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const step1Valid =
    form.name &&
    form.tagline &&
    form.contact_email &&
    form.sector &&
    form.stage &&
    form.amount_sought &&
    form.problem &&
    form.solution;

  async function handleSubmit() {
    setLoading(true);
    try {
      // 1. Insérer la startup en base
      const payload = {
        name: form.name,
        tagline: form.tagline,
        website: form.website || null,
        contact_email: form.contact_email,
        sector: form.sector,
        stage: form.stage,
        amount_sought: Number(form.amount_sought),
        founded_year: form.founded_year ? Number(form.founded_year) : new Date().getFullYear(),
        team_size: form.team_size ? Number(form.team_size) : 1,
        problem: form.problem,
        solution: form.solution,
        market_size: form.market_size,
        traction: form.traction,
        mrr: form.mrr ? Number(form.mrr) : null,
        arr: form.arr ? Number(form.arr) : null,
        growth_mom: form.growth_mom ? Number(form.growth_mom) : null,
        burn_rate: form.burn_rate ? Number(form.burn_rate) : null,
        runway_months: form.runway_months ? Number(form.runway_months) : null,
        cac: form.cac ? Number(form.cac) : null,
        ltv: form.ltv ? Number(form.ltv) : null,
        gross_margin: form.gross_margin ? Number(form.gross_margin) : null,
        active_customers: form.active_customers ? Number(form.active_customers) : null,
        revenue_last_year: form.revenue_last_year ? Number(form.revenue_last_year) : null,
      };

      const { data: startup, error } = await supabase
        .from("startups")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      // 2. Lancer l'analyse financière + matching
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startup_id: startup.id }),
      });

      if (!res.ok) throw new Error("Erreur lors du matching");

      toast({
        title: s.toastSuccess,
        description: s.toastSuccessDesc,
      });

      router.push(`/startup/dashboard?id=${startup.id}`);
    } catch (err) {
      console.error(err);
      toast({
        title: s.toastError,
        description: s.toastErrorDesc,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">{t.nav.submitNav}</span>
          </div>
          <LanguageToggle />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Progression */}
        <div className="flex items-center gap-3 mb-10">
          {[
            { n: 1, label: s.step1Label },
            { n: 2, label: s.step2Label },
            { n: 3, label: s.step3Label },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step > s.n
                    ? "bg-green-500 text-white"
                    : step === s.n
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
              </div>
              <span
                className={`text-sm ${
                  step === s.n ? "font-semibold text-gray-900" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {s.n < 3 && <div className="w-8 h-px bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        {/* Étape 1 — Profil */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>{s.step1Title}</CardTitle>
              <CardDescription>{s.step1Desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{s.fields.name}</Label>
                  <Input
                    placeholder="ex: Klark"
                    value={form.name}
                    onChange={set("name")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{s.fields.email}</Label>
                  <Input
                    type="email"
                    placeholder="founder@startup.fr"
                    value={form.contact_email}
                    onChange={set("contact_email")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{s.fields.tagline}</Label>
                <Input
                  placeholder="ex: Le CRM IA pour les PME françaises"
                  value={form.tagline}
                  onChange={set("tagline")}
                />
              </div>

              <div className="space-y-1.5">
                <Label>{s.fields.website}</Label>
                <Input
                  placeholder="https://..."
                  value={form.website}
                  onChange={set("website")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{s.fields.sector}</Label>
                  <Select value={form.sector} onValueChange={setSelect("sector")}>
                    <SelectTrigger>
                      <SelectValue placeholder={s.placeholders.sector} />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{s.fields.stage}</Label>
                  <Select value={form.stage} onValueChange={setSelect("stage")}>
                    <SelectTrigger>
                      <SelectValue placeholder={s.placeholders.stage} />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>{s.fields.amount}</Label>
                  <Input
                    type="number"
                    placeholder="500000"
                    value={form.amount_sought}
                    onChange={set("amount_sought")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{s.fields.founded}</Label>
                  <Input
                    type="number"
                    placeholder="2023"
                    value={form.founded_year}
                    onChange={set("founded_year")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{s.fields.team}</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={form.team_size}
                    onChange={set("team_size")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{s.fields.problem}</Label>
                <Textarea
                  placeholder={s.placeholders.problem}
                  value={form.problem}
                  onChange={set("problem")}
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label>{s.fields.solution}</Label>
                <Textarea
                  placeholder={s.placeholders.solution}
                  value={form.solution}
                  onChange={set("solution")}
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label>{s.fields.market}</Label>
                <Input
                  placeholder="ex: Marché français des PME, ~50Md€"
                  value={form.market_size}
                  onChange={set("market_size")}
                />
              </div>

              <div className="space-y-1.5">
                <Label>{s.fields.traction}</Label>
                <Textarea
                  placeholder="Chiffres clés, contrats signés, pilotes en cours, croissance..."
                  value={form.traction}
                  onChange={set("traction")}
                  rows={2}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!step1Valid}
                  className="gap-2"
                >
                  {s.btnNext} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 2 — Finances */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>{s.step2Title}</CardTitle>
              <CardDescription>{s.step2Desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Badge variant="info" className="mb-4">{s.badges.revenue}</Badge>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{s.fields.mrr}</Label>
                    <Input
                      type="number"
                      placeholder="50000"
                      value={form.mrr}
                      onChange={set("mrr")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{s.fields.arr}</Label>
                    <Input
                      type="number"
                      placeholder="600000"
                      value={form.arr}
                      onChange={set("arr")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{s.fields.growth}</Label>
                    <Input
                      type="number"
                      placeholder="15"
                      value={form.growth_mom}
                      onChange={set("growth_mom")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{s.fields.revenue}</Label>
                    <Input
                      type="number"
                      placeholder="200000"
                      value={form.revenue_last_year}
                      onChange={set("revenue_last_year")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Badge variant="warning" className="mb-4">{s.badges.cash}</Badge>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{s.fields.burn}</Label>
                    <Input
                      type="number"
                      placeholder="80000"
                      value={form.burn_rate}
                      onChange={set("burn_rate")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{s.fields.runway}</Label>
                    <Input
                      type="number"
                      placeholder="18"
                      value={form.runway_months}
                      onChange={set("runway_months")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{s.fields.margin}</Label>
                    <Input
                      type="number"
                      placeholder="70"
                      value={form.gross_margin}
                      onChange={set("gross_margin")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Badge variant="success" className="mb-4">{s.badges.unitEco}</Badge>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>{s.fields.cac}</Label>
                    <Input
                      type="number"
                      placeholder="500"
                      value={form.cac}
                      onChange={set("cac")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{s.fields.ltv}</Label>
                    <Input
                      type="number"
                      placeholder="3000"
                      value={form.ltv}
                      onChange={set("ltv")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{s.fields.customers}</Label>
                    <Input
                      type="number"
                      placeholder="120"
                      value={form.active_customers}
                      onChange={set("active_customers")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> {s.btnBack}
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  {s.btnLaunch} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 3 — Confirmation & lancement */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>{s.step3Title}</CardTitle>
              <CardDescription>{s.step3Desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-5 space-y-3">
                <p className="font-semibold text-blue-900">
                  {form.name} — {form.stage} · {form.sector}
                </p>
                <p className="text-blue-700 text-sm">{form.tagline}</p>
                <p className="text-blue-600 text-sm">
                  {s.searchingText} : {Number(form.amount_sought).toLocaleString("fr-FR")} €
                </p>
              </div>

              <div className="space-y-3">
                {s.aiSteps.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> {s.btnBack}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {s.btnAnalyzing}
                    </>
                  ) : (
                    <>
                      {s.btnAnalyze} <Zap className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
