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
  if (r === "ready") return <Badge variant="success">Prêt</Badge>;
  if (r === "soon") return <Badge variant="warning">Bientôt</Badge>;
  return <Badge variant="secondary">Pas encore</Badge>;
}

function TrajectoryIcon({ t }: { t: string }) {
  if (t === "exceptional" || t === "strong")
    return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (t === "moderate") return <Minus className="w-4 h-4 text-yellow-500" />;
  return <TrendingDown className="w-4 h-4 text-red-500" />;
}

/* ────────────────────────────────── tabs ── */

type Tab = "dealflow" | "profil";

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dealflow", label: "Deal Flow", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "profil", label: "Mon Profil", icon: <User className="w-4 h-4" /> },
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
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center mx-auto mb-6">
        <Building2 className="w-8 h-8 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Bienvenue sur Alfred !</h2>
      <p className="text-slate-500 mb-8 leading-relaxed">
        Vous n&apos;avez pas encore renseigné votre thèse d&apos;investissement. Complétez votre profil
        investisseur pour recevoir des dossiers de startups matchés à vos critères.
      </p>
      <Link href="/vc/register">
        <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 font-semibold">
          Créer mon profil investisseur <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
      <div className="mt-12 grid sm:grid-cols-3 gap-4 text-left">
        {[
          { icon: <Filter className="w-5 h-5 text-blue-600" />, title: "Deal flow filtré", desc: "Recevez uniquement des startups dans vos secteurs et stades cibles." },
          { icon: <TrendingUp className="w-5 h-5 text-blue-600" />, title: "Rapport IA inclus", desc: "Chaque dossier vient avec une analyse financière complète générée par Claude." },
          { icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />, title: "Score de compatibilité", desc: "Un score 0-100 indique l'alignement avec votre thèse d'investissement." },
        ].map((item) => (
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
        <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun dossier pour l&apos;instant</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Les startups matchées avec votre thèse apparaîtront ici. Votre profil est bien référencé dans notre base.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Dossiers reçus", value: matches.length },
          {
            label: "Score moyen",
            value: matches.length > 0
              ? Math.round(matches.reduce((acc, m) => acc + m.score, 0) / matches.length)
              : 0,
          },
          {
            label: "Prêts à lever",
            value: matches.filter((m: any) => m.startup?.financial_analysis?.investment_readiness === "ready").length,
          },
          { label: "Score ≥ 75", value: matches.filter((m) => m.score >= 75).length },
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
            <Filter className="w-4 h-4" /> Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <p className="text-xs text-slate-400">Stade</p>
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400">Secteur</p>
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger className="w-44 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400">Maturité</p>
              <Select value={filterReadiness} onValueChange={setFilterReadiness}>
                <SelectTrigger className="w-44 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="ready">Prêt</SelectItem>
                  <SelectItem value="soon">Bientôt</SelectItem>
                  <SelectItem value="not_ready">Pas encore</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste */}
      <div>
        <p className="text-sm text-slate-500 mb-3">{filtered.length} dossier{filtered.length > 1 ? "s" : ""}</p>
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-slate-400 text-sm">
              Aucun dossier ne correspond à ces filtres.
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
                          <Badge variant="secondary" className="text-xs">{startup?.sector}</Badge>
                          <Badge variant="outline" className="text-xs">{startup?.stage}</Badge>
                          <Badge variant="info" className="text-xs">
                            {startup?.amount_sought?.toLocaleString("fr-FR")} €
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 italic">&ldquo;{match.analysis}&rdquo;</p>

                        {/* Rapport financier développé */}
                        {isOpen && fa && (
                          <div className="mt-4 pt-4 border-t space-y-4">
                            <div className="flex items-center gap-2">
                              <TrajectoryIcon t={fa.growth_trajectory} />
                              <span className="text-sm font-semibold text-slate-700">
                                Score santé financière : {fa.financial_health_score}/100
                              </span>
                            </div>

                            {fa.unit_economics && (
                              <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-slate-500 mb-1">Unit Economics</p>
                                <p className="text-sm font-semibold text-slate-800">
                                  {fa.unit_economics.ltv_cac_ratio !== null
                                    ? `LTV/CAC ${fa.unit_economics.ltv_cac_ratio}x — ${fa.unit_economics.assessment}`
                                    : "Données insuffisantes"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">{fa.unit_economics.comment}</p>
                              </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Points forts
                                </p>
                                {fa.key_strengths.map((s: string, i: number) => (
                                  <p key={i} className="text-xs text-slate-600">+ {s}</p>
                                ))}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5" /> Risques
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
                          {isOpen ? "Réduire" : "Rapport IA"}
                        </Button>
                        {startup?.website && (
                          <a href={startup.website} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="outline" className="w-full gap-1">
                              <ExternalLink className="w-3 h-3" /> Site
                            </Button>
                          </a>
                        )}
                        {startup?.contact_email && (
                          <a href={`mailto:${startup.contact_email}`}>
                            <Button size="sm" className="w-full gap-1">
                              <Mail className="w-3 h-3" /> Contacter
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
        <CardHeader><CardTitle className="text-base">Critères d&apos;investissement</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {vc.sectors?.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 mb-2">Secteurs</p>
              <div className="flex flex-wrap gap-1.5">
                {vc.sectors.map((s: string) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>
          )}
          {vc.stages?.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 mb-2">Stades</p>
              <div className="flex flex-wrap gap-1.5">
                {vc.stages.map((s: string) => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
              </div>
            </div>
          )}
          {(vc.ticket_min || vc.ticket_max) && (
            <div>
              <p className="text-xs text-slate-400 mb-1">Ticket</p>
              <p className="text-sm font-medium text-slate-800">
                {vc.ticket_min?.toLocaleString("fr-FR")} € — {vc.ticket_max?.toLocaleString("fr-FR")} €
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {vc.investment_thesis && (
        <Card>
          <CardHeader><CardTitle className="text-base">Thèse d&apos;investissement</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{vc.investment_thesis}</p>
          </CardContent>
        </Card>
      )}

      {vc.notable_investments && (
        <Card>
          <CardHeader><CardTitle className="text-base">Investissements notables</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{vc.notable_investments}</p>
          </CardContent>
        </Card>
      )}

      <div className="pt-2">
        <Link href="/vc/register">
          <Button variant="outline" className="gap-2">
            Modifier mon profil <ArrowRight className="w-4 h-4" />
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
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      // Charger le VC lié à ce user
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
          <p className="text-slate-400 text-sm">Chargement…</p>
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
            Se déconnecter
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
