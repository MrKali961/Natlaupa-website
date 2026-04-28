import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Médiation de la Consommation | Natlaupa",
  description: "Informations sur la médiation de la consommation pour les litiges avec Natlaupa, conformément à l'article L616-1 du Code de la consommation.",
};

export default function MediationConsommation() {
  return (
    <>
      <main className="bg-deepBlue min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
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
              <div className="border border-amber-500/30 rounded p-6 bg-amber-500/10 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-amber-300 text-xl flex-shrink-0">⚠️</span>
                  <div className="flex-1">
                    <p className="text-amber-300 font-semibold mb-2">
                      Adhésion en cours
                    </p>
                    <p className="text-amber-200/80 text-sm leading-relaxed">
                      NATLAUPA est actuellement en cours d'adhésion à un dispositif de médiation de la consommation agréé. Les coordonnées complètes du médiateur compétent (nom, adresse, site internet, modalités de saisine) seront publiées sur cette page dès l'adhésion effective.
                    </p>
                  </div>
                </div>
                <p className="text-amber-200/70 text-xs italic">
                  Organismes de médiation agréés consultables sur le site de la CNIL et sur le registre officiel : <a href="https://www.economie.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-white transition-colors underline">www.economie.gouv.fr</a>
                </p>
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
