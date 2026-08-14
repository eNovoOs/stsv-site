export const locales = ['fr', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
};

export const htmlLang: Record<Locale, string> = {
  fr: 'fr-CA',
  en: 'en-CA',
  es: 'es',
};

/** Slugs par langue. La clé est l'identifiant interne de la page. */
export const routes = {
  home: { fr: '', en: '', es: '' },
  services: { fr: 'services', en: 'services', es: 'servicios' },
  stops: { fr: 'carte-des-arrets', en: 'map-of-our-stops', es: 'mapa-de-paradas' },
  reservation: { fr: 'infos-reservation', en: 'reservation-information', es: 'informacion-de-reserva' },
  accessCard: { fr: 'carte-acces', en: 'access-card-policy', es: 'tarjeta-acces' },
  adapted: { fr: 'transport-adapte', en: 'adapted-transportation', es: 'transporte-adaptado' },
  about: { fr: 'qui-sommes-nous', en: 'about', es: 'quienes-somos' },
  documents: { fr: 'documents', en: 'documents', es: 'documentos' },
  tutorials: { fr: 'tutoriels', en: 'tutorials', es: 'tutoriales' },
  contact: { fr: 'contact', en: 'contact', es: 'contacto' },
  newsletter: { fr: 'infolettre', en: 'newsletter', es: 'boletin' },
} as const;

export type RouteKey = keyof typeof routes;

/** Construit un chemin absolu pour une page dans une langue donnée. */
export function path(key: RouteKey, locale: Locale): string {
  const slug = routes[key][locale];
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  if (!slug) return prefix || '/';
  return `${prefix}/${slug}`;
}

export const ui = {
  fr: {
    'nav.services': 'Description des services',
    'nav.stops': 'Carte de nos arrêts',
    'nav.communobus': 'Communobus',
    'nav.booking': 'Réservation en ligne',
    'nav.reservation': 'Infos réservation',
    'nav.accessCard': 'Politique de la carte ACCÈS',
    'nav.line338': 'Ligne 338',
    'nav.sainteMartine': 'Sainte-Martine',
    'nav.schedules': 'Horaires',
    'nav.about': 'Qui sommes-nous',
    'nav.adapted': 'Transport adapté',
    'nav.documents': 'Documents à consulter',
    'nav.tutorials': 'Tutoriels',
    'nav.contact': 'Nous joindre',
    'nav.newsletter': 'Infolettre',
    'nav.menu': 'Menu',
    'nav.close': 'Fermer',
    'nav.language': 'Langue',
    'cta.book': 'Réserver',
    'cta.fares': 'Voir la grille tarifaire',
    'cta.bookLong': 'Faire une réservation',
    'cta.schedule': 'Voir l’horaire',
    'cta.call': 'Appelez-nous',
    'cta.download': 'Télécharger',
    'cta.open': 'Ouvrir le document',
    'home.title': 'STSV — Transport en commun à Salaberry-de-Valleyfield',
    'home.description':
      'Site officiel de la STSV. Horaires d’autobus, réservation du Communobus et services de transport adapté à Salaberry-de-Valleyfield.',
    'home.heroTitle': 'Votre trajet commence ici',
    'home.heroLead': 'Voyagez en toute sécurité et confortablement avec le transport en commun.',
    'home.servicesEyebrow': 'Nos services',
    'home.quickLinks': 'Liens rapides',
    'home.noticesTitle': 'Avis de service',
    'newsletter.hook': 'Restez à bord.',
    'newsletter.cta': 'Abonnez-vous à l’infolettre',
    'footer.rights': 'Tous droits réservés.',
    'footer.privacy': 'Politique de confidentialité',
    'footer.social': 'Suivez-nous sur Facebook',
    'a11y.skip': 'Aller au contenu principal',
    'a11y.newTab': '(nouvel onglet)',
    'a11y.pdf': 'PDF',
    'doc.categories': 'Catégories',
  },
  en: {
    'nav.services': 'Description of services',
    'nav.stops': 'Map of our stops',
    'nav.communobus': 'Communobus',
    'nav.booking': 'Book online',
    'nav.reservation': 'Reservation information',
    'nav.accessCard': 'ACCÈS card policy',
    'nav.line338': 'Line 338',
    'nav.sainteMartine': 'Sainte-Martine',
    'nav.schedules': 'Schedules',
    'nav.about': 'About us',
    'nav.adapted': 'Adapted transportation',
    'nav.documents': 'Documents',
    'nav.tutorials': 'Tutorials',
    'nav.contact': 'Contact us',
    'nav.newsletter': 'Newsletter',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.language': 'Language',
    'cta.book': 'Book',
    'cta.fares': 'See the fare table',
    'cta.bookLong': 'Make a reservation',
    'cta.schedule': 'View the schedule',
    'cta.call': 'Call us',
    'cta.download': 'Download',
    'cta.open': 'Open document',
    'home.title': 'STSV — Public transit in Salaberry-de-Valleyfield',
    'home.description':
      'Official STSV website. Bus schedules, Communobus booking and adapted transportation services in Salaberry-de-Valleyfield.',
    'home.heroTitle': 'Your journey starts here',
    'home.heroLead': 'Travel safely and comfortably with public transit.',
    'home.servicesEyebrow': 'Our services',
    'home.quickLinks': 'Quick links',
    'home.noticesTitle': 'Service notices',
    'newsletter.hook': 'Stay on board.',
    'newsletter.cta': 'Subscribe to the newsletter',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy policy',
    'footer.social': 'Follow us on Facebook',
    'a11y.skip': 'Skip to main content',
    'a11y.newTab': '(new tab)',
    'a11y.pdf': 'PDF',
    'doc.categories': 'Categories',
  },
  es: {
    'nav.services': 'Descripción de los servicios',
    'nav.stops': 'Mapa de nuestras paradas',
    'nav.communobus': 'Communobus',
    'nav.booking': 'Reservar en línea',
    'nav.reservation': 'Información de reserva',
    'nav.accessCard': 'Política de la tarjeta ACCÈS',
    'nav.line338': 'Línea 338',
    'nav.sainteMartine': 'Sainte-Martine',
    'nav.schedules': 'Horarios',
    'nav.about': 'Quiénes somos',
    'nav.adapted': 'Transporte adaptado',
    'nav.documents': 'Documentos',
    'nav.tutorials': 'Tutoriales',
    'nav.contact': 'Contáctenos',
    'nav.newsletter': 'Boletín',
    'nav.menu': 'Menú',
    'nav.close': 'Cerrar',
    'nav.language': 'Idioma',
    'cta.book': 'Reservar',
    'cta.fares': 'Ver la tabla de tarifas',
    'cta.bookLong': 'Hacer una reserva',
    'cta.schedule': 'Ver el horario',
    'cta.call': 'Llámenos',
    'cta.download': 'Descargar',
    'cta.open': 'Abrir documento',
    'home.title': 'STSV — Transporte público en Salaberry-de-Valleyfield',
    'home.description':
      'Sitio oficial de la STSV. Horarios de autobús, reserva del Communobus y servicios de transporte adaptado en Salaberry-de-Valleyfield.',
    'home.heroTitle': 'Tu viaje comienza aquí',
    'home.heroLead': 'Viaja con seguridad y comodidad en el transporte público.',
    'home.servicesEyebrow': 'Nuestros servicios',
    'home.quickLinks': 'Enlaces rápidos',
    'home.noticesTitle': 'Avisos de servicio',
    'newsletter.hook': 'Sigue a bordo.',
    'newsletter.cta': 'Suscríbete al boletín',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.privacy': 'Política de privacidad',
    'footer.social': 'Síguenos en Facebook',
    'a11y.skip': 'Ir al contenido principal',
    'a11y.newTab': '(nueva pestaña)',
    'a11y.pdf': 'PDF',
    'doc.categories': 'Categorías',
  },
} as const;

export type UIKey = keyof (typeof ui)['fr'];

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return (ui[locale] as Record<string, string>)[key] ?? (ui.fr as Record<string, string>)[key] ?? key;
  };
}

/** Déduit la langue depuis l'URL courante. */
export function getLocale(url: URL): Locale {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return (locales as readonly string[]).includes(seg) ? (seg as Locale) : defaultLocale;
}
