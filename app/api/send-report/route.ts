import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { type Startup, type Match, type FinancialAnalysis } from "@/lib/supabase";

type Lang = "fr" | "en";

function getNumberLocale(lang: Lang) {
  return lang === "en" ? "en-US" : "fr-FR";
}

function getEmailCopy(lang: Lang) {
  if (lang === "en") {
    return {
      title: "Your Alfred report",
      hero: "Your analysis is ready,",
      fundsAnalyzed: "VC funds were analyzed for you",
      financialHealth: "Financial health",
      ltvCac: "LTV/CAC Ratio",
      strengths: "Strengths",
      risks: "Watchouts",
      topMatches: "Your top VC matches",
      topMatch: "TOP MATCH",
      ticket: "Ticket",
      ctaText: "Access your full dashboard to see all matches and contact VCs directly.",
      ctaButton: "View my dashboard",
      footer: "Alfred · AI-powered VC x Startup matching platform",
      missingEmail: "Missing email",
      subject: "AI analysis",
      matchedVcs: "matched VCs",
      sendError: "Email sending error",
    };
  }

  return {
    title: "Votre rapport Alfred",
    hero: "Votre analyse est prête,",
    fundsAnalyzed: "fonds VC ont été analysés pour vous",
    financialHealth: "Santé financière",
    ltvCac: "Ratio LTV/CAC",
    strengths: "Points forts",
    risks: "Points de vigilance",
    topMatches: "Vos meilleurs fonds compatibles",
    topMatch: "MEILLEUR MATCH",
    ticket: "Ticket",
    ctaText: "Accédez à votre tableau de bord complet pour voir tous les fonds compatibles et contacter directement les VCs.",
    ctaButton: "Voir mon tableau de bord",
    footer: "Alfred · Plateforme de qualification VC x startup",
    missingEmail: "Email manquant",
    subject: "Votre analyse",
    matchedVcs: "fonds compatibles",
    sendError: "Erreur d'envoi de l'email",
  };
}

function getReadinessLabel(r: string, lang: Lang) {
  if (lang === "en") {
    if (r === "ready") return "✅ Ready to raise";
    if (r === "soon") return "🟡 Preparing to raise";
    return "🔴 Not yet ready";
  }

  if (r === "ready") return "✅ Prêt à lever";
  if (r === "soon") return "🟡 Levée en préparation";
  return "🔴 Pas encore prêt";
}

function getScoreColor(score: number) {
  if (score >= 75) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#dc2626";
}

function buildEmailHTML(startup: Startup, matches: Match[], fa: FinancialAnalysis, lang: Lang) {
  const top5 = matches.slice(0, 5);
  const copy = getEmailCopy(lang);
  const numberLocale = getNumberLocale(lang);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>${copy.title} — ${startup.name}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f8fafc; margin:0; padding:0;">
  <div style="max-width:600px; margin:0 auto; background:white; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); margin-top:32px; margin-bottom:32px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8); padding:32px 40px; text-align:center;">
      <div style="display:inline-flex; align-items:center; gap:10px; margin-bottom:8px;">
        <div style="background:rgba(255,255,255,0.2); border-radius:8px; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
          <span style="color:white; font-size:18px;">⚡</span>
        </div>
        <span style="color:white; font-size:22px; font-weight:700; letter-spacing:-0.5px;">Alfred</span>
      </div>
      <h1 style="color:white; font-size:24px; font-weight:700; margin:16px 0 8px; line-height:1.2;">
        ${copy.hero} ${startup.name} 🎉
      </h1>
      <p style="color:rgba(255,255,255,0.8); font-size:14px; margin:0;">
        ${matches.length} ${copy.fundsAnalyzed}
      </p>
    </div>

    <!-- Score santé financière -->
    <div style="padding:32px 40px; border-bottom:1px solid #f1f5f9;">
      <h2 style="font-size:16px; font-weight:600; color:#0f172a; margin:0 0 16px;">📊 ${copy.financialHealth}</h2>
      <div style="background:#f8fafc; border-radius:12px; padding:20px; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <p style="font-size:32px; font-weight:800; color:${getScoreColor(fa.financial_health_score)}; margin:0;">
            ${fa.financial_health_score}/100
          </p>
          <p style="color:#64748b; font-size:13px; margin:4px 0 0;">${getReadinessLabel(fa.investment_readiness, lang)}</p>
        </div>
        <div style="text-align:right;">
          <p style="font-size:13px; font-weight:600; color:#0f172a; margin:0 0 4px;">${copy.ltvCac}</p>
          <p style="font-size:20px; font-weight:700; color:#2563eb; margin:0;">
            ${fa.unit_economics?.ltv_cac_ratio ? fa.unit_economics.ltv_cac_ratio + "x" : "N/A"}
          </p>
        </div>
      </div>
      <p style="color:#475569; font-size:14px; line-height:1.6; margin:16px 0 0;">${fa.summary}</p>
    </div>

    <!-- Forces & Risques -->
    <div style="padding:24px 40px; border-bottom:1px solid #f1f5f9;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div>
          <p style="font-size:13px; font-weight:600; color:#16a34a; margin:0 0 10px;">✅ ${copy.strengths}</p>
          ${fa.key_strengths.map(s => `
            <div style="display:flex; align-items:flex-start; gap:8px; margin-bottom:6px;">
              <span style="color:#16a34a; font-size:13px; margin-top:1px;">+</span>
              <span style="color:#374151; font-size:13px; line-height:1.4;">${s}</span>
            </div>
          `).join("")}
        </div>
        <div>
          <p style="font-size:13px; font-weight:600; color:#dc2626; margin:0 0 10px;">⚠️ ${copy.risks}</p>
          ${fa.key_risks.map(r => `
            <div style="display:flex; align-items:flex-start; gap:8px; margin-bottom:6px;">
              <span style="color:#dc2626; font-size:13px; margin-top:1px;">!</span>
              <span style="color:#374151; font-size:13px; line-height:1.4;">${r}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <!-- Top matches -->
    <div style="padding:24px 40px; border-bottom:1px solid #f1f5f9;">
      <h2 style="font-size:16px; font-weight:600; color:#0f172a; margin:0 0 16px;">
        🏆 ${lang === "en" ? `Your top ${top5.length} VC matches` : `Vos ${top5.length} fonds les plus compatibles`}
      </h2>
      ${top5.map((m, i) => {
        const vc = m.venture_capital as any;
        return `
        <div style="border:1px solid ${i === 0 ? "#bfdbfe" : "#e2e8f0"}; border-radius:12px; padding:16px; margin-bottom:12px; background:${i === 0 ? "#eff6ff" : "white"};">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              ${i === 0 ? `<span style="background:#2563eb; color:white; font-size:10px; font-weight:700; padding:2px 8px; border-radius:100px;">${copy.topMatch}</span>` : ""}
              <span style="font-size:15px; font-weight:600; color:#0f172a;">${vc?.name ?? "VC"}</span>
            </div>
            <span style="font-size:14px; font-weight:700; color:${getScoreColor(m.score)}; background:${m.score >= 75 ? "#dcfce7" : m.score >= 50 ? "#fef3c7" : "#fee2e2"}; padding:3px 10px; border-radius:100px;">
              ${m.score}/100
            </span>
          </div>
          <p style="color:#64748b; font-size:13px; line-height:1.5; margin:0 0 8px;">${m.analysis}</p>
          ${vc?.ticket_min ? `<p style="color:#94a3b8; font-size:12px; margin:0;">${copy.ticket} : ${vc.ticket_min.toLocaleString(numberLocale)} € — ${vc.ticket_max?.toLocaleString(numberLocale)} €</p>` : ""}
        </div>
        `;
      }).join("")}
    </div>

    <!-- CTA -->
    <div style="padding:32px 40px; text-align:center; background:#f8fafc;">
      <p style="color:#475569; font-size:14px; margin:0 0 20px;">
        ${copy.ctaText}
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://alfred-vc-platform.vercel.app"}/startup/dashboard?id=${startup.id}"
         style="background:#2563eb; color:white; text-decoration:none; font-weight:600; font-size:14px; padding:14px 32px; border-radius:8px; display:inline-block;">
        ${copy.ctaButton} →
      </a>
      <p style="color:#94a3b8; font-size:12px; margin:20px 0 0;">
        ${copy.footer}
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      // Si pas de clé Resend, on log juste et on continue sans planter
      console.log("[send-report] RESEND_API_KEY non configuré — email ignoré");
      return NextResponse.json({ success: true, skipped: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { startup, matches, financial_analysis, lang = "fr" } = await req.json();
    const normalizedLang: Lang = lang === "en" ? "en" : "fr";
    const copy = getEmailCopy(normalizedLang);

    if (!startup?.contact_email) {
      return NextResponse.json({ error: copy.missingEmail }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Alfred <onboarding@resend.dev>",
      to: [startup.contact_email],
      subject: `⚡ ${startup.name} — ${copy.subject} + ${matches.length} ${copy.matchedVcs}`,
      html: buildEmailHTML(startup, matches, financial_analysis, normalizedLang),
    });

    if (error) {
      console.error("[send-report] Erreur Resend:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("[send-report] Erreur:", err);
    return NextResponse.json({ error: "Email sending error" }, { status: 500 });
  }
}
