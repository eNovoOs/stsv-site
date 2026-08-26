import type { Locale } from '../i18n/ui';

export type L10n = Record<Locale, string>;

/* ------------------------------------------------------------------
   Coordonnées et liens externes
   ------------------------------------------------------------------ */
export const contact = {
  phoneDisplay: '450 370-0600',
  phoneHref: 'tel:+14503700600',
  bookingUrl: 'https://taxibusvalleyfield.accestaxi.com/index.aspx',
  facebook: 'https://www.facebook.com/stsvtransport/',
  transitIos: 'https://apps.apple.com/us/app/transit-subway-bus-times/id498151501',
  transitAndroid:
    'https://play.google.com/store/apps/details?id=com.thetransitapp.droid',
};


/* ------------------------------------------------------------------
   Sujets du formulaire de contact.
   `value` est la clé technique envoyée dans le champ `subject` du webhook.
   Elle est en anglais et ne change jamais d'une langue à l'autre, pour que
   le routage eNovoOs reste stable. Seul `label` est traduit.
   ------------------------------------------------------------------ */
export type ContactSubject = { value: string; label: L10n };

export const contactSubjects: ContactSubject[] = [
  {
    value: 'sales',
    label: { fr: 'Ventes', en: 'Sales', es: 'Ventas' },
  },
  {
    value: 'support',
    label: { fr: 'Soutien', en: 'Support', es: 'Soporte' },
  },
];

/* ------------------------------------------------------------------
   Avis de service — modifier ici pour changer la bannière et les cartes
   Mettre `active: false` pour retirer un avis sans le supprimer.
   ------------------------------------------------------------------ */
export type Notice = {
  id: string;
  active: boolean;
  tone: 'info' | 'alert';
  eyebrow: L10n;
  title: L10n;
  body: L10n;
  ctaLabel?: L10n;
  ctaHref?: string;
  /**
   * Dernier jour d'affichage, au format AAAA-MM-JJ. Absent : l'avis reste
   * jusqu'à ce qu'une main le désactive.
   */
  until?: string;
};

/** Date du jour en AAAA-MM-JJ, UTC — celle dont dispose la construction. */
export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Un avis est-il échu ?
 *
 * `until` est le dernier jour d'affichage : « 2026-10-12 » reste visible le
 * 12 octobre et disparaît le 13. Les chaînes AAAA-MM-JJ se comparent comme
 * des dates, sans passer par un fuseau.
 *
 * Le site est construit à l'avance : ce filtre ne retire l'avis qu'au
 * déploiement suivant. Un second contrôle tourne donc dans le navigateur, à
 * l'heure locale du visiteur — c'est lui qui fait tenir l'échéance quand
 * personne ne redéploie. D'où la marge d'un jour ici : la construction tourne
 * en UTC, où le 13 commence quatre heures avant minuit au Québec, et elle ne
 * doit pas retirer un avis encore valide pour un usager.
 */
export function isExpired(notice: { until?: string }, today: string, graceDays = 1): boolean {
  if (!notice.until) return false;
  const limite = new Date(`${notice.until}T00:00:00Z`);
  limite.setUTCDate(limite.getUTCDate() + graceDays);
  return today > limite.toISOString().slice(0, 10);
}

/** Bandeau rouge en haut de page. Laisser `active: false` s'il n'y a rien. */
export const banner: Notice = {
  id: 'main-street-closure',
  /* Retire le 26 aout 2026 a la demande de la STSV : le detour n'etait plus
     d'actualite et l'avis est reste en ligne. Le texte est conserve, il
     resservira si la rue Main ferme de nouveau. */
  active: false,
  tone: 'alert',
  eyebrow: { fr: 'Détour', en: 'Detour', es: 'Desvío' },
  title: {
    fr: 'Fermeture de la rue Main : prévoyez des détours d’autobus jusqu’à nouvel ordre.',
    en: 'Main Street closure: expect bus detours until further notice.',
    es: 'Cierre de la calle Main: prevea desvíos de autobús hasta nuevo aviso.',
  },
  body: { fr: '', en: '', es: '' },
};

export const notices: Notice[] = [
  {
    id: 'holiday-schedule-fall-2026',
    active: true,
    /* Action de grace est le dernier des deux conges annonces. */
    until: '2026-10-12',
    tone: 'info',
    eyebrow: { fr: 'Jours fériés', en: 'Holidays', es: 'Días festivos' },
    title: {
      fr: 'Fête du travail et Action de grâce',
      en: 'Labour Day and Thanksgiving',
      es: 'Día del Trabajo y Acción de Gracias',
    },
    body: {
      fr: 'Les 7 septembre et 12 octobre, le service régulier circule : Communobus et lignes 10, 30 et 99. Le service de réservation est ouvert de 8 h à 16 h.',
      en: 'On 7 September and 12 October, regular service runs: Communobus and lines 10, 30 and 99. The reservation service is open from 8 a.m. to 4 p.m.',
      es: 'El 7 de septiembre y el 12 de octubre, el servicio regular circula: Communobus y líneas 10, 30 y 99. El servicio de reservas abre de 8:00 a 16:00.',
    },
  },
  {
    id: 'line-30-new-route',
    active: true,
    tone: 'info',
    eyebrow: { fr: 'Ligne 30', en: 'Line 30', es: 'Línea 30' },
    title: {
      fr: 'Nouveau circuit',
      en: 'New route',
      es: 'Nuevo recorrido',
    },
    body: {
      fr: 'Le circuit de la ligne 30 a été révisé, avec de nouvelles plages horaires. Consultez l’horaire mis à jour.',
      en: 'The line 30 route has been revised, with new time slots. Check the updated schedule.',
      es: 'El recorrido de la línea 30 fue revisado, con nuevos horarios. Consulta el horario actualizado.',
    },
    ctaLabel: {
      fr: 'Voir le nouvel horaire',
      en: 'View the new schedule',
      es: 'Ver el nuevo horario',
    },
    ctaHref: '/documents/Horaires-lignes-10-30-99_du-3-nov-2025_v2.pdf',
  },
  {
    id: 'sainte-martine-service',
    active: true,
    tone: 'info',
    eyebrow: { fr: 'Nouveau service', en: 'New service', es: 'Nuevo servicio' },
    title: {
      fr: 'Desserte de Sainte-Martine',
      en: 'Sainte-Martine service',
      es: 'Servicio a Sainte-Martine',
    },
    body: {
      fr: 'Dès le 17 août 2026, les citoyens de Sainte-Martine peuvent utiliser le transport collectif.',
      en: 'Starting 17 August 2026, Sainte-Martine residents can use public transit.',
      es: 'A partir del 17 de agosto de 2026, los habitantes de Sainte-Martine pueden usar el transporte colectivo.',
    },
    ctaLabel: { fr: 'Voir l’horaire', en: 'View the schedule', es: 'Ver el horario' },
    ctaHref: '/documents/Horaire-Sainte-Martine_des-17-aout-2026.pdf',
  },
];

/* ------------------------------------------------------------------
   Lignes fixes
   ------------------------------------------------------------------ */
export type Line = {
  number: string;
  name: L10n;
  route: L10n;
  frequency: L10n;
  schedule: string;
};

export const lines: Line[] = [
  {
    number: '10',
    name: { fr: 'Centre-ville', en: 'Downtown', es: 'Centro' },
    route: {
      fr: 'De la rue Jacques-Cartier / rue Louis-VI-Major au boulevard Monseigneur-Langlois / rue Lyrette',
      en: 'From Jacques-Cartier / Louis-VI-Major to Monseigneur-Langlois / Lyrette',
      es: 'De la calle Jacques-Cartier / Louis-VI-Major al bulevar Monseigneur-Langlois / Lyrette',
    },
    frequency: {
      fr: 'Service en semaine, plus fréquent aux heures de pointe. Service aussi la fin de semaine.',
      en: 'Weekday service, more frequent at peak hours. Weekend service as well.',
      es: 'Servicio entre semana, más frecuente en horas pico. También los fines de semana.',
    },
    schedule: '/documents/Horaires-lignes-10-30-99_du-3-nov-2025_v2.pdf',
  },
  {
    number: '30',
    name: { fr: 'Beauharnois', en: 'Beauharnois', es: 'Beauharnois' },
    route: {
      fr: 'De la rue Saint-Thomas (face à la bibliothèque du Cégep) à la rue Saint-Laurent / chemin Saint-Louis, le long du boulevard Hébert',
      en: 'From Saint-Thomas (across from the Cégep library) to Saint-Laurent / chemin Saint-Louis, along boulevard Hébert',
      es: 'De la calle Saint-Thomas (frente a la biblioteca del Cégep) a Saint-Laurent / chemin Saint-Louis, por el bulevar Hébert',
    },
    frequency: {
      fr: 'Circule 7 jours sur 7.',
      en: 'Runs 7 days a week.',
      es: 'Circula los 7 días de la semana.',
    },
    schedule: '/documents/Horaires-lignes-10-30-99_du-3-nov-2025_v2.pdf',
  },
  {
    number: '99',
    name: { fr: 'Gare de Vaudreuil', en: 'Vaudreuil station', es: 'Estación de Vaudreuil' },
    route: {
      fr: 'De St-Thomas / face à la bibliothèque du Cégep à la gare de Vaudreuil',
      en: 'From St-Thomas / across from the Cégep library to the Vaudreuil station',
      es: 'De St-Thomas / frente a la biblioteca del Cégep a la estación de Vaudreuil',
    },
    frequency: {
      fr: 'Service en semaine. Service aussi la fin de semaine.',
      en: 'Weekday service. Weekend service as well.',
      es: 'Servicio entre semana. También los fines de semana.',
    },
    schedule: '/documents/Horaires-lignes-10-30-99_du-3-nov-2025_v2.pdf',
  },
  {
    number: '338',
    name: { fr: 'Vaudreuil — sur réservation', en: 'Vaudreuil — by reservation', es: 'Vaudreuil — con reserva' },
    route: {
      fr: 'Direction Vaudreuil, sur réservation.',
      en: 'Towards Vaudreuil, by reservation.',
      es: 'Dirección Vaudreuil, con reserva.',
    },
    frequency: {
      fr: 'Sur réservation seulement.',
      en: 'By reservation only.',
      es: 'Solo con reserva.',
    },
    schedule: '/documents/Horaire-ligne-338_v2.pdf',
  },
];

/* ------------------------------------------------------------------
   Grille tarifaire — source : stsv.ca, section « Description des services »
   ------------------------------------------------------------------ */
export type FareRow = { label: L10n; regular: string; reduced?: string };
export type FareTable = { id: string; title: L10n; rows: FareRow[] };

const commonRows = (): FareRow[] => [];

export const fares: FareTable[] = [
  {
    id: 'fare-a',
    title: {
      fr: 'Déplacement dans la même municipalité — Titre A',
      en: 'Travel within the same municipality — Fare A',
      es: 'Viaje dentro del mismo municipio — Título A',
    },
    rows: [
      {
        label: { fr: 'Passage unique', en: 'Single ride', es: 'Pasaje sencillo' },
        regular: '4,60 $',
        reduced: '2,85 $',
      },
      {
        label: { fr: 'Passe mensuelle', en: 'Monthly pass', es: 'Pase mensual' },
        regular: '118,50 $',
        reduced: '72,00 $',
      },
      {
        label: {
          fr: 'Étudiant Cégep Valleyfield',
          en: 'Cégep Valleyfield student',
          es: 'Estudiante Cégep Valleyfield',
        },
        regular: '71,50 $',
      },
      {
        label: { fr: 'Pénalité pour absence', en: 'No-show penalty', es: 'Penalidad por ausencia' },
        regular: '12,00 $',
      },
    ],
  },
  {
    id: 'fare-b',
    title: {
      fr: 'Intermunicipal — Titre B',
      en: 'Intermunicipal — Fare B',
      es: 'Intermunicipal — Título B',
    },
    rows: [
      {
        label: { fr: 'Passage unique', en: 'Single ride', es: 'Pasaje sencillo' },
        regular: '8,25 $',
        reduced: '6,20 $',
      },
      {
        label: { fr: 'Passe mensuelle', en: 'Monthly pass', es: 'Pase mensual' },
        regular: '165,00 $',
        reduced: '98,00 $',
      },
      {
        label: {
          fr: 'Étudiant Cégep Valleyfield',
          en: 'Cégep Valleyfield student',
          es: 'Estudiante Cégep Valleyfield',
        },
        regular: '71,50 $',
      },
      {
        label: { fr: 'Pénalité pour absence', en: 'No-show penalty', es: 'Penalidad por ausencia' },
        regular: '12,00 $',
      },
    ],
  },
];

export const fareHeadings: { label: L10n; regular: L10n; reduced: L10n } = {
  label: {
    fr: 'Description du titre de transport',
    en: 'Fare description',
    es: 'Descripción del título de transporte',
  },
  regular: { fr: 'Tarif régulier', en: 'Regular fare', es: 'Tarifa regular' },
  reduced: { fr: 'Tarif réduit', en: 'Reduced fare', es: 'Tarifa reducida' },
};

/* ------------------------------------------------------------------
   Territoire desservi
   ------------------------------------------------------------------ */
export const territory = {
  collective: [
    'Salaberry-de-Valleyfield',
    'Saint-Polycarpe',
    'Saint-Zotique',
    'Les Coteaux',
    'Coteau-du-Lac',
    'Les Cèdres',
    'Pointe-des-Cascades',
  ],
  adapted: [
    'Rivière-Beaudette',
    'Saint-Polycarpe',
    'Saint-Zotique',
    'Les Coteaux',
    'Coteau-du-Lac',
    'Salaberry-de-Valleyfield',
    'Saint-Louis-de-Gonzague',
    'Saint-Stanislas-de-Kostka',
    'Saint-Étienne-de-Beauharnois',
    'Saint-Télesphore',
  ],
};

/* Dernier départ à 00 h 30, conformément à la grille du PDF
   « Communobus — réservation et billetterie ». */
export const communobusHours = {
  fr: 'De 5 h 20 à 00 h 30, 7 jours sur 7.',
  en: 'From 5:20 a.m. to 12:30 a.m., 7 days a week.',
  es: 'De 5:20 a 00:30, los 7 días de la semana.',
};

/* ------------------------------------------------------------------
   Documents — les fichiers vivent dans /public/documents
   ------------------------------------------------------------------ */
export type DocCategory = 'schedules' | 'communobus' | 'adapted' | 'policies';

export type Doc = {
  file: string;
  category: DocCategory;
  title: L10n;
  note?: L10n;
};

export const docCategories: Record<DocCategory, L10n> = {
  schedules: { fr: 'Horaires', en: 'Schedules', es: 'Horarios' },
  communobus: {
    fr: 'Communobus et services',
    en: 'Communobus and services',
    es: 'Communobus y servicios',
  },
  adapted: { fr: 'Transport adapté', en: 'Adapted transportation', es: 'Transporte adaptado' },
  policies: {
    fr: 'Politiques institutionnelles',
    en: 'Institutional policies',
    es: 'Políticas institucionales',
  },
};

export const documents: Doc[] = [
  {
    file: 'Horaires-lignes-10-30-99_du-3-nov-2025_v2.pdf',
    category: 'schedules',
    title: {
      fr: 'Horaires — lignes 10, 30 et 99',
      en: 'Schedules — lines 10, 30 and 99',
      es: 'Horarios — líneas 10, 30 y 99',
    },
    note: {
      fr: 'En vigueur depuis le 3 novembre 2025',
      en: 'In effect since 3 November 2025',
      es: 'Vigente desde el 3 de noviembre de 2025',
    },
  },
  {
    file: 'Horaire-ligne-338_v2.pdf',
    category: 'schedules',
    title: {
      fr: 'Horaire — ligne 338, direction Vaudreuil',
      en: 'Schedule — line 338, towards Vaudreuil',
      es: 'Horario — línea 338, dirección Vaudreuil',
    },
    note: {
      fr: 'Sur réservation',
      en: 'By reservation',
      es: 'Con reserva',
    },
  },
  {
    file: 'Horaire-Sainte-Martine_des-17-aout-2026.pdf',
    category: 'schedules',
    title: {
      fr: 'Horaire — desserte de Sainte-Martine',
      en: 'Schedule — Sainte-Martine service',
      es: 'Horario — servicio a Sainte-Martine',
    },
    note: {
      fr: 'En service dès le 17 août 2026',
      en: 'Service starts 17 August 2026',
      es: 'En servicio desde el 17 de agosto de 2026',
    },
  },
  {
    file: 'Communobus-reservation-et-billetterie.pdf',
    category: 'communobus',
    title: {
      fr: 'Communobus — réservation et billetterie',
      en: 'Communobus — reservation and ticketing',
      es: 'Communobus — reserva y boletería',
    },
  },
  {
    file: 'Communobus-infos-reservation.pdf',
    category: 'communobus',
    title: {
      fr: 'Communobus — informations de réservation',
      en: 'Communobus — reservation information',
      es: 'Communobus — información de reserva',
    },
  },
  {
    file: 'Description-du-service.pdf',
    category: 'communobus',
    title: {
      fr: 'Description du service',
      en: 'Description of service',
      es: 'Descripción del servicio',
    },
  },
  {
    file: 'Application-Transit.pdf',
    category: 'communobus',
    title: {
      fr: 'Application Transit — mode d’emploi',
      en: 'Transit app — how it works',
      es: 'Aplicación Transit — cómo funciona',
    },
  },
  {
    file: 'TA_Criteres-admission.pdf',
    category: 'adapted',
    title: {
      fr: 'Critères d’admission',
      en: 'Eligibility criteria',
      es: 'Criterios de admisión',
    },
  },
  {
    file: 'TA_Demande-admission_FR.pdf',
    category: 'adapted',
    title: {
      fr: 'Demande d’admission au transport adapté',
      en: 'Paratransit eligibility application (French)',
      es: 'Solicitud de admisión al transporte adaptado (francés)',
    },
  },
  {
    file: 'TA_Application-for-paratransit-eligibility_EN.pdf',
    category: 'adapted',
    title: {
      fr: 'Demande d’admission — version anglaise',
      en: 'Application for paratransit eligibility',
      es: 'Solicitud de admisión — versión en inglés',
    },
  },
  {
    file: 'TA_Information-complementaire_attestation-incapacites.pdf',
    category: 'adapted',
    title: {
      fr: 'Information complémentaire — attestation des incapacités',
      en: 'Additional information — attestation of disabilities',
      es: 'Información complementaria — certificación de incapacidades',
    },
  },
  {
    file: 'TA_Demande-transport-hors-territoire.pdf',
    category: 'adapted',
    title: {
      fr: 'Demande de transport hors territoire',
      en: 'Out-of-territory transportation request',
      es: 'Solicitud de transporte fuera del territorio',
    },
  },
  {
    file: 'TA_Feuille-informations-a-completer.pdf',
    category: 'adapted',
    title: {
      fr: 'Feuille d’informations à compléter',
      en: 'Information sheet to complete',
      es: 'Hoja de información para completar',
    },
  },
  {
    file: 'Guide-usager-transport-adapte_FR.pdf',
    category: 'adapted',
    title: {
      fr: 'Guide de l’usager',
      en: 'User guide (French)',
      es: 'Guía del usuario (francés)',
    },
  },
  {
    file: 'Guide-usager-transport-adapte_EN.pdf',
    category: 'adapted',
    title: {
      fr: 'Guide de l’usager — version anglaise',
      en: 'User guide',
      es: 'Guía del usuario (inglés)',
    },
  },
  {
    file: 'Politique-confidentialite-Loi-25.pdf',
    category: 'policies',
    title: {
      fr: 'Loi 25 — politique de confidentialité',
      en: 'Law 25 — privacy policy',
      es: 'Ley 25 — política de privacidad',
    },
  },
  {
    file: 'Politique-qualite-de-services.pdf',
    category: 'policies',
    title: {
      fr: 'Politique de qualité de services',
      en: 'Service quality policy',
      es: 'Política de calidad de servicio',
    },
  },
  {
    file: 'Politique-prevention-harcelement.pdf',
    category: 'policies',
    title: {
      fr: 'Politique de prévention du harcèlement psychologique ou sexuel',
      en: 'Policy on preventing psychological and sexual harassment',
      es: 'Política de prevención del acoso psicológico o sexual',
    },
  },
  {
    file: 'Politique-captation-images.pdf',
    category: 'policies',
    title: {
      fr: 'Politique de captation d’images',
      en: 'Image capture policy',
      es: 'Política de captación de imágenes',
    },
  },
];

export const privacyDoc = '/documents/Politique-confidentialite-Loi-25.pdf';
