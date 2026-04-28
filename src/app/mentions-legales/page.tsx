import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions Légales | Natlaupa",
  description: "Mentions légales obligatoires du site natlaupa.com conformément à la Loi pour la confiance dans l'économie numérique (LCEN).",
  robots: { index: true, follow: true },
};

export default function MentionsLegales() {
  return (
    <>
      <main className="bg-deepBlue min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Informations Légales</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-6">
              Mentions Légales
            </h1>
            <div className="w-16 h-px bg-gold mb-6" />
            <p className="text-slate-400 text-sm">
              Conformément à la Loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), notamment son article 6, nous vous présentons les informations légales relatives au site <strong className="text-white">natlaupa.com</strong>.
            </p>
          </div>

          <div className="space-y-12 text-slate-300 leading-relaxed">

            {/* Éditeur */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">1. Éditeur du Site</h2>
              <div className="border border-white/10 rounded-sm p-6 space-y-3 bg-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Dénomination sociale</p>
                    <p className="text-white font-medium">Natlaupa</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Forme juridique</p>
                    <p className="text-white font-medium">Société par actions simplifiée à associé unique (SASU)</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Capital social</p>
                    <p className="text-white font-medium">2 000,00 euros</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Siège social</p>
                    <p className="text-white font-medium">29 rue du Pont, 92200 Neuilly-sur-Seine, France</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Numéro SIRET</p>
                    <p className="text-white font-medium">901 265 082 00015</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Immatriculation RCS</p>
                    <p className="text-white font-medium">901 265 082 R.C.S. Nanterre</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">N° TVA Intracommunautaire</p>
                    <p className="text-white font-medium">
                      FR89 901 265 082{" "}
                      <em className="text-slate-500 not-italic text-xs">(à confirmer comptablement)</em>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Directeur de publication */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">2. Directeur de Publication</h2>
              <div className="border border-white/10 rounded-sm p-6 space-y-3 bg-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Nom</p>
                    <p className="text-white font-medium">Pierrot FRANGIEH</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Qualité</p>
                    <p className="text-white font-medium">Président</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Coordonnées */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">3. Coordonnées</h2>
              <div className="border border-white/10 rounded-sm p-6 space-y-3 bg-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Email</p>
                    <p className="text-white font-medium">Hello@natlaupa.com</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Téléphone</p>
                    <p className="text-white font-medium">+33 7 75 74 38 75</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  Horaires : du lundi au vendredi, de 9h à 18h (heure de Paris)
                </p>
              </div>
            </section>

            {/* Hébergeur */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">4. Hébergeur du Site</h2>
              <div className="border border-white/10 rounded-sm p-6 space-y-3 bg-white/5">
                <p className="text-slate-400 text-sm mb-3">
                  Le site <strong className="text-white">natlaupa.com</strong> est hébergé par :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Hébergeur</p>
                    <p className="text-white font-medium">Vercel Inc.</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Adresse</p>
                    <p className="text-white font-medium">440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
                  </div>
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Site web</p>
                    <p className="text-white font-medium">vercel.com</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-slate-400 text-sm mb-3">
                    La plateforme API backend est hébergée par :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-gold text-xs uppercase tracking-widest mb-1">Prestataire</p>
                      <p className="text-white font-medium">The Elites Solutions</p>
                    </div>
                    <div>
                      <p className="text-gold text-xs uppercase tracking-widest mb-1">Représentant</p>
                      <p className="text-white font-medium">Jhonny Jneid</p>
                    </div>
                    <div>
                      <p className="text-gold text-xs uppercase tracking-widest mb-1">Forme juridique</p>
                      <p className="text-white font-medium">SAS</p>
                    </div>
                    <div>
                      <p className="text-gold text-xs uppercase tracking-widest mb-1">Adresse</p>
                      <p className="text-white font-medium">Ardeh, Zgharta, Liban</p>
                    </div>
                    <div>
                      <p className="text-gold text-xs uppercase tracking-widest mb-1">Téléphone</p>
                      <p className="text-white font-medium">+961 81 898 056</p>
                    </div>
                    <div>
                      <p className="text-gold text-xs uppercase tracking-widest mb-1">Site web</p>
                      <p className="text-white font-medium">theelitessolutions.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">5. Propriété Intellectuelle</h2>
              <p className="text-slate-400">
                L'ensemble des contenus présents sur le site natlaupa.com (textes, images, photographies, logos, icônes, données, sons, vidéos, logiciels, mises en page, bases de données, etc.) est la propriété exclusive de Natlaupa ou de ses partenaires, et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
              </p>
              <p className="text-slate-400 mt-3">
                Toute reproduction, représentation, modification, publication, adaptation ou exploitation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable de Natlaupa.
              </p>
            </section>

            {/* Données personnelles */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">6. Données Personnelles</h2>
              <p className="text-slate-400">
                Le traitement de vos données personnelles est régi par notre{" "}
                <a href="/politique-de-confidentialite" className="text-gold hover:text-white transition-colors underline">
                  Politique de Confidentialité
                </a>{" "}
                et notre{" "}
                <a href="/politique-cookies" className="text-gold hover:text-white transition-colors underline">
                  Politique de Cookies
                </a>
                , conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679).
              </p>
            </section>

            {/* Liens hypertextes */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">7. Liens Hypertextes</h2>
              <p className="text-slate-400">
                Le site natlaupa.com peut contenir des liens vers des sites tiers. Natlaupa n'exerce aucun contrôle sur ces sites et n'assume aucune responsabilité quant à leur contenu, leurs politiques de confidentialité ou leurs pratiques. La création de liens vers natlaupa.com depuis un site tiers requiert l'autorisation préalable de Natlaupa.
              </p>
            </section>

            {/* Loi applicable */}
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">8. Droit Applicable & Juridiction</h2>
              <p className="text-slate-400">
                Les présentes mentions légales sont soumises au droit français. En cas de litige relatif à l'utilisation du site natlaupa.com, les tribunaux français seront compétents.
              </p>
            </section>

            {/* Mise à jour */}
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
