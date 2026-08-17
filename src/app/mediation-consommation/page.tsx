import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Médiation de la Consommation | Natlaupa",
  description: "Informations sur la médiation de la consommation pour les litiges avec Natlaupa, conformément à l'article L616-1 du Code de la consommation.",
  alternates: { canonical: "/mediation-consommation" },
  robots: { index: true, follow: true },
};

export default function MediationConsommation() {
  return (
    <>
      <main className="bg-noir min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">
              Code de la consommation — Art. L616-1
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-6">
              Médiation de la Consommation
            </h1>
            <div className="w-16 h-px bg-gold mb-6" />
            <p className="text-slate-300 text-sm leading-relaxed">
              Conformément aux dispositions du Code de la consommation relatives à la médiation de la consommation, le client consommateur a la possibilité de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige l'opposant à NATLAUPA, sous réserve d'avoir préalablement adressé une réclamation écrite à NATLAUPA.
            </p>
          </div>

          <div className="space-y-12 text-slate-300 leading-relaxed">

            {/* Étape préalable obligatoire */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">
                Étape préalable obligatoire — Réclamation à NATLAUPA
              </h2>
              <p className="text-slate-400 mb-6">
                Avant toute saisine d'un médiateur, le consommateur doit avoir tenté de résoudre le litige directement avec NATLAUPA par voie écrite.
              </p>
              <div className="border border-white/10 rounded p-6 bg-white/5 space-y-4">
                <div>
                  <p className="text-gold text-xs uppercase tracking-widest mb-2">Email</p>
                  <p className="text-slate-200">
                    <a href="mailto:Hello@natlaupa.com" className="text-gold hover:text-white transition-colors underline">
                      Hello@natlaupa.com
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-gold text-xs uppercase tracking-widest mb-2">Courrier</p>
                  <p className="text-slate-200">
                    NATLAUPA, 29 rue du Pont, 92200 Neuilly-sur-Seine, France
                  </p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-slate-500 text-sm">
                    NATLAUPA s'engage à répondre à toute réclamation dans un délai raisonnable. Si aucune solution satisfaisante n'est trouvée dans un délai de deux mois, le consommateur peut saisir le médiateur.
                  </p>
                </div>
              </div>
            </section>

            {/* Médiateur compétent */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">
                Médiateur compétent
              </h2>
              <div className="border border-white/10 rounded p-6 bg-white/5 space-y-4">
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
                    La saisine du médiateur est gratuite pour le consommateur. Elle doit être effectuée dans un délai d&apos;un an à compter de la réclamation écrite adressée à NATLAUPA.
                  </p>
                </div>
              </div>
            </section>

            {/* Plateforme européenne */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">
                Plateforme européenne de règlement en ligne des litiges (RLL)
              </h2>
              <p className="text-slate-400 mb-4">
                Vous pouvez également recourir à la plateforme de règlement en ligne des litiges mise en place par la Commission Européenne :
              </p>
              <p>
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-white transition-colors underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
            </section>

            {/* Base légale */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">
                Base légale
              </h2>
              <p className="text-slate-400">
                La médiation de la consommation est encadrée par les articles L616-1 et suivants du Code de la consommation (ordonnance n°2015-1033 du 20 août 2015) et par le décret n°2015-1382 du 30 octobre 2015.
              </p>
            </section>

            <div className="border-t border-white/10 pt-8">
              <p className="text-slate-500 text-xs">
                Dernière mise à jour : Avril 2026
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
