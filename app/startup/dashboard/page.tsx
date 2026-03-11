"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase, type Startup, type Match } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Mail,
  Loader2,
  Zap,
} from "lucide-react";
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
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${color}`}>
      {score}/100
    </span>
  );
}

function ReadinessBadge({ r, labels }: { r: string; labels: { ready: string; soon: string; notReady: string } }) {
  if (r === "ready") return <Badge variant="success">{labels.ready}</Badge>;
  if (r === "soon") return <Badge variant="warning">{labels.soon}</Badge>;
  return <Badge variant="destructive">{labels.notReady}</Badge>;
}

function TrajectoryIcon({ t }: { t: string }) {
  if (t === "exceptional" || t === "strong")
    return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (t === "moderate")
    return <Minus className="w-4 h-4 text-yellow-500" />;
  return <TrendingDown className="w-4 h-4 text-red-500" />;
}

function DashboardContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [startup, setStartup] = useState<Startup | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const d = t.dashboard;
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  // Guard : redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const { data: s } = await supabase
        .from("startups")
        .select("*")
        .eq("id", id)
        .single();
      setStartup(s);

      const { data: m } = await supabase
        .from("matches")
        .select("*, venture_capital:venture_capitals(*)")
        .eq("startup_id", id)
        .order("score", { ascending: false });
      setMatches(m || []);
      setLoading(false);
    }
    load();
  }, [id]);

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

  if (!startup) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">{d.notFound}</p>
        <Link href="/startup/submit">
          <Button className="mt-4">{d.notFoundCta}</Button>
        </Link>
      </div>
    );
  }

  const fa = startup.financial_analysis;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* En-tête startup */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{startup.name}</h1>
        <p className="text-gray-500 mt-1">{startup.tagline}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary">{startup.sector}</Badge>
          <Badge variant="secondary">{startup.stage}</Badge>
          <Badge variant="info">
            {startup.amount_sought.toLocaleString("fr-FR")} € {d.sought}
          </Badge>
        </div>
      </div>

      {/* Rapport financier IA */}
      {fa && (
        <Card className="border-blue-100 bg-blue-50/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                {d.aiReport}
              </CardTitle>
              <ReadinessBadge
                r={fa.investment_readiness}
                labels={{ ready: d.readyLabel, soon: d.soonLabel, notReady: d.notReadyLabel }}
              />
            </div>
            <CardDescription>{fa.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Score santé */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{d.healthScore}</span>
                <div className="flex items-center gap-2">
                  <TrajectoryIcon t={fa.growth_trajectory} />
                  <span className="text-lg font-bold text-gray-900">{fa.financial_health_score}/100</span>
                </div>
              </div>
              <Progress value={fa.financial_health_score} className="h-2" />
            </div>

            {/* Unit economics */}
            {fa.unit_economics && (
              <div className="bg-white rounded-lg p-4 border">
                <p className="text-sm font-medium text-gray-700 mb-1">{d.unitEco}</p>
                <p className="text-lg font-bold text-gray-900">
                  {fa.unit_economics.ltv_cac_ratio !== null
                    ? `${d.ratio} ${fa.unit_economics.ltv_cac_ratio}x — ${fa.unit_economics.assessment}`
                    : d.insufficientData}
                </p>
                <p className="text-sm text-gray-500 mt-1">{fa.unit_economics.comment}</p>
              </div>
            )}

            {/* Burn efficiency */}
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm font-medium text-gray-700 mb-1">{d.burnEff}</p>
              <p className="text-sm text-gray-600">{fa.burn_efficiency}</p>
            </div>

            {/* Forces / Risques */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-green-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {d.strengths}
                </p>
                {fa.key_strengths.map((s, i) => (
                  <p key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">+</span> {s}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {d.risks}
                </p>
                {fa.key_risks.map((r, i) => (
                  <p key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">!</span> {r}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matches VCs */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {d.matchedVCs} ({matches.length})
        </h2>
        {matches.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-gray-500">
              {d.noMatch}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map((match, i) => {
              const vc = match.venture_capital as any;
              return (
                <Card
                  key={match.id}
                  className={i === 0 ? "border-blue-200 shadow-md" : ""}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {i === 0 && (
                            <Badge variant="default" className="text-xs">
                              {d.topMatch}
                            </Badge>
                          )}
                          <h3 className="font-semibold text-gray-900">
                            {vc?.name ?? d.unknown}
                          </h3>
                          <ScoreBadge score={match.score} />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{match.analysis}</p>
                        {vc && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {vc.sectors?.slice(0, 3).map((s: string) => (
                              <Badge key={s} variant="outline" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                            {vc.stages?.slice(0, 2).map((s: string) => (
                              <Badge key={s} variant="secondary" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {vc && (
                          <p className="text-xs text-gray-400">
                            {d.ticket} : {vc.ticket_min?.toLocaleString("fr-FR")} € —{" "}
                            {vc.ticket_max?.toLocaleString("fr-FR")} €
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
        )}
      </div>
    </div>
  );
}

function DashboardNavbar() {
  const { t } = useLanguage();
  const { signOut } = useAuth();
  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm">{t.nav.dashboardStartup}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button variant="ghost" size="sm" onClick={signOut} className="text-slate-500 text-xs">
            Se déconnecter
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default function StartupDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
