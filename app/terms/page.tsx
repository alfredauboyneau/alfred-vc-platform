"use client";

import { useLanguage } from "@/lib/i18n";
import { LegalPageShell } from "@/components/legal-page-shell";

export default function TermsPage() {
  const { lang } = useLanguage();

  const copy =
    lang === "en"
      ? {
          eyebrow: "Terms",
          title: "Terms of use",
          intro:
            "These terms describe the intended use of Alfred as a software product for startup qualification and VC matching. They are a concise operating framework, not a substitute for tailored legal review.",
          sections: [
            {
              title: "Service purpose",
              paragraphs: [
                "Alfred helps startups structure fundraising information, generate a financial review and rank potentially relevant French VC funds.",
                "For investors, Alfred helps structure thesis information and view startup files ranked against that thesis.",
              ],
            },
            {
              title: "No investment advice",
              paragraphs: [
                "Scores, recommendations and generated analyses are decision-support outputs only. They do not constitute legal, financial or investment advice.",
                "Users remain responsible for their own outreach, investment decisions, diligence and professional review.",
              ],
            },
            {
              title: "User responsibilities",
              paragraphs: [
                "Users are responsible for the accuracy of the information they submit and for the lawful use of the platform.",
                "Access credentials must be kept secure, and users must not attempt to misuse, scrape or degrade the service.",
              ],
            },
            {
              title: "Availability and limits",
              paragraphs: [
                "Alfred is provided on a best-effort basis. Availability, generated outputs and third-party service dependencies may evolve.",
                "The product may change prompts, scoring logic, interfaces and operating policies as the service matures.",
              ],
            },
            {
              title: "Commercial and legal completion",
              paragraphs: [
                "Before broader commercial rollout, these terms should be completed with the formal contracting entity, governing law, liability clauses and support contact details.",
              ],
            },
          ],
        }
      : {
          eyebrow: "Conditions",
          title: "Conditions d'utilisation",
          intro:
            "Ces conditions décrivent l'usage attendu d'Alfred comme logiciel de qualification startup et de matching VC. Elles constituent un cadre d'exploitation concis, pas un substitut à une revue juridique adaptée.",
          sections: [
            {
              title: "Objet du service",
              paragraphs: [
                "Alfred aide les startups à structurer leurs informations de levée, générer une revue financière et classer les fonds VC français potentiellement pertinents.",
                "Pour les investisseurs, Alfred aide à structurer la thèse d'investissement et à consulter des dossiers classés selon cette thèse.",
              ],
            },
            {
              title: "Absence de conseil en investissement",
              paragraphs: [
                "Les scores, recommandations et analyses générées sont des outils d'aide à la décision uniquement. Ils ne constituent ni un conseil juridique, ni financier, ni en investissement.",
                "Les utilisateurs restent responsables de leur prospection, de leurs décisions d'investissement, de leur due diligence et de leur revue professionnelle.",
              ],
            },
            {
              title: "Responsabilités utilisateur",
              paragraphs: [
                "Les utilisateurs sont responsables de l'exactitude des informations soumises et d'un usage licite de la plateforme.",
                "Les accès doivent être conservés de façon sécurisée et les utilisateurs ne doivent pas chercher à détourner, aspirer ou dégrader le service.",
              ],
            },
            {
              title: "Disponibilité et limites",
              paragraphs: [
                "Alfred est fourni sur une base best effort. La disponibilité, les rendus générés et la dépendance à des services tiers peuvent évoluer.",
                "Le produit peut faire évoluer ses prompts, sa logique de scoring, ses interfaces et ses politiques d'exploitation à mesure de sa maturation.",
              ],
            },
            {
              title: "Compléments commerciaux et juridiques",
              paragraphs: [
                "Avant un déploiement commercial plus large, ces conditions devront être complétées avec l'entité contractante formelle, la loi applicable, les clauses de responsabilité et les coordonnées de support.",
              ],
            },
          ],
        };

  return <LegalPageShell {...copy} />;
}
