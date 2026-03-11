"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase, type Match } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Mail,
  Loader2,
  Zap,
  ArrowRight,
  Filter,
  LayoutDashboard,
  User,
  Building2,
  Globe,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
      {score}/100
    </span>
  );
}

function ReadinessBadge({ r }: { r: string }) {
  const { t } = useLanguage();
  const d = t.vcDash;
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

type Tab = "dealflow" | "profil";

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const { t } = useLanguage();
  const d = t.vcDash;
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dealflow", label: d.tabDealflow, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "profil", label: d.tabProfil, icon: <User className="w-4 h-4" /> },
  ];
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 flex gap-0">
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

/* ────────────────────────────────── no vc state ── */

function NoVCState() {
  const { t } = useLanguage();
  const d = t.vcDash;
  const features = [
    { icon: <Filter className="w-5 h-5 text-blue-600" />, title: d.feat1Title, desc: d.feat1Desc },
    { icon: <TrendingUp className="w-5 h-5 text-blue-600" />, title: d.feat2Title, desc: d.feat2Desc },
    { icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />, title: d.feat3Title, desc: d.feat3Desc },
  ];
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center mx-auto mb-6">
        <Building2 className="w-8 h-8 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">{d.welcomeTitle}</h2>
      <p className="text-slate-500 mb-8 leading-relaxed">{d.welcomeDesc}</p>
      <Link href="/vc/register">
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

/* ────────────────────────────────── tab: deal flow ── */

function DealFlowTab({ matches }: { matches: Match[] }) {
  const { t, lang } = useLanguage();
  const d = t.vcDash;
  const numberLocale = getNumberLocale(lang);
  const [filterStage, setFilterStage] = useState("all");
  const [filterSector, setFilterSector] = useState("all");
  const [filterReadiness, setFilterReadiness] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const sectors = [...new Set(matches.map((m: any) => m.startup?.sector).filter(Boolean))];
  const stages = [...new Set(matches.map((m: any) => m.startup?.stage).filter(Boolean))];

  const filtered = matches.filter((m: any) => {
    const s = m.startup;
    if (!s) return false;
    if (filterStage !== "all" && s.stage !== filterStage) return false;
    if (filterSector !== "all" && s.sector !== filterSector) return false;
    if (filterReadiness !== "all") {
      const r = s.financial_analysis?.investment_readiness;
      if (r !== filterReadiness) return false;
    }
    return true;
  });

  if (matches.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center mx-auto mb-5">
          <LayoutDashboard className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{d.noFilesTitle}</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">{d.noFilesDesc}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: d.statReceived, value: matches.length },
          {
            label: d.statAvgScore,
            value: matches.length > 0
              ? Math.round(matches.reduce((acc, m) => acc + m.score, 0) / matches.length)
              : 0,
          },
          {
            label: d.statReady,
            value: matches.filter((m: any) => m.startup?.financial_analysis?.investment_readiness === "ready").length,
          },
          { label: d.statScore75, value: matches.filter((m) => m.score >= 75).length },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
            <Filter className="w-4 h-4" /> {d.filtersTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <p className="text-xs text-slate-400">{d.filterStage}</p>
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{d.filterAll}</SelectItem>
                  {stages.map((s) => <SelectItem key={s} value={s}>{localizeStage(s, lang)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400">{d.filterSector}</p>
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger className="w-44 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{d.filterAll}</SelectItem>
                  {sectors.map((s) => <SelectItem key={s} value={s}>{localizeSector(s, lang)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400">{d.filterReadiness}</p>
              <Select value={filterReadiness} onValueChange={setFilterReadiness}>
                <SelectTrigger className="w-44 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{d.filterAll}</SelectItem>
                  <SelectItem value="ready">{d.filterReady}</SelectItem>
                  <SelectItem value="soon">{d.filterSoon}</SelectItem>
                  <SelectItem value="not_ready">{d.filterNotReady}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste */}
      <div>
        <p className="text-sm text-slate-500 mb-3">
          {filtered.length} {d.filesCount}{filtered.length > 1 ? "s" : ""}
        </p>
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-slate-400 text-sm">
              {d.noFilesMatch}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((match: any) => {
              const startup = match.startup;
              const fa = startup?.financial_analysis;
              const isOpen = expanded === match.id;

              return (
                <Card key={match.id} className={isOpen ? "border-blue-200" : ""}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{startup?.name}</h3>
                          <ScoreBadge score={match.score} />
                          {fa && <ReadinessBadge r={fa.investment_readiness} />}
                        </div>
                        <p className="text-sm text-slate-500 mb-2">{startup?.tagline}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="secondary" className="text-xs">{localizeSector(startup?.sector, lang)}</Badge>
                          <Badge variant="outline" className="text-xs">{localizeStage(startup?.stage, lang)}</Badge>
                          <Badge variant="info" className="text-xs">
                            {startup?.amount_sought?.toLocaleString(numberLocale)} €
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 italic">&ldquo;{match.analysis}&rdquo;</p>

                        {isOpen && fa && (
                          <div className="mt-4 pt-4 border-t space-y-4">
                            <div className="flex items-center gap-2">
                              <TrajectoryIcon t={fa.growth_trajectory} />
                              <span className="text-sm font-semibold text-slate-700">
                                {d.healthScore} : {fa.financial_health_score}/100
                              </span>
                            </div>

                            {fa.unit_economics && (
                              <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-slate-500 mb-1">{d.unitEco}</p>
                                <p className="text-sm font-semibold text-slate-800">
                                  {fa.unit_economics.ltv_cac_ratio !== null
                                    ? `LTV/CAC ${fa.unit_economics.ltv_cac_ratio}x — ${fa.unit_economics.assessment}`
                                    : d.insufficientData}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">{fa.unit_economics.comment}</p>
                              </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> {d.strengths}
                                </p>
                                {fa.key_strengths.map((s: string, i: number) => (
                                  <p key={i} className="text-xs text-slate-600">+ {s}</p>
                                ))}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5" /> {d.risks}
                                </p>
                                {fa.key_risks.map((r: string, i: number) => (
                                  <p key={i} className="text-xs text-slate-600">! {r}</p>
                                ))}
                              </div>
                            </div>

                            <p className="text-sm text-slate-600 bg-blue-50 rounded-lg p-3">{fa.summary}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpanded(isOpen ? null : match.id)}
                        >
                          {isOpen ? d.collapse : d.aiReport}
                        </Button>
                        {startup?.website && (
                          <a href={startup.website} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="outline" className="w-full gap-1">
                              <ExternalLink className="w-3 h-3" /> {d.site}
                            </Button>
                          </a>
                        )}
                        {startup?.contact_email && (
                          <a href={`mailto:${startup.contact_email}`}>
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
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────── tab: profil ── */

function ProfilVCTab({ vc }: { vc: any }) {
  const { t, lang } = useLanguage();
  const d = t.vcDash;
  const numberLocale = getNumberLocale(lang);
  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{vc.name}</h2>
              <p className="text-slate-500 mt-1 text-sm">{vc.description}</p>
              {vc.website && (
                <a href={vc.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2">
                  <Globe className="w-3.5 h-3.5" /> {vc.website}
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{d.criteria}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {vc.sectors?.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 mb-2">{d.sectors}</p>
              <div className="flex flex-wrap gap-1.5">
                {vc.sectors.map((s: string) => (
                  <Badge key={s} variant="secondary">{localizeSector(s, lang)}</Badge>
                ))}
              </div>
            </div>
          )}
          {vc.stages?.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 mb-2">{d.stages}</p>
              <div className="flex flex-wrap gap-1.5">
                {vc.stages.map((s: string) => (
                  <Badge key={s} variant="outline">{localizeStage(s, lang)}</Badge>
                ))}
              </div>
            </div>
          )}
          {(vc.ticket_min || vc.ticket_max) && (
            <div>
              <p className="text-xs text-slate-400 mb-1">{d.ticket}</p>
              <p className="text-sm font-medium text-slate-800">
                {vc.ticket_min?.toLocaleString(numberLocale)} € — {vc.ticket_max?.toLocaleString(numberLocale)} €
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {vc.investment_thesis && (
        <Card>
          <CardHeader><CardTitle className="text-base">{d.thesis}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{vc.investment_thesis}</p>
          </CardContent>
        </Card>
      )}

      {vc.notable_investments && (
        <Card>
          <CardHeader><CardTitle className="text-base">{d.notable}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{vc.notable_investments}</p>
          </CardContent>
        </Card>
      )}

      <div className="pt-2">
        <Link href="/vc/register">
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
  const [vc, setVC] = useState<any>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dealflow");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const d = t.vcDash;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const { data: v } = await supabase
        .from("venture_capitals")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      setVC(v ?? null);

      if (v) {
        const { data: m } = await supabase
          .from("matches")
          .select("*, startup:startups(*)")
          .eq("vc_id", v.id)
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

  if (!vc) {
    return <NoVCState />;
  }

  return (
    <>
      <TabBar active={activeTab} onChange={setActiveTab} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === "dealflow" && <DealFlowTab matches={matches} />}
        {activeTab === "profil" && <ProfilVCTab vc={vc} />}
      </div>
    </>
  );
}

/* ────────────────────────────────── navbar ── */

function VCNavbar() {
  const { signOut } = useAuth();
  const { t } = useLanguage();
  return (
    <nav className="border-b border-slate-100 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">Alfred</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="ghost" size="sm" onClick={signOut} className="text-slate-400 hover:text-slate-700 text-xs">
            {t.vcDash.signOut}
          </Button>
        </div>
      </div>
    </nav>
  );
}

/* ────────────────────────────────── page ── */

export default function VCDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <VCNavbar />
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
