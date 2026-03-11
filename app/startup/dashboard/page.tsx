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

/* ────────────────────────────────── helpers ── */

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75
      ? "bg-green-100 text-green-800"
      : score >= 50
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${color}`}>
      {score}/100
    </span>
  );
}

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
    <div className="border-b border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 flex gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
              active === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────── empty state ── */

function NoStartupState() {
  const { t } = useLanguage();
  const d = t.startupDash;
  const features = [
    { icon: <BarChart3 className="w-5 h-5 text-blue-600" />, title: d.feat1Title, desc: d.feat1Desc },
    { icon: <Target className="w-5 h-5 text-blue-600" />, title: d.feat2Title, desc: d.feat2Desc },
    { icon: <Users className="w-5 h-5 text-blue-600" />, title: d.feat3Title, desc: d.feat3Desc },
  ];
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center mx-auto mb-6">
        <Zap className="w-8 h-8 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">{d.welcomeTitle}</h2>
      <p className="text-slate-500 mb-8 leading-relaxed">{d.welcomeDesc}</p>
      <Link href="/startup/submit">
        <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 font-semibold">
          {d.welcomeCta} <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
      <div className="mt-12 grid sm:grid-cols-3 gap-4 text-left">
        {features.map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="mb-2">{item.icon}</div>
            <p className="font-semibold text-slate-800 text-sm mb-1">{item.title}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
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
      <Card className="border-blue-100 bg-blue-50/30">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-blue-600" />
              {d.reportTitle}
            </CardTitle>
            <ReadinessBadge r={fa.investment_readiness} />
          </div>
          <CardDescription className="text-slate-600 leading-relaxed">{fa.summary}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">{d.healthScore}</span>
              <div className="flex items-center gap-2">
                <TrajectoryIcon t={fa.growth_trajectory} />
                <span className="text-xl font-bold text-slate-900">{fa.financial_health_score}/100</span>
              </div>
            </div>
            <Progress value={fa.financial_health_score} className="h-2.5" />
          </div>

          {fa.unit_economics && (
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <p className="text-sm font-semibold text-slate-700 mb-1">{d.unitEco}</p>
              <p className="text-base font-bold text-slate-900">
                {fa.unit_economics.ltv_cac_ratio !== null
                  ? `${fa.unit_economics.ltv_cac_ratio}x — ${fa.unit_economics.assessment}`
                  : d.insufficientData}
              </p>
              <p className="text-sm text-slate-500 mt-1">{fa.unit_economics.comment}</p>
            </div>
          )}

          {fa.burn_efficiency && (
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <p className="text-sm font-semibold text-slate-700 mb-1">{d.burnEff}</p>
              <p className="text-sm text-slate-600">{fa.burn_efficiency}</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {d.strengths}
              </p>
              {fa.key_strengths.map((s: string, i: number) => (
                <p key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">+</span> {s}
                </p>
              ))}
            </div>
            <div className="space-y-2">
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
      <p className="text-sm text-slate-500">{matches.length} {d.matchedVCs}</p>
      {matches.map((match: any, i: number) => {
        const vc = match.venture_capital;
        return (
          <Card key={match.id} className={i === 0 ? "border-blue-200 shadow-sm" : ""}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {i === 0 && <Badge variant="default" className="text-xs">🏆 {d.topMatch}</Badge>}
                    <h3 className="font-semibold text-slate-900">{vc?.name ?? d.unknownVC}</h3>
                    <ScoreBadge score={match.score} />
                  </div>
                  <p className="text-sm text-slate-600 italic mb-3">&ldquo;{match.analysis}&rdquo;</p>
                  {vc && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {vc.sectors?.slice(0, 3).map((s: string) => (
                        <Badge key={s} variant="outline" className="text-xs">{localizeSector(s, lang)}</Badge>
                      ))}
                      {vc.stages?.slice(0, 2).map((s: string) => (
                        <Badge key={s} variant="secondary" className="text-xs">{localizeStage(s, lang)}</Badge>
                      ))}
                    </div>
                  )}
                  {vc && (
                    <p className="text-xs text-slate-400">
                      {d.ticket} : {vc.ticket_min?.toLocaleString(numberLocale)} € — {vc.ticket_max?.toLocaleString(numberLocale)} €
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {vc?.website && (
                    <a href={vc.website} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline" className="gap-1">
                        <ExternalLink className="w-3 h-3" /> {d.site}
                      </Button>
                    </a>
                  )}
                  {vc?.contact_email && (
                    <a href={`mailto:${vc.contact_email}`}>
                      <Button size="sm" className="gap-1">
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
      <Card>
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

      <Card>
        <CardHeader><CardTitle className="text-base">{d.infoTitle}</CardTitle></CardHeader>
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
        <Card key={item.label}>
          <CardHeader><CardTitle className="text-base">{item.label}</CardTitle></CardHeader>
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
    <nav className="border-b border-slate-100 bg-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
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
    <div className="min-h-screen bg-slate-50">
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
