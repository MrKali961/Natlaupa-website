import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Natlaupa",
  description: "Politique de confidentialité et de protection des données personnelles de natlaupa.com, conforme au RGPD (Règlement UE 2016/679).",
  alternates: { canonical: "/politique-de-confidentialite" },
  robots: { index: true, follow: true },
};

export default function PolitiqueDeConfidentialite() {
  return (
    <>
      {/* lang="fr" because this page is written in French while the root layout hardcodes
          <html lang="en">. In the App Router only the ROOT layout can render <html>, and a
          server layout cannot read the pathname, so per-route <html lang> would mean a second
          root layout in a route group — duplicating the html/body shell, fonts and providers
          for six static pages. A subtree lang is valid HTML, correctly scopes the declaration
          to the French content, and is what screen readers and translation tools actually
          read for pronunciation. Same pattern already used for the homepage disclosure. */}
      <main lang="fr" className="bg-noir min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">RGPD</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-6">
              Politique de Confidentialité
            </h1>
            <div className="w-16 h-px bg-gold mb-6" />
            <p className="text-slate-400 text-sm">
              Natlaupa accorde une importance primordiale à la protection de vos données personnelles. La présente politique de confidentialité vous informe des conditions dans lesquelles vos données sont collectées, traitées et conservées, conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi française Informatique et Libertés.
            </p>
            <p className="text-slate-500 text-xs mt-3">Dernière mise à jour : 12 juin 2026</p>
          </div>

          <div className="space-y-12 text-slate-300 leading-relaxed">

            {/* Responsable du traitement */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">1. Responsable du Traitement</h2>
              <div className="border border-white/10 rounded-sm p-6 bg-white/5 space-y-2">
                <p><span className="text-gold text-xs uppercase tracking-widest">Société :</span> <span className="text-white ml-2">NATLAUPA (SASU)</span></p>
                <p>
                  <span className="text-gold text-xs uppercase tracking-widest">Siège :</span>{" "}
                  <span className="text-white ml-2">29 rue du Pont, 92200 Neuilly-sur-Seine, France</span>
                </p>
                <p>
                  <span className="text-gold text-xs uppercase tracking-widest">Email RGPD :</span>{" "}
                  <span className="text-white ml-2">Hello@natlaupa.com</span>
                </p>
                <p className="text-slate-500 italic text-xs mt-1 ml-2">Un email dédié rgpd@natlaupa.com est recommandé.</p>
              </div>
            </section>

            {/* Données collectées */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">2. Données Collectées</h2>
              <p className="text-slate-400 mb-6">
                Nous collectons uniquement les données personnelles nécessaires à la fourniture de nos services. Voici les catégories de données traitées :
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Formulaire de contact",
                    data: "Nom, adresse email, numéro de téléphone (optionnel), message",
                    purpose: "Répondre à votre demande d'information",
                    basis: "Intérêt légitime (art. 6.1.f RGPD)",
                    retention: "3 ans à compter du dernier contact",
                  },
                  {
                    title: "Newsletter",
                    data: "Prénom, nom (optionnels), adresse email",
                    purpose: "Envoi de communications commerciales (offres, actualités Natlaupa)",
                    basis: "Consentement explicite (art. 6.1.a RGPD)",
                    retention: "Jusqu'au retrait du consentement (désinscription)",
                  },
                  {
                    title: "Demande de renseignement sur une offre",
                    data: "Nom, email, téléphone, dates de voyage, nombre de voyageurs, message",
                    purpose: "Traitement de votre demande de réservation ou de renseignement",
                    basis: "Exécution d'un contrat ou de mesures pré-contractuelles (art. 6.1.b RGPD)",
                    retention: "5 ans à compter de la demande (obligations comptables)",
                  },
                  {
                    title: "Candidature Natlaupa Angel",
                    data: "Prénom, nom, email, téléphone, poste actuel, années d'expérience, lettre de motivation",
                    purpose: "Évaluation de votre candidature au programme Angel",
                    basis: "Consentement (art. 6.1.a RGPD)",
                    retention: "2 ans après la décision finale",
                  },
                  {
                    title: "Partenariat hôtel",
                    data: "Prénom, nom, email, téléphone, nom de l'établissement, message",
                    purpose: "Traitement de votre demande de partenariat",
                    basis: "Intérêt légitime / pré-contractuel (art. 6.1.f & 6.1.b RGPD)",
                    retention: "3 ans à compter du dernier contact",
                  },
                  {
                    title: "Navigation & Analytics",
                    data: "Adresse IP (anonymisée), pages visitées, durée de session, type d'appareil",
                    purpose: "Mesure d'audience et amélioration du site (Google Analytics 4)",
                    basis: "Consentement (art. 6.1.a RGPD)",
                    retention: "14 mois (paramètre Google Analytics)",
                  },
                  {
                    title: "Personnalisation",
                    data: "Identifiant de session (localStorage), préférences de voyages, hôtels consultés",
                    purpose: "Recommandations personnalisées d'hôtels et de destinations",
                    basis: "Consentement (art. 6.1.a RGPD)",
                    retention: "Durée de la session + 30 jours",
                  },
                ].map((item) => (
                  <div key={item.title} className="border border-white/10 rounded-sm overflow-hidden">
                    <div className="bg-gold/10 border-b border-white/10 px-4 py-3">
                      <h3 className="text-gold text-sm font-semibold uppercase tracking-wider">{item.title}</h3>
                    </div>
                    <div className="px-4 py-4 space-y-2 text-sm">
                      <p><span className="text-slate-500">Données :</span> <span className="text-slate-200">{item.data}</span></p>
                      <p><span className="text-slate-500">Finalité :</span> <span className="text-slate-200">{item.purpose}</span></p>
                      <p><span className="text-slate-500">Base légale :</span> <span className="text-slate-200">{item.basis}</span></p>
                      <p><span className="text-slate-500">Conservation :</span> <span className="text-slate-200">{item.retention}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Destinataires */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">3. Destinataires de vos Données</h2>
              <p className="text-slate-400 mb-4">
                Vos données sont traitées par Natlaupa et peuvent être transmises aux sous-traitants suivants, dans le strict cadre de l'exécution de leurs missions :
              </p>
              <div className="border border-white/10 rounded-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Prestataire</th>
                      <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Rôle</th>
                      <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Pays</th>
                      <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Garantie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr>
                      <td className="px-4 py-3 text-white">The Elites Solutions (Jhonny Jneid)</td>
                      <td className="px-4 py-3 text-slate-400">Hébergement API backend</td>
                      <td className="px-4 py-3 text-slate-400">Liban</td>
                      <td className="px-4 py-3 text-slate-400">CCT</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-white">Vercel Inc.</td>
                      <td className="px-4 py-3 text-slate-400">Hébergement site web</td>
                      <td className="px-4 py-3 text-slate-400">États-Unis</td>
                      <td className="px-4 py-3 text-slate-400">CCT</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-white">Google LLC</td>
                      <td className="px-4 py-3 text-slate-400">Analytics (GA4)</td>
                      <td className="px-4 py-3 text-slate-400">États-Unis</td>
                      <td className="px-4 py-3 text-slate-400">CCT</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-white">Mapbox Inc.</td>
                      <td className="px-4 py-3 text-slate-400">Cartographie</td>
                      <td className="px-4 py-3 text-slate-400">États-Unis</td>
                      <td className="px-4 py-3 text-slate-400">CCT</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-white">useSend (instance auto-hébergée) + Amazon Web Services SES</td>
                      <td className="px-4 py-3 text-slate-400">Envoi d&apos;emails transactionnels et newsletters (infrastructure d&apos;envoi)</td>
                      <td className="px-4 py-3 text-slate-400">UE (région eu-west-1, Irlande)</td>
                      <td className="px-4 py-3 text-slate-400">Données hébergées dans l&apos;UE</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-white">WhatsApp / Meta Platforms</td>
                      <td className="px-4 py-3 text-slate-400">Transmission candidatures/partenariat via WhatsApp</td>
                      <td className="px-4 py-3 text-slate-400">États-Unis</td>
                      <td className="px-4 py-3 text-slate-400">CCT</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-white">Google LLC (Gemini AI)</td>
                      <td className="px-4 py-3 text-slate-400">IA recommandations</td>
                      <td className="px-4 py-3 text-slate-400">États-Unis</td>
                      <td className="px-4 py-3 text-slate-400">CCT</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                CCT = Clauses Contractuelles Types approuvées par la Commission Européenne, garantissant un niveau de protection adéquat pour les transferts vers des pays tiers.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">4. Cookies & Technologies de Traçage</h2>
              <p className="text-slate-400">
                Nous utilisons des cookies et technologies similaires sur notre site. Pour une information complète sur les cookies que nous utilisons, leurs finalités et comment les gérer, consultez notre{" "}
                <a href="/politique-cookies" className="text-gold hover:text-white transition-colors underline">
                  Politique de Cookies
                </a>.
              </p>
            </section>

            {/* Vos droits */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">5. Vos Droits</h2>
              <p className="text-slate-400 mb-6">
                Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { right: "Droit d'accès", desc: "Obtenir une copie de vos données que nous traitons (art. 15 RGPD)" },
                  { right: "Droit de rectification", desc: "Faire corriger des données inexactes ou incomplètes (art. 16 RGPD)" },
                  { right: "Droit à l'effacement", desc: "Demander la suppression de vos données dans certains cas (art. 17 RGPD)" },
                  { right: "Droit à la portabilité", desc: "Recevoir vos données dans un format structuré et lisible (art. 20 RGPD)" },
                  { right: "Droit d'opposition", desc: "Vous opposer au traitement fondé sur notre intérêt légitime (art. 21 RGPD)" },
                  { right: "Droit de retrait du consentement", desc: "Retirer votre consentement à tout moment sans préjudice (art. 7 RGPD)" },
                  { right: "Droit à la limitation", desc: "Demander la suspension temporaire du traitement (art. 18 RGPD)" },
                  { right: "Droit de réclamation CNIL", desc: "Déposer une plainte auprès de la CNIL (cnil.fr) si vous estimez que vos droits ne sont pas respectés" },
                ].map((item) => (
                  <div key={item.right} className="border border-white/10 rounded-sm p-4 bg-white/5">
                    <h3 className="text-gold text-sm font-semibold mb-1">{item.right}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border border-gold/20 rounded-sm p-4 bg-gold/5">
                <p className="text-sm text-slate-300">
                  <strong className="text-gold">Pour exercer vos droits :</strong> Envoyez votre demande par email à{" "}
                  <span className="text-white">Hello@natlaupa.com</span>
                  {" "}en précisant votre identité. Nous répondrons dans un délai d'un mois (délai extensible à 3 mois pour les demandes complexes).
                </p>
                <p className="text-slate-500 italic text-xs mt-2">Un email dédié rgpd@natlaupa.com est recommandé.</p>
              </div>
            </section>

            {/* Sécurité */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">6. Sécurité des Données</h2>
              <p className="text-slate-400">
                Natlaupa met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, divulgation, altération ou destruction. Ces mesures comprennent notamment le chiffrement des communications (HTTPS/TLS), le contrôle des accès aux données et la pseudonymisation des données analytiques.
              </p>
            </section>

            {/* Contact CNIL */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">7. Autorité de Contrôle</h2>
              <p className="text-slate-400">
                Si vous estimez que le traitement de vos données ne respecte pas la réglementation, vous avez le droit d'adresser une réclamation à la Commission Nationale de l'Informatique et des Libertés (CNIL) :
              </p>
              <div className="border border-white/10 rounded-sm p-4 mt-4 bg-white/5">
                <p className="text-white font-medium">CNIL — Commission Nationale de l'Informatique et des Libertés</p>
                <p className="text-slate-400 text-sm mt-1">3, place de Fontenoy — TSA 80715 — 75334 Paris Cedex 07</p>
                <p className="text-slate-400 text-sm">Tél. : 01 53 73 22 22</p>
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors text-sm underline">
                  www.cnil.fr
                </a>
              </div>
            </section>

            <div className="border-t border-white/10 pt-8">
              <p className="text-slate-500 text-xs">
                Dernière mise à jour : 12 juin 2026. Natlaupa se réserve le droit de modifier la présente politique à tout moment. Toute modification sera publiée sur cette page avec une mise à jour de la date.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
