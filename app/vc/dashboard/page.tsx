"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase, type Match } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Mail,
  Loader2,
  Zap,
  Filter,
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

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75
      ? "bg-green-100 text-green-800"
      : score >= 50
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${color}`}
    >
      {score}/100
    </span>
  );
}

function ReadinessBadge({ r, labels }: { r: string; labels: { ready: string; soon: string; notReady: string } }) {
  if (r === "ready") return <Badge variant="success">{labels.ready}</Badge>;
  if (r === "soon") return <Badge variant="warning">{labels.soon}</Badge>;
  return <Badge variant="secondary">{labels.notReady}</Badge>;
}

function TrajectoryIcon({ t }: { t: string }) {
  if (t === "exceptional" || t === "strong")
    return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (t === "moderate") return <Minus className="w-4 h-4 text-yellow-500" />;
  return <TrendingDown className="w-4 h-4 text-red-500" />;
}

function DashboardContent() {
  const params = useSearchParams();
  const vc_id = params.get("id");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState("all");
  const [filterSector, setFilterSector] = useState("all");
  const [filterReadiness, setFilterReadiness] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const { t } = useLanguage();
  const d = t.vcDashboard;
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  // Guard : redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function load() {
      let query = supabase
        .from("matches")
        .select("*, startup:startups(*)")
        .order("score", { ascending: false });

      if (vc_id) {
        query = query.eq("vc_id", vc_id);
      }

      const { data } = await query;
      setMatches(data || []);
      setLoading(false);
    }
    load();
  }, [vc_id]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-500">{d.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      {/* Stats rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: d.stats.received, value: matches.length },
          {
            label: d.stats.avgScore,
            value:
              matches.length > 0
                ? Math.round(
                    matches.reduce((acc, m) => acc + m.score, 0) / matches.length
                  )
                : 0,
          },
          {
            label: d.stats.ready,
            value: matches.filter(
              (m: any) =>
                m.startup?.financial_analysis?.investment_readiness === "ready"
            ).length,
          },
          {
            label: d.stats.score75,
            value: matches.filter((m) => m.score >= 75).length,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5 pb-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" /> {d.filters.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">{d.filters.stage}</p>
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{d.filters.all}</SelectItem>
                  {stages.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">{d.filters.sector}</p>
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{d.filters.all}</SelectItem>
                  {sectors.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">{d.filters.readiness}</p>
              <Select value={filterReadiness} onValueChange={setFilterReadiness}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{d.filters.all}</SelectItem>
                  <SelectItem value="ready">{d.filters.ready}</SelectItem>
                  <SelectItem value="soon">{d.filters.soon}</SelectItem>
                  <SelectItem value="not_ready">{d.filters.notReady}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deal flow */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {d.title} ({filtered.length} {d.dossiers})
        </h2>
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-gray-500">
              {d.noResults}
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
                        {/* Ligne 1 — nom + badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {startup?.name}
                          </h3>
                          <ScoreBadge score={match.score} />
                          {fa && (
                            <ReadinessBadge
                              r={fa.investment_readiness}
                              labels={{ ready: d.readyLabel, soon: d.soonLabel, notReady: d.notReadyLabel }}
                            />
                          )}
                        </div>
                        {/* Tagline */}
                        <p className="text-sm text-gray-500 mb-2">
                          {startup?.tagline}
                        </p>
                        {/* Meta */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {startup?.sector}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {startup?.stage}
                          </Badge>
                          <Badge variant="info" className="text-xs">
                            {startup?.amount_sought?.toLocaleString("fr-FR")} €
                          </Badge>
                        </div>
                        {/* Analyse match */}
                        <p className="text-sm text-gray-600 italic">
                          &ldquo;{match.analysis}&rdquo;
                        </p>

                        {/* Rapport financier (expand) */}
                        {isOpen && fa && (
                          <div className="mt-4 pt-4 border-t space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <TrajectoryIcon t={fa.growth_trajectory} />
                                {d.healthScore} : {fa.financial_health_score}/100
                              </span>
                            </div>

                            {fa.unit_economics && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs font-medium text-gray-500 mb-1">
                                  {d.unitEco}
                                </p>
                                <p className="text-sm font-semibold">
                                  {fa.unit_economics.ltv_cac_ratio !== null
                                    ? `LTV/CAC ${fa.unit_economics.ltv_cac_ratio}x — ${fa.unit_economics.assessment}`
                                    : d.insufficientData}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {fa.unit_economics.comment}
                                </p>
                              </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> {d.strengths}
                                </p>
                                {fa.key_strengths.map((s: string, i: number) => (
                                  <p key={i} className="text-xs text-gray-600">
                                    + {s}
                                  </p>
                                ))}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5" /> {d.risks}
                                </p>
                                {fa.key_risks.map((r: string, i: number) => (
                                  <p key={i} className="text-xs text-gray-600">
                                    ! {r}
                                  </p>
                                ))}
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 bg-blue-50 rounded p-3">
                              {fa.summary}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpanded(isOpen ? null : match.id)}
                        >
                          {isOpen ? d.reduce : d.aiReport}
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

function VCNavbar() {
  const { t } = useLanguage();
  const { signOut } = useAuth();
  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">{t.nav.dealflow}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="ghost" size="sm" onClick={signOut} className="text-slate-500 text-xs">
            Se déconnecter
          </Button>
          <Link href="/vc/register">
            <Button size="sm" variant="outline">
              {t.nav.editThesis}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function VCDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <VCNavbar />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}
