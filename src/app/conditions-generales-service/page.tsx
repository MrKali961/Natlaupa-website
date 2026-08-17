import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CGS — Conditions Générales de Service | Natlaupa",
  description:
    "Conditions Générales de Service (CGS / CGV) de Natlaupa — conciergerie hôtelière, conseil, mise en relation et assistance à la réservation.",
  alternates: { canonical: "/conditions-generales-service" },
  robots: { index: true, follow: true },
};

export default function ConditionsGeneralesService() {
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
            <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">CGS / CGV</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-6">
              Conditions Générales de Service
            </h1>
            <div className="w-16 h-px bg-gold mb-6" />
            <p className="text-slate-400 text-sm">
              Les présentes Conditions générales de service définissent les conditions dans lesquelles
              NATLAUPA propose ses prestations de conseil, conciergerie hôtelière, mise en relation,
              assistance à la réservation et, le cas échéant, encaissement de prestations ou frais de
              service.
            </p>
            <p className="text-slate-500 text-xs mt-3">Dernière mise à jour : 28 avril 2026</p>
          </div>

          {/* Point Atout France notice */}
          <div className="border border-gold/20 bg-gold/5 rounded p-4 mb-12">
            <p className="text-amber-300 text-sm">
              ⚠️ Point Atout France : si NATLAUPA vend, assemble ou organise des prestations de voyage
              ou de séjour, une immatriculation au registre des opérateurs de voyages et de séjours
              peut être requise. Ce point doit être validé par un avocat spécialisé avant la
              commercialisation de forfaits touristiques.
            </p>
          </div>

          <div className="space-y-12 text-slate-300 leading-relaxed">

            {/* 1. Objet */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">1. Objet</h2>
              <p className="text-slate-400">
                Les présentes Conditions générales de service définissent les conditions dans lesquelles
                NATLAUPA propose ses prestations de conseil, conciergerie hôtelière, mise en relation,
                assistance à la réservation et, le cas échéant, encaissement de prestations ou frais de
                service.
              </p>
            </section>

            {/* 2. Identité du prestataire */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">2. Identité du prestataire</h2>
              <div className="border border-white/10 rounded-sm p-6 space-y-3 bg-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Dénomination</p>
                    <p className="text-white font-medium">NATLAUPA, SASU au capital de 2 000 euros</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Immatriculation</p>
                    <p className="text-white font-medium">901 265 082 R.C.S. Nanterre</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Siège social</p>
                    <p className="text-white font-medium">29 rue du Pont, 92200 Neuilly-sur-Seine, France</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Contact</p>
                    <p className="text-white font-medium">
                      <a href="mailto:Hello@natlaupa.com" className="text-gold hover:text-white transition-colors underline">
                        Hello@natlaupa.com
                      </a>{" "}
                      | +33 7 75 74 38 75
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Nature des services */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">3. Nature des services</h2>
              <p className="text-slate-400 mb-4">NATLAUPA peut proposer notamment :</p>
              <div className="border border-white/10 rounded-sm p-6 bg-white/5">
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">—</span>
                    <span>Recherche et sélection d&apos;hôtels ou d&apos;expériences associées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">—</span>
                    <span>Conseil personnalisé en matière de séjour hôtelier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">—</span>
                    <span>Assistance à la réservation auprès d&apos;hôtels partenaires ou tiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">—</span>
                    <span>Mise en relation entre clients et professionnels de l&apos;hôtellerie</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">—</span>
                    <span>
                      Accès à des conditions, avantages ou attentions négociés lorsque ceux-ci sont
                      disponibles et confirmés
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">—</span>
                    <span>
                      Émission de devis, confirmations ou liens de paiement pour certaines prestations
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 4. Rôle de NATLAUPA */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">4. Rôle de NATLAUPA</h2>
              <p className="text-slate-400">
                Sauf indication contraire écrite, les prestations d&apos;hébergement sont fournies par les
                établissements hôteliers sélectionnés. NATLAUPA intervient comme intermédiaire, conseil,
                apporteur d&apos;affaires, service de conciergerie ou assistant de réservation. Les conditions
                propres à l&apos;hôtel ou au prestataire tiers s&apos;appliquent au séjour concerné et sont
                communiquées au client avant confirmation lorsque disponibles.
              </p>
            </section>

            {/* 5. Devis, disponibilité et confirmation */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">5. Devis, disponibilité et confirmation</h2>
              <p className="text-slate-400">
                Toute demande de réservation fait l&apos;objet d&apos;une vérification de disponibilité. Les
                informations communiquées avant confirmation peuvent évoluer tant que la réservation n&apos;a
                pas été validée par le prestataire concerné et, le cas échéant, payée par le client. Une
                réservation n&apos;est définitive qu&apos;après confirmation écrite par NATLAUPA ou par le
                prestataire concerné.
              </p>
            </section>

            {/* 6. Prix et frais de service */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">6. Prix et frais de service</h2>
              <p className="text-slate-400 mb-4">
                Les prix communiqués au client incluent les éléments précisés dans l&apos;offre ou le devis.
                Selon le cas, NATLAUPA peut être rémunérée par :
              </p>
              <ul className="space-y-2 text-slate-400 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">—</span>
                  <span>des frais de service facturés au client</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">—</span>
                  <span>une marge intégrée au prix total communiqué</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">—</span>
                  <span>une commission partenaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">—</span>
                  <span>une combinaison de ces modalités</span>
                </li>
              </ul>
              <p className="text-slate-400">
                Les taxes, frais de séjour, frais bancaires, frais de change ou frais additionnels non
                inclus dans l&apos;offre restent à la charge du client lorsqu&apos;ils sont applicables.
              </p>
            </section>

            {/* 7. Paiement */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">7. Paiement</h2>
              <p className="text-slate-400">
                Le paiement peut être effectué par lien de paiement sécurisé, virement bancaire ou tout
                autre moyen indiqué par NATLAUPA. En cas de paiement par carte bancaire via Stripe ou un
                autre prestataire de paiement, les données de paiement sont traitées par le prestataire de
                paiement selon ses propres conditions. NATLAUPA ne conserve pas les données complètes de
                carte bancaire.
              </p>
            </section>

            {/* 8. Annulation, modification et remboursement */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">
                8. Annulation, modification et remboursement
              </h2>
              <p className="text-slate-400">
                Les conditions d&apos;annulation, modification, non-présentation et remboursement varient selon
                l&apos;hôtel, le tarif choisi, la période, les conditions particulières du devis et le
                prestataire concerné. Elles sont communiquées au client avant confirmation lorsqu&apos;elles
                sont disponibles. Les frais de service Natlaupa peuvent être non remboursables si le
                service a été exécuté ou si cela est indiqué avant paiement.
              </p>
            </section>

            {/* 9. Droit de rétractation */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">9. Droit de rétractation</h2>
              <p className="text-slate-400">
                Pour les prestations d&apos;hébergement, de restauration, de transport, de location de voiture
                ou d&apos;activités de loisirs fournies à une date ou période déterminée, le droit de
                rétractation ne s&apos;applique pas dans les conditions prévues par le Code de la consommation
                (art. L221-28). Pour les autres prestations de service, lorsque le client demande
                l&apos;exécution immédiate du service avant la fin du délai légal, il peut être demandé au
                client de reconnaître expressément que le service commence immédiatement et que les sommes
                correspondant au service déjà exécuté peuvent rester dues.
              </p>
            </section>

            {/* 10. Obligations du client */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">10. Obligations du client</h2>
              <p className="text-slate-400">
                Le client s&apos;engage à fournir des informations exactes, complètes et à jour : identité des
                voyageurs, dates, préférences, exigences particulières, documents nécessaires, données de
                facturation et coordonnées. Le client est responsable du respect des formalités
                administratives, sanitaires, de visa, de passeport, d&apos;assurance ou d&apos;entrée dans le pays
                de destination, sauf engagement spécifique écrit de NATLAUPA.
              </p>
            </section>

            {/* 11. Prestataires tiers */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">11. Prestataires tiers</h2>
              <p className="text-slate-400">
                Les hôtels, restaurants, transporteurs, guides, plateformes de paiement et autres
                prestataires tiers restent responsables de leurs propres prestations, conditions, règles
                internes et obligations légales. NATLAUPA ne peut être tenue responsable d&apos;un manquement
                imputable à un prestataire tiers, sauf faute directement imputable à NATLAUPA.
              </p>
            </section>

            {/* 12. Réclamations */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">12. Réclamations</h2>
              <p className="text-slate-400">
                Toute réclamation doit être adressée à NATLAUPA par email à{" "}
                <a
                  href="mailto:Hello@natlaupa.com"
                  className="text-gold hover:text-white transition-colors underline"
                >
                  Hello@natlaupa.com
                </a>{" "}
                ou par courrier à NATLAUPA, 29 rue du Pont, 92200 Neuilly-sur-Seine, en précisant
                l&apos;objet de la demande, les références de réservation, les justificatifs et les
                coordonnées du client.
              </p>
            </section>

            {/* 13. Médiation de la consommation */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">13. Médiation de la consommation</h2>
              <div className="border border-white/10 rounded-sm p-6 bg-white/5 space-y-4">
                <p className="text-gold text-xs uppercase tracking-widest mb-3">
                  Conformément à l&apos;article L616-1 du Code de la consommation
                </p>
                <p className="text-slate-300 mb-4">
                  En cas de litige non résolu après réclamation écrite adressée à NATLAUPA, le
                  consommateur peut saisir gratuitement le médiateur de la consommation compétent :
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
                    La saisine est gratuite pour le consommateur. Le consommateur peut également recourir à la plateforme de résolution en ligne des litiges de la Commission Européenne :{" "}
                    <a
                      href="https://ec.europa.eu/consumers/odr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-white transition-colors underline"
                    >
                      https://ec.europa.eu/consumers/odr
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* 14. Force majeure */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">14. Force majeure</h2>
              <p className="text-slate-400">
                NATLAUPA ne pourra être tenue responsable en cas d&apos;inexécution ou de retard résultant
                d&apos;un événement de force majeure ou de circonstances extérieures indépendantes de sa
                volonté, notamment catastrophes naturelles, grèves, troubles politiques, restrictions
                administratives, pandémies, incidents techniques majeurs ou défaillance d&apos;un prestataire
                tiers.
              </p>
            </section>

            {/* 15. Droit applicable */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">15. Droit applicable</h2>
              <p className="text-slate-400">
                Les présentes conditions sont soumises au droit français.
              </p>
            </section>

            <div className="border-t border-white/10 pt-8">
              <p className="text-slate-500 text-xs">
                Dernière mise à jour : 28 avril 2026. NATLAUPA se réserve le droit de modifier les
                présentes Conditions Générales de Service. Tout changement sera notifié sur cette page
                avec une mise à jour de la date.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
