# Natlaupa — Plan de Mise en Conformité RGPD & Droit Français

> **Date :** Avril 2026  
> **Destinataire :** Natlaupa / Client  
> **Préparé par :** The Elites Solutions  
> **Statut :** Mise en œuvre en cours

---

## 1. Contexte & Avertissement Gouvernemental

Le site natlaupa.com a reçu un signalement des autorités françaises relatif à plusieurs non-conformités avec le droit numérique français et le RGPD. Ce document présente une analyse complète des obligations légales applicables, les lacunes identifiées, et le plan d'action mis en place.

---

## 2. Cadre Juridique Applicable

### 2.1 LCEN — Loi pour la Confiance dans l'Économie Numérique (21 juin 2004)

**Texte de référence :** Loi n°2004-575 du 21 juin 2004, article 6 III

**Ce que la loi impose aux sites professionnels :**
- Dénomination sociale complète
- Forme juridique et capital social
- Adresse du siège social
- Numéro SIREN/SIRET et RCS
- Numéro de TVA intracommunautaire (si applicable)
- Nom du directeur de publication
- Coordonnées (email + téléphone)
- Identité complète de l'hébergeur (nom, adresse, téléphone)

**Sanction en cas de non-respect :** Jusqu'à 75 000 € d'amende et 1 an d'emprisonnement (art. 6 III bis LCEN)

**État actuel du site Natlaupa :** ❌ Aucune page "Mentions Légales" n'existe  
**Action réalisée :** ✅ Page `/mentions-legales` créée

---

### 2.2 RGPD — Règlement Général sur la Protection des Données (Mai 2018)

**Texte de référence :** Règlement (UE) 2016/679 du Parlement Européen

**Données collectées identifiées sur le site :**

| Formulaire | Données collectées | Base légale |
|---|---|---|
| Contact | Nom, email, téléphone, message, opt-in newsletter | Intérêt légitime + consentement (newsletter) |
| Newsletter (footer) | Prénom, nom, email | Consentement explicite |
| Demande d'offre | Nom, email, téléphone, dates, nb voyageurs | Exécution d'un contrat |
| Candidature Angel | Prénom, nom, email, tél, poste, expérience, motivation | Consentement |
| Partenariat hôtel | Prénom, nom, email, tél, société, message | Intérêt légitime |
| Cookies & Tracking | SessionID, comportement de navigation, préférences | Consentement (Google Analytics) |

**Obligations RGPD à remplir :**
- Informer les utilisateurs de la collecte (politique de confidentialité)
- Obtenir un consentement explicite pour le marketing (newsletter)
- Permettre l'exercice des droits (accès, rectification, suppression, portabilité, opposition)
- Désigner un responsable du traitement
- Préciser les durées de conservation
- Déclarer les sous-traitants et transferts hors UE

**Transferts hors UE identifiés :**
- Google Analytics → USA (Google LLC) — Couvert par les Clauses Contractuelles Types (CCT/SCCs)
- Mapbox → USA (Mapbox Inc.) — CCT requis
- Backend Natlaupa (`natlaupa.theelitessolutions.cloud`) — Localisation serveur à confirmer

**État actuel :** ❌ Aucune politique de confidentialité  
**Action réalisée :** ✅ Page `/politique-de-confidentialite` créée

---

### 2.3 Directive ePrivacy & Recommandation CNIL sur les Cookies

**Texte de référence :** Directive 2002/58/CE + Recommandation CNIL du 17 septembre 2020

**Ce que la CNIL impose :**
- Recueillir le consentement AVANT le dépôt de cookies non-essentiels
- Permettre de refuser aussi facilement qu'accepter
- Conserver la preuve du consentement
- Consentement valide 13 mois maximum
- Bannière cookies doit mentionner les finalités et lier vers la politique cookies

**État actuel :**
- ✅ Bandeau cookies implémenté (CookieConsentBanner.tsx)
- ✅ Google Consent Mode v2 configuré (défaut = refus)
- ✅ Le service de tracking vérifie le consentement
- ❌ Pas de lien vers une politique de cookies dans la bannière
- ❌ Pas de page politique de cookies

**Action réalisée :** ✅ Page `/politique-cookies` créée + lien ajouté dans bannière

---

### 2.4 Code de la Consommation — Médiation (Art. L616-1)

**Texte de référence :** Ordonnance n°2015-1033 du 20 août 2015 — Article L616-1 Code de la consommation

**Ce que la loi impose :**
- Tout professionnel proposant des services à des consommateurs doit mettre en place un dispositif de médiation de la consommation
- Les coordonnées du médiateur doivent figurer sur le site web
- Informer les consommateurs de ce droit à la médiation en cas de litige

**Organismes de médiation agréés :**
- CM2C (Centre de Médiation de la Consommation de Conciliateurs de justice) — cm2c.net
- Médiation du e-commerce (FEVAD) — mediationecommerce.fevad.com
- AME CONSO — ameconso.fr

**⚠️ POINT D'ACTION URGENT pour le client :** Adhérer à un organisme médiateur agréé avant mise en ligne des CGU (coût ~600€/an pour CM2C)

**État actuel :** ❌ Aucune mention du médiateur  
**Action réalisée :** ✅ Section médiation intégrée dans les CGU

---

### 2.5 Code de la Consommation — Pratiques Commerciales (Art. L121-2)

**Texte de référence :** Code de la consommation, article L121-2 sur les pratiques commerciales trompeuses

**Ce que la loi interdit :**
- Toute pratique commerciale est trompeuse si elle repose sur des allégations fausses ou de nature à induire en erreur
- Ne pas décrire clairement son offre = risque de qualification en pratique trompeuse

**Ce que Natlaupa doit clarifier sur son site :**
1. **Qu'est-ce que Natlaupa ?** (conciergerie de voyage, mise en relation, réservation ?)
2. **Pour qui ?** (voyageurs luxe, hôtels, les deux ?)
3. **Comment ça marche ?** (processus de bout en bout)
4. **Est-ce payant pour le voyageur ?** (oui/non, si oui combien)
5. **Est-ce payant pour les hôtels ?** (commission ? abonnement ?)
6. **Le Natlaupa Club Angel à 60€/an** — que reçoit exactement le membre ?

**Action réalisée :** ✅ CGU inclut une description claire du service

---

## 3. Problèmes Supplémentaires Identifiés (Non Demandés par le Client)

### 3.1 ⚠️ Intégration WhatsApp — Numéro Personnel Exposé

**Problème :** Le numéro de téléphone personnel (+33 7 75 74 38 75) est codé en dur dans le code source JavaScript côté client, notamment dans les pages `become-angel` et `for-hotels`. Les données de formulaire sont envoyées vers ce numéro via l'API WhatsApp Web.

**Risques :**
- Exposition d'un numéro personnel à tous les visiteurs du site
- WhatsApp (Meta) devient un sous-traitant de fait sans DPA (accord de traitement)
- Non-conformité RGPD pour le traitement automatisé de données personnelles via WhatsApp Business

**Recommandation :** Utiliser un numéro WhatsApp Business dédié, ou supprimer l'envoi automatique et traiter via email uniquement. Mentionner WhatsApp comme sous-traitant dans la politique de confidentialité.

### 3.2 ⚠️ Formulaire Newsletter — Absence de Case à Cocher de Consentement

**Problème :** Le formulaire newsletter dans le footer ne comporte pas de case à cocher de consentement explicite. La CNIL exige un consentement actif (opt-in) pour les communications marketing.

**Action réalisée :** ✅ Case à cocher de consentement ajoutée dans le footer

### 3.3 ⚠️ Formulaire Contact — Vérification de l'Opt-In Newsletter

Le formulaire contact a une case "Subscribe to Newsletter" — vérifier qu'elle est décochée par défaut (opt-out interdit par la CNIL). **Résultat audit :** ✅ La case est bien décochée par défaut (`subscribeNewsletter: false`)

---

## 4. Données Demandées au Client (Questionnaire)

> **Le client doit fournir ces informations avant mise en production des pages légales.**  
> Les pages ont été créées avec des espaces réservés `{{TODO}}` à remplacer.

| Information | Description | Urgent ? |
|---|---|---|
| Forme juridique | SAS / SARL / EURL / Auto-entrepreneur | ✅ Oui |
| Capital social | Montant en euros (si SAS/SARL) | ✅ Oui |
| Siège social | Adresse complète | ✅ Oui |
| SIRET | Numéro à 14 chiffres | ✅ Oui |
| RCS | Ville d'immatriculation + numéro | ✅ Oui |
| Numéro TVA | N° TVA intracommunautaire (si applicable) | ⚠️ Si TVA |
| Nom du dirigeant | Représentant légal | ✅ Oui |
| Email de contact | Email professionnel (ex: contact@natlaupa.com) | ✅ Oui |
| Téléphone | Numéro professionnel (pas personnel) | ✅ Oui |
| Hébergeur | Vercel ? AWS ? Autre ? (à confirmer dans le tableau de bord) | ✅ Oui |
| Localisation serveurs backend | Où est hébergé natlaupa.theelitessolutions.cloud ? | ✅ Oui |
| Médiateur de consommation | Organisme choisi + coordonnées | ✅ Oui |
| Email DPO/RGPD | Email pour exercice des droits | ✅ Oui |
| Description exacte du service | Conciergerie ? Mise en relation ? Réservation directe ? | ✅ Oui |
| Prix pour voyageurs | Gratuit ? Commission ? Abonnement ? | ✅ Oui |
| Prix pour hôtels | Commission % ? Frais ? Abonnement ? | ✅ Oui |
| Durée conservation données | Combien de temps conservez-vous les données de contact ? | ⚠️ À définir |

---

## 5. Pages Créées

| Page | URL | Statut |
|---|---|---|
| Mentions Légales | `/mentions-legales` | ✅ Créée (placeholders à compléter) |
| Politique de Confidentialité | `/politique-de-confidentialite` | ✅ Créée (placeholders à compléter) |
| Conditions Générales d'Utilisation | `/cgu` | ✅ Créée (placeholders à compléter) |
| Politique de Cookies | `/politique-cookies` | ✅ Créée (placeholders à compléter) |

---

## 6. Modifications du Site Réalisées

| Composant | Modification | Statut |
|---|---|---|
| Footer | Ajout section "Informations Légales" avec liens | ✅ Fait |
| Bannière Cookies | Ajout lien vers Politique de Cookies | ✅ Fait |
| Footer Newsletter | Ajout case à cocher de consentement + notice privacy | ✅ Fait |
| `src/lib/constants.ts` | Ajout des liens légaux dans FOOTER_LINKS | ✅ Fait |

---

## 7. Prochaines Étapes (Action du Client)

1. **Immédiat** — Fournir les données légales (questionnaire section 4) pour remplacer les `{{TODO}}`
2. **Immédiat** — Adhérer à un organisme de médiation agréé (ex: CM2C à cm2c.net)
3. **Dans la semaine** — Confirmer et clarifier la description du service (section 3 de l'avertissement)
4. **Recommandé** — Créer un email dédié RGPD (ex: rgpd@natlaupa.com ou dpo@natlaupa.com)
5. **Recommandé** — Créer un numéro WhatsApp Business séparé du numéro personnel
6. **Dans le mois** — Mettre en place un registre des traitements (obligatoire RGPD art. 30)
7. **Dans le mois** — Signer des DPA (Data Processing Agreements) avec Google, Mapbox, et The Elites Solutions

---

## 8. Lois & Références

| Texte | Référence | URL officielle |
|---|---|---|
| LCEN | Loi n°2004-575 du 21 juin 2004 | legifrance.gouv.fr |
| RGPD | Règlement (UE) 2016/679 | eur-lex.europa.eu |
| ePrivacy | Directive 2002/58/CE | eur-lex.europa.eu |
| CNIL Cookies | Recommandation CNIL 2020 | cnil.fr |
| Médiation conso. | Art. L616-1 Code de la conso. | legifrance.gouv.fr |
| Pratiques trompeuses | Art. L121-2 Code de la conso. | legifrance.gouv.fr |
