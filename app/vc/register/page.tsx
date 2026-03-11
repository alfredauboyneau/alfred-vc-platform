"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { useLanguage, LanguageToggle } from "@/lib/i18n";

const ALL_SECTORS = [
  { value: "SaaS / Logiciel", fr: "SaaS / Logiciel", en: "SaaS / Software" },
  { value: "FinTech", fr: "FinTech", en: "FinTech" },
  { value: "HealthTech / MedTech", fr: "HealthTech / MedTech", en: "HealthTech / MedTech" },
  { value: "DeepTech / IA", fr: "DeepTech / IA", en: "DeepTech / AI" },
  { value: "GreenTech / CleanTech", fr: "GreenTech / CleanTech", en: "GreenTech / CleanTech" },
  { value: "EdTech", fr: "EdTech", en: "EdTech" },
  { value: "Cybersécurité", fr: "Cybersécurité", en: "Cybersecurity" },
  { value: "Marketplace", fr: "Marketplace", en: "Marketplace" },
  { value: "InsurTech / Assurance", fr: "InsurTech / Assurance", en: "InsurTech / Insurance" },
  { value: "LegalTech / RegTech", fr: "LegalTech / RegTech", en: "LegalTech / RegTech" },
  { value: "RH / Recrutement", fr: "RH / Recrutement", en: "HR / Recruiting" },
  { value: "E-commerce / Retail", fr: "E-commerce / Retail", en: "E-commerce / Retail" },
  { value: "Mode / Luxe", fr: "Mode / Luxe", en: "Fashion / Luxury" },
  { value: "Cosmétique / Beauté", fr: "Cosmétique / Beauté", en: "Cosmetics / Beauty" },
  { value: "Sport & Lifestyle", fr: "Sport & Lifestyle", en: "Sport & Lifestyle" },
  { value: "Médias / Divertissement", fr: "Médias / Divertissement", en: "Media / Entertainment" },
  { value: "Gaming / Jeux Vidéo", fr: "Gaming / Jeux Vidéo", en: "Gaming / Video Games" },
  { value: "Restauration / FoodService", fr: "Restauration / FoodService", en: "Restaurant / FoodService" },
  { value: "FoodTech / AgriTech", fr: "FoodTech / AgriTech", en: "FoodTech / AgriTech" },
  { value: "PropTech / Immobilier", fr: "PropTech / Immobilier", en: "PropTech / Real Estate" },
  { value: "Mobilité / Transport", fr: "Mobilité / Transport", en: "Mobility / Transport" },
  { value: "BTP / Construction", fr: "BTP / Construction", en: "Construction / Building" },
  { value: "Tourisme / Hôtellerie", fr: "Tourisme / Hôtellerie", en: "Tourism / Hospitality" },
  { value: "Services B2B", fr: "Services B2B", en: "B2B Services" },
  { value: "Industrie / Manufacturing", fr: "Industrie / Manufacturing", en: "Industry / Manufacturing" },
  { value: "Énergie", fr: "Énergie", en: "Energy" },
  { value: "Tous secteurs", fr: "Tous secteurs", en: "All sectors" },
];

const ALL_STAGES = [
  { value: "Pre-seed", fr: "Pre-seed", en: "Pre-seed" },
  { value: "Seed", fr: "Seed", en: "Seed" },
  { value: "Série A", fr: "Série A", en: "Series A" },
  { value: "Série B", fr: "Série B", en: "Series B" },
  { value: "Série B+", fr: "Série B+", en: "Series B+" },
];

export default function VCRegisterPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const r = t.vcRegister;
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  // Guard : redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const sectorOptions = ALL_SECTORS.map((sector) => ({
    value: sector.value,
    label: lang === "en" ? sector.en : sector.fr,
  }));
  const stageOptions = ALL_STAGES.map((stage) => ({
    value: stage.value,
    label: lang === "en" ? stage.en : stage.fr,
  }));
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    contact_email: "",
    ticket_min: "",
    ticket_max: "",
    investment_thesis: "",
    notable_investments: "",
  });

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleSector = (s: string) =>
    setSelectedSectors((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const toggleStage = (s: string) =>
    setSelectedStages((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const isValid =
    form.name &&
    form.contact_email &&
    form.investment_thesis &&
    selectedSectors.length > 0 &&
    selectedStages.length > 0 &&
    form.ticket_min &&
    form.ticket_max;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("venture_capitals")
        .insert({
          name: form.name,
          description: form.description,
          website: form.website || null,
          contact_email: form.contact_email,
          sectors: selectedSectors,
          stages: selectedStages,
          ticket_min: Number(form.ticket_min),
          ticket_max: Number(form.ticket_max),
          investment_thesis: form.investment_thesis,
          notable_investments: form.notable_investments || null,
          user_id: user?.id ?? null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: r.toastSuccess,
        description: r.toastSuccessDesc,
      });

      router.push(`/vc/dashboard?id=${data.id}`);
    } catch (err) {
      console.error(err);
      toast({
        title: r.toastError,
        description: r.toastErrorDesc,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">{r.navTitle}</span>
          </div>
          <LanguageToggle />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{r.title}</h1>
          <p className="text-gray-500">{r.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{r.generalInfo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{r.fields.name}</Label>
                  <Input
                    placeholder={r.placeholders.name}
                    value={form.name}
                    onChange={set("name")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{r.fields.email}</Label>
                  <Input
                    type="email"
                    placeholder={r.placeholders.email}
                    value={form.contact_email}
                    onChange={set("contact_email")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{r.fields.desc}</Label>
                <Textarea
                  placeholder={r.placeholders.desc}
                  value={form.description}
                  onChange={set("description")}
                  rows={2}
                />
              </div>

              <div className="space-y-1.5">
                <Label>{r.fields.website}</Label>
                <Input
                  placeholder={r.placeholders.website}
                  value={form.website}
                  onChange={set("website")}
                />
              </div>

              <div className="space-y-1.5">
                <Label>{r.fields.notable}</Label>
                <Input
                  placeholder={r.placeholders.notable}
                  value={form.notable_investments}
                  onChange={set("notable_investments")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{r.thesis}</CardTitle>
              <CardDescription>{r.thesisDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label>{r.fields.sectors}</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {sectorOptions.map((sector) => (
                    <button
                      type="button"
                      key={sector.value}
                      onClick={() => toggleSector(sector.value)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        selectedSectors.includes(sector.value)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {sector.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{r.fields.stages}</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {stageOptions.map((stage) => (
                    <button
                      type="button"
                      key={stage.value}
                      onClick={() => toggleStage(stage.value)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        selectedStages.includes(stage.value)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{r.fields.ticketMin}</Label>
                  <Input
                    type="number"
                    placeholder={r.placeholders.ticketMin}
                    value={form.ticket_min}
                    onChange={set("ticket_min")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{r.fields.ticketMax}</Label>
                  <Input
                    type="number"
                    placeholder={r.placeholders.ticketMax}
                    value={form.ticket_max}
                    onChange={set("ticket_max")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{r.fields.thesisDetail}</Label>
                <Textarea
                  placeholder={r.placeholders.thesisDetail}
                  value={form.investment_thesis}
                  onChange={set("investment_thesis")}
                  rows={6}
                />
                <p className="text-xs text-gray-400 mt-1">{r.thesisHint}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={!isValid || loading} className="gap-2" size="lg">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> {r.submitting}
                </>
              ) : (
                r.submitBtn
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
