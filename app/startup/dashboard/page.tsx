"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase, type Startup, type Match } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Mail,
  Loader2,
  Zap,
  ArrowRight,
  BarChart3,
  Target,
  User,
  Building2,
  Globe,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useLanguage, LanguageToggle } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { getNumberLocale, localizeSector, localizeStage } from "@/lib/taxonomy";
import { MatchScoreBreakdown } from "@/components/match-score-breakdown";

/* ────────────────────────────────── helpers ── */

function ReadinessBadge({ r }: { r: string }) {
  const { t } = useLanguage();
  const d = t.startupDash;
  if (r === "ready") return <Badge variant="success">{d.readyLabel}</Badge>;
  if (r === "soon") return <Badge variant="warning">{d.soonLabel}</Badge>;
  return <Badge variant="secondary">{d.notReadyLabel}</Badge>;
}

function TrajectoryIcon({ t: traj }: { t: string }) {
  if (traj === "exceptional" || traj === "strong")
    return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (traj === "moderate") return <Minus className="w-4 h-4 text-yellow-500" />;
  return <TrendingDown className="w-4 h-4 text-red-500" />;
}

/* ────────────────────────────────── tabs ── */

type Tab = "analyse" | "matchs" | "profil";

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const { t } = useLanguage();
  const d = t.startupDash;
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "analyse", label: d.tabAnalyse, icon: <BarChart3 className="w-4 h-4" /> },
    { id: "matchs", label: d.tabMatchs, icon: <Target className="w-4 h-4" /> },
    { id: "profil", label: d.tabProfil, icon: <User className="w-4 h-4" /> },
  ];
  return (
    <div className="border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="premium-card inline-flex flex-wrap gap-2 rounded-2xl border border-slate-200/70 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              active === tab.id
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-500 hover:bg-white hover:text-slate-900"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────── empty state ── */

function NoStartupState() {
  const { t, lang } = useLanguage();
  const d = t.startupDash;
  const features = [
    { icon: <BarChart3 className="w-5 h-5 text-blue-600" />, title: d.feat1Title, desc: d.feat1Desc },
    { icon: <Target className="w-5 h-5 text-blue-600" />, title: d.feat2Title, desc: d.feat2Desc },
    { icon: <Users className="w-5 h-5 text-blue-600" />, title: d.feat3Title, desc: d.feat3Desc },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="premium-card section-frame overflow-hidden rounded-[2rem] border border-slate-200/70 p-8 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="eyebrow mb-4">{lang === "en" ? "Startup dashboard" : "Tableau de bord startup"}</p>
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="headline-balance text-3xl font-semibold tracking-tight text-slate-950 mb-4">
              {d.welcomeTitle}
            </h2>
            <p className="max-w-xl text-base leading-7 text-slate-600 mb-8">{d.welcomeDesc}</p>
            <Link href="/startup/submit">
              <Button size="lg" className="gap-2 rounded-full bg-slate-950 px-6 hover:bg-slate-800">
                {d.welcomeCta} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="marketing-surface rounded-[1.75rem] border border-slate-200/70 p-5 sm:p-6">
            <p className="eyebrow mb-4">{lang === "en" ? "Included in the report" : "Inclus dans le rapport"}</p>
            <div className="space-y-4 text-left">
        {features.map((item) => (
              <div key={item.title} className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
                  {item.icon}
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-1">{item.title}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────── tab: analyse ── */

function AnalyseTab({ startup }: { startup: Startup }) {
  const { t, lang } = useLanguage();
  const d = t.startupDash;
  const fa = startup.financial_analysis;

  if (!fa) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-center justify-center mx-auto mb-5">
          <BarChart3 className="w-7 h-7 text-amber-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{d.notDoneTitle}</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto text-sm">{d.notDoneDesc}</p>
        <Link href="/startup/submit">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            {d.notDoneCta} <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="premium-card overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="eyebrow mb-3">{lang === "en" ? "Financial review" : "Revue financière"}</p>
              <CardTitle className="flex items-center gap-2 text-2xl tracking-tight text-slate-950">
              <Zap className="w-5 h-5 text-blue-600" />
              {d.reportTitle}
              </CardTitle>
            </div>
            <ReadinessBadge r={fa.investment_readiness} />
          </div>
          <CardDescription className="max-w-2xl text-base leading-7 text-slate-600">{fa.summary}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="marketing-surface rounded-3xl border border-blue-100/80 p-5">
              <p className="eyebrow mb-3">{d.healthScore}</p>
              <div className="flex items-center gap-2">
                <TrajectoryIcon t={fa.growth_trajectory} />
                <span className="text-4xl font-semibold tracking-tight text-slate-950">
                  {fa.financial_health_score}/100
                </span>
              </div>
              <div className="mt-4">
                <Progress value={fa.financial_health_score} className="h-2.5" />
              </div>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">
              <p className="eyebrow mb-3 text-emerald-700">{d.strengths}</p>
              <div className="space-y-2">
                {fa.key_strengths.slice(0, 2).map((s: string, i: number) => (
                  <p key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">+</span> {s}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-amber-100 bg-amber-50/70 p-5">
              <p className="eyebrow mb-3 text-amber-700">{d.risks}</p>
              <div className="space-y-2">
                {fa.key_risks.slice(0, 2).map((r: string, i: number) => (
                  <p key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">!</span> {r}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {fa.unit_economics && (
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-5">
              <p className="eyebrow mb-2 text-slate-600">{d.unitEco}</p>
              <p className="text-base font-semibold text-slate-950">
                {fa.unit_economics.ltv_cac_ratio !== null
                  ? `${fa.unit_economics.ltv_cac_ratio}x — ${fa.unit_economics.assessment}`
                  : d.insufficientData}
              </p>
              <p className="text-sm text-slate-500 mt-2">{fa.unit_economics.comment}</p>
            </div>
          )}

          {fa.burn_efficiency && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5">
              <p className="eyebrow mb-2 text-slate-600">{d.burnEff}</p>
              <p className="text-sm text-slate-600">{fa.burn_efficiency}</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5 space-y-2">
              <p className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {d.strengths}
              </p>
              {fa.key_strengths.map((s: string, i: number) => (
                <p key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">+</span> {s}
                </p>
              ))}
            </div>
            <div className="rounded-3xl border border-rose-100 bg-rose-50/60 p-5 space-y-2">
              <p className="text-sm font-semibold text-red-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {d.risks}
              </p>
              {fa.key_risks.map((r: string, i: number) => (
                <p key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-red-500 font-bold mt-0.5">!</span> {r}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────────────────────── tab: matchs ── */

function MatchsTab({ matches, startup }: { matches: Match[]; startup: Startup }) {
  const { t, lang } = useLanguage();
  const d = t.startupDash;
  const numberLocale = getNumberLocale(lang);

  if (matches.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center mx-auto mb-5">
          <Target className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{d.noMatchTitle}</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          {startup.financial_analysis ? d.noMatchDesc1 : d.noMatchDesc2}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="eyebrow">{matches.length} {d.matchedVCs}</p>
      </div>
      {matches.map((match: any, i: number) => {
        const vc = match.venture_capital;
        return (
          <Card
            key={match.id}
            className={`premium-card rounded-[1.75rem] border shadow-none ${
              i === 0 ? "border-blue-200/80" : "border-slate-200/70"
            }`}
          >
            <CardContent className="p-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_188px] lg:items-start">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {i === 0 && (
                      <Badge variant="default" className="rounded-full text-xs">
                        <Target className="mr-1 h-3 w-3" /> {d.topMatch}
                      </Badge>
                    )}
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">{vc?.name ?? d.unknownVC}</h3>
                  </div>
                  <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {lang === "en" ? "Investment note" : "Note d'analyse"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{match.analysis}</p>
                  </div>
                  {vc && <MatchScoreBreakdown startup={startup} vc={vc} score={match.score} lang={lang} />}
                  {vc && (
                    <div className="mt-3 flex flex-wrap gap-1 mb-2">
                      {vc.sectors?.slice(0, 3).map((s: string) => (
                        <Badge key={s} variant="outline" className="text-xs">{localizeSector(s, lang)}</Badge>
                      ))}
                      {vc.stages?.slice(0, 2).map((s: string) => (
                        <Badge key={s} variant="secondary" className="text-xs">{localizeStage(s, lang)}</Badge>
                      ))}
                    </div>
                  )}
                  {vc && (
                    <p className="text-xs text-slate-400 mt-2">
                      {d.ticket} : {vc.ticket_min?.toLocaleString(numberLocale)} € — {vc.ticket_max?.toLocaleString(numberLocale)} €
                    </p>
                  )}
                </div>
                <div className="space-y-2 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-3">
                  {vc?.website && (
                    <a href={vc.website} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline" className="w-full gap-1">
                        <ExternalLink className="w-3 h-3" /> {d.site}
                      </Button>
                    </a>
                  )}
                  {vc?.contact_email && (
                    <a href={`mailto:${vc.contact_email}`}>
                      <Button size="sm" className="w-full gap-1">
                        <Mail className="w-3 h-3" /> {d.contact}
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────── tab: profil ── */

function ProfilTab({ startup }: { startup: Startup }) {
  const { t, lang } = useLanguage();
  const d = t.startupDash;
  const numberLocale = getNumberLocale(lang);

  const fields = [
    { label: d.sectorLabel, value: localizeSector(startup.sector, lang) },
    { label: d.stageLabel, value: localizeStage(startup.stage, lang) },
    { label: d.amountLabel, value: startup.amount_sought ? `${startup.amount_sought.toLocaleString(numberLocale)} €` : null },
    { label: d.foundedLabel, value: (startup as any).founded_year },
    { label: d.teamLabel, value: (startup as any).team_size ? `${(startup as any).team_size} ${d.teamSize}` : null },
    { label: d.mrrLabel, value: (startup as any).mrr ? `${Number((startup as any).mrr).toLocaleString(numberLocale)} €${d.perMonth}` : null },
    { label: d.websiteLabel, value: startup.website },
    { label: d.emailLabel, value: startup.contact_email },
  ];

  return (
    <div className="space-y-5">
      <Card className="premium-card rounded-[1.75rem] border border-slate-200/70 shadow-none">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{startup.name}</h2>
              <p className="text-slate-500 mt-1">{startup.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">{localizeSector(startup.sector, lang)}</Badge>
                <Badge variant="outline">{localizeStage(startup.stage, lang)}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card rounded-[1.75rem] border border-slate-200/70 shadow-none">
        <CardHeader>
          <p className="eyebrow">{lang === "en" ? "Profile" : "Profil"}</p>
          <CardTitle className="text-base">{d.infoTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-slate-100">
            {fields.filter(f => f.value).map((f) => (
              <div key={f.label} className="flex items-center justify-between py-3">
                <dt className="text-sm text-slate-500">{f.label}</dt>
                <dd className="text-sm font-medium text-slate-800 text-right max-w-[60%] truncate">
                  {f.label === d.websiteLabel ? (
                    <a href={f.value as string} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {f.value}
                    </a>
                  ) : f.value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {[
        (startup as any).problem && { label: d.problemLabel, value: (startup as any).problem },
        (startup as any).solution && { label: d.solutionLabel, value: (startup as any).solution },
        (startup as any).market_size && { label: d.marketLabel, value: (startup as any).market_size },
        (startup as any).traction && { label: d.tractionLabel, value: (startup as any).traction },
      ].filter(Boolean).map((item: any) => (
        <Card key={item.label} className="premium-card rounded-[1.75rem] border border-slate-200/70 shadow-none">
          <CardHeader><CardTitle className="text-base tracking-tight">{item.label}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{item.value}</p>
          </CardContent>
        </Card>
      ))}

      <div className="pt-2">
        <Link href="/startup/submit">
          <Button variant="outline" className="gap-2">
            {d.editBtn} <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ────────────────────────────────── main content ── */

function DashboardContent() {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("analyse");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const d = t.startupDash;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const { data: s } = await supabase
        .from("startups")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      setStartup(s ?? null);

      if (s) {
        const { data: m } = await supabase
          .from("matches")
          .select("*, venture_capital:venture_capitals(*)")
          .eq("startup_id", s.id)
          .order("score", { ascending: false });
        setMatches(m || []);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-400 text-sm">{d.loading}</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return <NoStartupState />;
  }

  return (
    <>
      <TabBar active={activeTab} onChange={setActiveTab} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === "analyse" && <AnalyseTab startup={startup} />}
        {activeTab === "matchs" && <MatchsTab matches={matches} startup={startup} />}
        {activeTab === "profil" && <ProfilTab startup={startup} />}
      </div>
    </>
  );
}

/* ────────────────────────────────── navbar ── */

function DashboardNavbar() {
  const { signOut } = useAuth();
  const { t } = useLanguage();
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-2xl">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">Alfred</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="ghost" size="sm" onClick={signOut} className="text-slate-400 hover:text-slate-700 text-xs">
            {t.startupDash.signOut}
          </Button>
        </div>
      </div>
    </nav>
  );
}

/* ────────────────────────────────── page ── */

export default function StartupDashboardPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_28%),linear-gradient(to_bottom,rgba(248,250,252,0.96),rgba(255,255,255,1)_24%)]">
      <DashboardNavbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
