import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ResetCookiesButton from "@/components/ResetCookiesButton";

export const metadata: Metadata = {
  title: "Politique de Cookies | Natlaupa",
  description: "Politique de gestion des cookies et technologies de traçage sur natlaupa.com, conformément aux recommandations de la CNIL.",
  robots: { index: true, follow: true },
};

export default function PolitiqueCookies() {
  return (
    <>
      <main className="bg-deepBlue min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Cookies & Traçage</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-6">
              Politique de Cookies
            </h1>
            <div className="w-16 h-px bg-gold mb-6" />
            <p className="text-slate-400 text-sm">
              La présente politique explique comment natlaupa.com utilise les cookies et autres technologies de traçage, conformément à la Directive ePrivacy (2002/58/CE) et aux recommandations de la Commission Nationale de l'Informatique et des Libertés (CNIL) du 17 septembre 2020.
            </p>
            <p className="text-slate-500 text-xs mt-3">Dernière mise à jour : Avril 2026</p>
          </div>

          <div className="space-y-12 text-slate-300 leading-relaxed">

            {/* Qu'est-ce qu'un cookie */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">1. Qu&apos;est-ce qu&apos;un Cookie ?</h2>
              <p className="text-slate-400">
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) lors de votre visite sur un site web. Les cookies permettent au site de mémoriser vos actions et préférences (langue, paramètres d'affichage, connexion) sur une période donnée. Ils peuvent également être utilisés à des fins de mesure d'audience ou de personnalisation.
              </p>
              <p className="text-slate-400 mt-3">
                Sur notre site, nous utilisons également des technologies similaires stockées dans votre navigateur : le <strong className="text-white">localStorage</strong> et le <strong className="text-white">sessionStorage</strong>. Ces mécanismes fonctionnent de manière analogue aux cookies et sont soumis aux mêmes règles de consentement.
              </p>
            </section>

            {/* Cookies utilisés */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">2. Cookies Utilisés sur natlaupa.com</h2>

              {/* Essentiels */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <h3 className="text-white font-semibold">Cookies Essentiels</h3>
                  <span className="text-xs text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">Toujours actifs — Aucun consentement requis</span>
                </div>
                <div className="border border-white/10 rounded-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Nom</th>
                        <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Finalité</th>
                        <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Durée</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr>
                        <td className="px-4 py-3 text-white font-mono text-xs">natlaupa_cookie_consent</td>
                        <td className="px-4 py-3 text-slate-400">Mémoriser vos choix de cookies pour ne pas réafficher la bannière</td>
                        <td className="px-4 py-3 text-slate-400">13 mois</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-white font-mono text-xs">natlaupa_session_id</td>
                        <td className="px-4 py-3 text-slate-400">Identifiant de session anonyme pour le fonctionnement technique du site</td>
                        <td className="px-4 py-3 text-slate-400">Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <h3 className="text-white font-semibold">Cookies Analytiques</h3>
                  <span className="text-xs text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">Consentement requis</span>
                </div>
                <div className="border border-white/10 rounded-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Nom</th>
                        <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Émetteur</th>
                        <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Finalité</th>
                        <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Durée</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr>
                        <td className="px-4 py-3 text-white font-mono text-xs">_ga</td>
                        <td className="px-4 py-3 text-slate-400">Google Analytics</td>
                        <td className="px-4 py-3 text-slate-400">Distinguer les utilisateurs uniques</td>
                        <td className="px-4 py-3 text-slate-400">2 ans</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-white font-mono text-xs">_ga_ESC050HLP4</td>
                        <td className="px-4 py-3 text-slate-400">Google Analytics</td>
                        <td className="px-4 py-3 text-slate-400">Maintenir l'état de la session pour Google Analytics 4</td>
                        <td className="px-4 py-3 text-slate-400">2 ans</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  Google Analytics utilise le paramètre d'anonymisation IP. Les données sont transférées vers Google LLC (États-Unis) encadrées par des Clauses Contractuelles Types. Pour en savoir plus :{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors underline">
                    policies.google.com/privacy
                  </a>
                </p>
              </div>

              {/* Personnalisation */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <h3 className="text-white font-semibold">Cookies de Personnalisation</h3>
                  <span className="text-xs text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded">Consentement requis</span>
                </div>
                <div className="border border-white/10 rounded-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Nom</th>
                        <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Finalité</th>
                        <th className="text-left text-gold text-xs uppercase tracking-widest px-4 py-3">Durée</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr>
                        <td className="px-4 py-3 text-white font-mono text-xs">natlaupa_tracking_*</td>
                        <td className="px-4 py-3 text-slate-400">Enregistrer vos hôtels et destinations consultés pour personnaliser les recommandations</td>
                        <td className="px-4 py-3 text-slate-400">30 jours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Gestion du consentement */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">3. Gérer vos Préférences</h2>

              <div className="space-y-4">
                <div className="border border-white/10 rounded-sm p-4 bg-white/5">
                  <h3 className="text-white font-semibold mb-2">Via notre bandeau de cookies</h3>
                  <p className="text-slate-400 text-sm">
                    À votre première visite sur natlaupa.com, un bandeau vous permet d'accepter, refuser ou personnaliser les cookies. Vous pouvez modifier vos choix à tout moment en{" "}
                    <ResetCookiesButton />.
                  </p>
                </div>

                <div className="border border-white/10 rounded-sm p-4 bg-white/5">
                  <h3 className="text-white font-semibold mb-2">Via votre navigateur</h3>
                  <p className="text-slate-400 text-sm mb-3">Vous pouvez également configurer votre navigateur pour refuser tous les cookies. Notez que cela peut affecter certaines fonctionnalités du site :</p>
                  <ul className="space-y-1 text-slate-400 text-sm">
                    {[
                      { name: "Google Chrome", url: "support.google.com/chrome/answer/95647" },
                      { name: "Mozilla Firefox", url: "support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox" },
                      { name: "Safari", url: "support.apple.com/fr-fr/guide/safari/sfri11471/mac" },
                      { name: "Microsoft Edge", url: "support.microsoft.com/fr-fr/windows/microsoft-edge-données-de-navigation-et-confidentialité" },
                    ].map((browser) => (
                      <li key={browser.name} className="flex items-center gap-2">
                        <span className="text-gold">—</span>
                        <span>{browser.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-white/10 rounded-sm p-4 bg-white/5">
                  <h3 className="text-white font-semibold mb-2">Opt-out Google Analytics</h3>
                  <p className="text-slate-400 text-sm">
                    Vous pouvez également désactiver Google Analytics sur tous les sites en installant l'extension de navigateur officielle :{" "}
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors underline">
                      tools.google.com/dlpage/gaoptout
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Durée du consentement */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">4. Durée de Validité du Consentement</h2>
              <p className="text-slate-400">
                Votre consentement (ou refus) est mémorisé pendant <strong className="text-white">13 mois</strong>, conformément aux recommandations de la CNIL. Passé ce délai, ou si vous effacez les données de votre navigateur, le bandeau de consentement réapparaîtra lors de votre prochaine visite.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">5. Contact & Droits</h2>
              <p className="text-slate-400">
                Pour toute question sur notre utilisation des cookies ou pour exercer vos droits sur les données collectées via ces technologies, consultez notre{" "}
                <a href="/politique-de-confidentialite" className="text-gold hover:text-white transition-colors underline">
                  Politique de Confidentialité
                </a>{" "}
                ou contactez-nous à :{" "}
                <a href="mailto:Hello@natlaupa.com" className="text-gold hover:text-white transition-colors underline">Hello@natlaupa.com</a>
              </p>
            </section>

            <div className="border-t border-white/10 pt-8">
              <p className="text-slate-500 text-xs">
                Dernière mise à jour : Avril 2026.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
