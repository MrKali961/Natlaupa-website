import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CGU — Conditions Générales d'Utilisation | Natlaupa",
  description: "Conditions Générales d'Utilisation du site et des services Natlaupa, incluant les informations de médiation de la consommation.",
  alternates: { canonical: "/cgu" },
  robots: { index: true, follow: true },
};

export default function CGU() {
  return (
    <>
      <main className="bg-noir min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Conditions</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-6">
              Conditions Générales d&apos;Utilisation
            </h1>
            <div className="w-16 h-px bg-gold mb-6" />
            <p className="text-slate-400 text-sm">
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation du site <strong className="text-white">natlaupa.com</strong> et des services proposés par Natlaupa. En utilisant ce site, vous acceptez sans réserve les présentes CGU.
            </p>
            <p className="text-slate-500 text-xs mt-3">Dernière mise à jour : Avril 2026</p>
          </div>

          <div className="space-y-12 text-slate-300 leading-relaxed">

            {/* Présentation du service */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">1. Présentation des Services Natlaupa</h2>
              <div className="border border-gold/20 rounded-sm p-6 bg-gold/5 mb-4">
                <p className="text-gold text-xs uppercase tracking-widest mb-3">Ce que propose Natlaupa</p>
                <p className="text-slate-200 leading-relaxed">
                  Natlaupa est une plateforme de conciergerie de voyage haut de gamme qui met en relation des voyageurs exigeants avec des hôtels et hébergements de luxe sélectionnés. Notre service comprend :
                </p>
                <ul className="mt-4 space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">—</span>
                    <span>La présentation et la mise en valeur d'établissements hôteliers soigneusement sélectionnés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">—</span>
                    <span>Un service de mise en relation entre les voyageurs et les hôtels partenaires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">—</span>
                    <span>Des recommandations personnalisées basées sur les préférences et styles de voyage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">—</span>
                    <span>Un programme de membership exclusif (Natlaupa Angel) pour les professionnels de l'hôtellerie et du voyage</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-white/10 rounded-sm p-4 bg-white/5">
                  <p className="text-gold text-xs uppercase tracking-widest mb-2">Pour qui ?</p>
                  <p className="text-slate-400 text-sm">Voyageurs en quête d'hébergements luxueux et d'expériences uniques, ainsi que les professionnels de l'hôtellerie souhaitant rejoindre notre réseau.</p>
                </div>
                <div className="border border-white/10 rounded-sm p-4 bg-white/5">
                  <p className="text-gold text-xs uppercase tracking-widest mb-2">Gratuit pour les voyageurs ?</p>
                  <p className="text-slate-400 text-sm">
                    La prise de contact initiale est gratuite pour les voyageurs. Les modalités de rémunération (frais de service, marge, commission partenaire) sont précisées avant toute confirmation de réservation.
                  </p>
                </div>
              </div>
            </section>

            {/* Accès au site */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">2. Accès au Site</h2>
              <p className="text-slate-400">
                L'accès au site natlaupa.com est gratuit. Natlaupa se réserve le droit de modifier, suspendre ou interrompre l'accès au site à tout moment, notamment pour des raisons de maintenance, sans préavis ni responsabilité.
              </p>
              <p className="text-slate-400 mt-3">
                L'utilisateur est responsable de l'équipement et de la connexion internet nécessaires à l'accès au site. Natlaupa ne peut être tenue responsable des perturbations d'accès liées au réseau internet ou à l'équipement de l'utilisateur.
              </p>
            </section>

            {/* Inscription et compte */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">3. Newsletter & Communications</h2>
              <p className="text-slate-400">
                L'inscription à la newsletter Natlaupa est basée sur le consentement explicite de l'utilisateur. Vous pouvez vous désinscrire à tout moment en cliquant sur le lien de désinscription présent dans chaque email ou en nous contactant à{" "}
                <a href="mailto:Hello@natlaupa.com" className="text-gold hover:text-white transition-colors underline">Hello@natlaupa.com</a>.
              </p>
            </section>

            {/* Programme Angel */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">4. Programme Natlaupa Angel</h2>
              <p className="text-slate-400 mb-4">
                Le programme Natlaupa Angel est un club exclusif pour les professionnels de l'hôtellerie et du voyage de luxe. L'adhésion est soumise à une cotisation annuelle de <strong className="text-white">60 €</strong> et à l'acceptation de la candidature par Natlaupa.
              </p>
              <div className="border border-white/10 rounded-sm p-4 bg-white/5 space-y-2 text-sm">
                <p className="text-slate-400">La cotisation annuelle de 60 € donne accès à :</p>
                <ul className="space-y-1 text-slate-300 ml-4">
                  <li>— Accès au réseau de professionnels Natlaupa</li>
                  <li>— Opportunités de collaboration et de mentorat</li>
                  <li>— Accès privilégié aux offres et actualités Natlaupa</li>
                  <li className="text-slate-500 italic text-sm">
                    Les avantages détaillés sont précisés lors de l&apos;adhésion.
                  </li>
                </ul>
              </div>
              <p className="text-slate-400 text-sm mt-4">
                Natlaupa se réserve le droit de refuser toute candidature sans avoir à justifier sa décision. La cotisation n'est pas remboursable après acceptation de la candidature.
              </p>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">5. Propriété Intellectuelle</h2>
              <p className="text-slate-400">
                L'ensemble des contenus du site natlaupa.com (textes, images, logos, vidéos, données) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou utilisation sans autorisation préalable écrite de Natlaupa est interdite et constitue une contrefaçon.
              </p>
            </section>

            {/* Responsabilité */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">6. Limitation de Responsabilité</h2>
              <p className="text-slate-400">
                Natlaupa agit en qualité d'intermédiaire entre les voyageurs et les établissements hôteliers. Natlaupa ne peut être tenue responsable :
              </p>
              <ul className="mt-3 space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">—</span>
                  <span>Des informations fournies par les établissements partenaires</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">—</span>
                  <span>De la disponibilité ou des tarifs des hébergements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">—</span>
                  <span>Des interruptions de service liées à des causes extérieures (force majeure, panne internet, etc.)</span>
                </li>
              </ul>
            </section>

            {/* Données personnelles */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">7. Données Personnelles</h2>
              <p className="text-slate-400">
                Le traitement de vos données personnelles est régi par notre{" "}
                <a href="/politique-de-confidentialite" className="text-gold hover:text-white transition-colors underline">
                  Politique de Confidentialité
                </a>
                . En utilisant le site et ses formulaires, vous reconnaissez en avoir pris connaissance.
              </p>
            </section>

            {/* Médiation */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">8. Médiation de la Consommation</h2>
              <div className="border border-white/10 rounded-sm p-6 bg-white/5 space-y-4">
                <p className="text-gold text-xs uppercase tracking-widest mb-3">
                  Conformément à l&apos;article L616-1 du Code de la consommation
                </p>
                <p className="text-slate-300 mb-4">
                  En cas de litige non résolu après réclamation écrite adressée à NATLAUPA, le consommateur peut saisir gratuitement le médiateur de la consommation compétent :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Nom</p>
                    <p className="text-white font-medium">Philippe GARNIER</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Qualité</p>
                    <p className="text-white font-medium">Médiateur</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Email</p>
                    <p className="text-white font-medium">
                      <a href="mailto:bussy.garnier@orange.fr" className="text-gold hover:text-white transition-colors underline">
                        bussy.garnier@orange.fr
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Téléphone</p>
                    <p className="text-white font-medium">
                      <a href="tel:+33614208571" className="text-gold hover:text-white transition-colors">
                        06 14 20 85 71
                      </a>
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-slate-400 text-sm">
                    La saisine est gratuite pour le consommateur. Vous pouvez également recourir à la plateforme européenne :{" "}
                    <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors underline">
                      ec.europa.eu/consumers/odr
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">9. Droit Applicable & Juridiction</h2>
              <p className="text-slate-400">
                Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence des tribunaux français, sous réserve des dispositions d'ordre public applicables aux consommateurs.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">10. Contact</h2>
              <p className="text-slate-400">
                Pour toute question relative aux présentes CGU, vous pouvez nous contacter via notre{" "}
                <a href="/contact" className="text-gold hover:text-white transition-colors underline">formulaire de contact</a>{" "}
                ou par email à{" "}
                <a href="mailto:Hello@natlaupa.com" className="text-gold hover:text-white transition-colors underline">Hello@natlaupa.com</a>.
              </p>
            </section>

            <div className="border-t border-white/10 pt-8">
              <p className="text-slate-500 text-xs">
                Dernière mise à jour : Avril 2026. Natlaupa se réserve le droit de modifier les présentes CGU. Tout changement sera notifié sur cette page avec une mise à jour de la date.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
