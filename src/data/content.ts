import type { L10n } from './site';

/* ==================================================================
   Contenu éditorial des pages.
   Source : stsv.ca (capture du 14 août 2026).
   Les versions EN des pages « qui sommes-nous », « infos réservation »,
   « tutoriels » et « carte ACCÈS » étaient vides sur le site d'origine :
   elles ont été rédigées à partir du français.
   ================================================================== */

export type Meta = { title: L10n; description: L10n };

/* ---------------------------- Services ---------------------------- */
export const services = {
  meta: {
    title: {
      fr: 'Description des services — STSV',
      en: 'Description of services — STSV',
      es: 'Descripción de los servicios — STSV',
    },
    description: {
      fr: 'Lignes fixes, Communobus et transport adapté : le réseau, les horaires et la grille tarifaire de la STSV.',
      en: 'Fixed lines, Communobus and adapted transportation: the STSV network, schedules and fare table.',
      es: 'Líneas fijas, Communobus y transporte adaptado: la red, los horarios y las tarifas de la STSV.',
    },
  },
  h1: {
    fr: 'Description des services',
    en: 'Description of services',
    es: 'Descripción de los servicios',
  },
  lead: {
    fr: 'Voici ce que vous devez savoir sur nos services de transport disponibles.',
    en: 'Here is what you need to know about the transit services we offer.',
    es: 'Esto es lo que necesitas saber sobre nuestros servicios de transporte.',
  },
  network: {
    fr: 'Nous offrons des lignes d’autobus principales reliant les zones clés comme les zones commerciales, le parc industriel, le Cégep, l’hôpital et la gare de Vaudreuil. La ligne 10 circule fréquemment aux heures de pointe et toutes les heures autrement, y compris les fins de semaine. Les lignes 30 et 99 complètent le réseau, la ligne 30 circulant désormais 7 jours sur 7. Le service de fin de semaine est disponible sur les lignes 10, 30 et 99. Tous les trajets utilisent des minibus ou des fourgonnettes pour un voyage confortable.',
    en: 'We run main bus lines connecting key areas: commercial zones, the industrial park, the Cégep, the hospital and the Vaudreuil station. Line 10 runs frequently at peak hours and hourly the rest of the time, including weekends. Lines 30 and 99 complete the network, with line 30 now running 7 days a week. Weekend service is available on lines 10, 30 and 99. All trips use minibuses or vans for a comfortable ride.',
    es: 'Operamos líneas principales que conectan zonas clave: áreas comerciales, el parque industrial, el Cégep, el hospital y la estación de Vaudreuil. La línea 10 circula con frecuencia en horas pico y cada hora el resto del tiempo, incluidos los fines de semana. Las líneas 30 y 99 completan la red, y la línea 30 ahora circula los 7 días. El servicio de fin de semana está disponible en las líneas 10, 30 y 99. Todos los viajes se hacen en minibús o furgoneta.',
  },
  linesTitle: { fr: '3 lignes fixes', en: '3 fixed lines', es: '3 líneas fijas' },
  notes: {
    fr: [
      'Service en semaine sur les lignes 10 et 99; la ligne 30 circule 7 jours sur 7.',
      'Service assuré par minibus et fourgonnette.',
    ],
    en: [
      'Weekday service on lines 10 and 99; line 30 runs 7 days a week.',
      'Service operated with minibuses and vans.',
    ],
    es: [
      'Servicio entre semana en las líneas 10 y 99; la línea 30 circula los 7 días.',
      'Servicio operado con minibús y furgoneta.',
    ],
  },
  faresTitle: { fr: 'Grille tarifaire', en: 'Fare table', es: 'Tabla de tarifas' },
  transitTitle: {
    fr: 'Application Transit et service SMS',
    en: 'Transit app and SMS service',
    es: 'Aplicación Transit y servicio SMS',
  },
  transitBody: {
    fr: 'L’application Transit affiche les départs en temps réel et vous aide à planifier votre trajet sur le réseau de la STSV.',
    en: 'The Transit app shows real-time departures and helps you plan your trip on the STSV network.',
    es: 'La aplicación Transit muestra las salidas en tiempo real y te ayuda a planear tu viaje en la red de la STSV.',
  },
};

/* -------------------------- Carte des arrêts ---------------------- */
export const stops = {
  meta: {
    title: {
      fr: 'Carte du réseau et arrêts — STSV',
      en: 'Network map and stops — STSV',
      es: 'Mapa de la red y paradas — STSV',
    },
    description: {
      fr: 'Consultez la carte du réseau STSV. Localisez les arrêts d’autobus et les points d’embarquement à Salaberry-de-Valleyfield et dans Soulanges.',
      en: 'See the STSV network map. Locate bus stops and pickup points in Salaberry-de-Valleyfield and Soulanges.',
      es: 'Consulta el mapa de la red STSV. Localiza las paradas y puntos de embarque en Salaberry-de-Valleyfield y Soulanges.',
    },
  },
  h1: {
    fr: 'Explorez votre réseau de transport en un seul endroit',
    en: 'Explore your whole transit network in one place',
    es: 'Explora toda tu red de transporte en un solo lugar',
  },
  lead: {
    fr: 'Votre guide visuel pour explorer Salaberry-de-Valleyfield.',
    en: 'Your visual guide to getting around Salaberry-de-Valleyfield.',
    es: 'Tu guía visual para descubrir Salaberry-de-Valleyfield.',
  },
  features: [
    {
      title: { fr: 'Emplacement exact', en: 'Exact location', es: 'Ubicación exacta' },
      body: {
        fr: 'Trouvez l’emplacement exact de chacun de nos arrêts dans les régions de Valleyfield et de Soulanges.',
        en: 'Find the exact location of each of our stops in the Valleyfield and Soulanges regions.',
        es: 'Encuentra la ubicación exacta de cada una de nuestras paradas en las regiones de Valleyfield y Soulanges.',
      },
    },
    {
      title: { fr: 'Planification intelligente', en: 'Smart planning', es: 'Planificación inteligente' },
      body: {
        fr: 'Consultez les itinéraires disponibles et le tracé complet de votre ligne pour planifier facilement votre horaire.',
        en: 'Check available routes and the full path of your line to plan your schedule easily.',
        es: 'Consulta las rutas disponibles y el recorrido completo de tu línea para planificar tu horario fácilmente.',
      },
    },
    {
      title: { fr: 'Informations à jour', en: 'Up-to-date information', es: 'Información actualizada' },
      body: {
        fr: 'Informations d’accès concernant des services spécifiques, tels que les lignes 10, 30 et 99, ou le service Communobus.',
        en: 'Access details for specific services such as lines 10, 30 and 99, or the Communobus service.',
        es: 'Accede a los detalles de servicios específicos como las líneas 10, 30 y 99, o el servicio Communobus.',
      },
    },
  ],
  ctaTitle: {
    fr: 'Trouver un arrêt',
    en: 'Find a stop',
    es: 'Encontrar una parada',
  },
  ctaBody: {
    fr: 'Cliquez sur un arrêt de la carte pour voir son numéro : c’est celui à donner au moment de réserver, par téléphone, par texto ou en ligne.',
    en: 'Click a stop on the map to see its number: that is the one to give when booking, by phone, by text or online.',
    es: 'Haz clic en una parada del mapa para ver su número: es el que debes dar al reservar, por teléfono, por mensaje o en línea.',
  },
};

/* ------------------------ Infos réservation ----------------------- */
export const reservation = {
  meta: {
    title: {
      fr: 'Infos réservation — Communobus STSV',
      en: 'Reservation information — STSV Communobus',
      es: 'Información de reserva — Communobus STSV',
    },
    description: {
      fr: 'Trois façons de réserver votre Communobus : par téléphone, par messagerie texte ou en ligne. Voici ce qu’il faut préparer.',
      en: 'Three ways to book your Communobus: by phone, by text message or online. Here is what to prepare.',
      es: 'Tres formas de reservar tu Communobus: por teléfono, por mensaje de texto o en línea. Esto es lo que debes preparar.',
    },
  },
  h1: { fr: 'Réservation', en: 'Reservation', es: 'Reserva' },
  lead: {
    fr: 'Trois modes de réservation sont disponibles, accessibles à tout moment du jour ou de la nuit.',
    en: 'Three booking methods are available, at any time of day or night.',
    es: 'Hay tres métodos de reserva disponibles, a cualquier hora del día o de la noche.',
  },
  methods: [
    {
      n: '1',
      title: {
        fr: 'Par téléphone avec un agent',
        en: 'By phone with an agent',
        es: 'Por teléfono con un agente',
      },
      body: {
        fr: 'Appelez au moins une heure à l’avance. Un agent répond entre 6 h 30 et 18 h 00 du lundi au vendredi, et de 8 h 00 à 16 h 00 le samedi. Fermé le dimanche.',
        en: 'Call at least one hour ahead. An agent answers between 6:30 a.m. and 6:00 p.m. Monday to Friday, and 8:00 a.m. to 4:00 p.m. on Saturday. Closed Sunday.',
        es: 'Llama al menos con una hora de anticipación. Un agente responde entre las 6:30 y las 18:00 de lunes a viernes, y de 8:00 a 16:00 los sábados. Cerrado los domingos.',
      },
    },
    {
      n: '2',
      title: {
        fr: 'Par messagerie texte',
        en: 'By text message',
        es: 'Por mensaje de texto',
      },
      body: {
        fr: 'Le service de messagerie texte permet de réserver au même numéro. Contactez-nous au moins une heure à l’avance.',
        en: 'The text message service lets you book at the same number. Contact us at least one hour ahead.',
        es: 'El servicio de mensajes de texto permite reservar al mismo número. Contáctanos al menos con una hora de anticipación.',
      },
    },
    {
      n: '3',
      title: { fr: 'En ligne', en: 'Online', es: 'En línea' },
      body: {
        fr: 'Réservez directement sur la plateforme de réservation, 24 heures sur 24.',
        en: 'Book directly on the booking platform, 24 hours a day.',
        es: 'Reserva directamente en la plataforma de reservas, las 24 horas.',
      },
    },
  ],
  smsTitle: {
    fr: 'Commandes par messagerie texte',
    en: 'Text message commands',
    es: 'Comandos por mensaje de texto',
  },
  smsCommands: [
    {
      cmd: 'Commander',
      syntax: 'Commander «numéro de client» «arrêt d’embarquement» «arrêt de débarquement» «heure»',
      example: 'Commander 11111 210 2106 12:10',
      label: { fr: 'Réserver un déplacement', en: 'Book a trip', es: 'Reservar un viaje' },
    },
    {
      cmd: 'Lister',
      syntax: 'Lister «numéro de client»',
      example: 'Lister 11111',
      label: {
        fr: 'Voir vos réservations',
        en: 'See your bookings',
        es: 'Ver tus reservas',
      },
    },
    {
      cmd: 'Annuler',
      syntax: 'Annuler «numéro de client» «heure d’embarquement»',
      example: 'Annuler 99230 23:10',
      label: { fr: 'Annuler un déplacement', en: 'Cancel a trip', es: 'Cancelar un viaje' },
    },
  ],
  needTitle: {
    fr: 'Ce qu’il faut avoir sous la main',
    en: 'What to have ready',
    es: 'Lo que debes tener a mano',
  },
  need: {
    fr: [
      'Votre numéro d’usager',
      'La date et l’heure du déplacement',
      'Le numéro de l’arrêt le plus proche de votre point d’embarquement',
      'Le numéro de l’arrêt le plus proche de votre destination',
    ],
    en: [
      'Your user number',
      'The date and time of the trip',
      'The number of the stop closest to your pickup point',
      'The number of the stop closest to your destination',
    ],
    es: [
      'Tu número de usuario',
      'La fecha y la hora del viaje',
      'El número de la parada más cercana a tu punto de subida',
      'El número de la parada más cercana a tu destino',
    ],
  },
  needNote: {
    fr: 'Les numéros d’arrêt se trouvent sur la carte de localisation des arrêts, ou l’agent peut vous aider à les repérer.',
    en: 'Stop numbers are on the stop location map, or an agent can help you find them.',
    es: 'Los números de parada están en el mapa de localización de paradas, o un agente puede ayudarte a encontrarlos.',
  },
};

/* --------------------------- Carte ACCÈS -------------------------- */
export const accessCard = {
  meta: {
    title: {
      fr: 'Politique de la carte ACCÈS — STSV',
      en: 'ACCÈS card policy — STSV',
      es: 'Política de la tarjeta ACCÈS — STSV',
    },
    description: {
      fr: 'Règles d’utilisation de la carte ACCÈS de la STSV : émission, interdictions et conditions.',
      en: 'Rules for using the STSV ACCÈS card: issuance, prohibitions and conditions.',
      es: 'Reglas de uso de la tarjeta ACCÈS de la STSV: emisión, prohibiciones y condiciones.',
    },
  },
  h1: {
    fr: 'Politique de la carte ACCÈS',
    en: 'ACCÈS card policy',
    es: 'Política de la tarjeta ACCÈS',
  },
  s1Title: { fr: '1. Carte ACCÈS', en: '1. ACCÈS card', es: '1. Tarjeta ACCÈS' },
  s1Body: {
    fr: 'La carte à pictogramme ACCÈS contient tous les titres de transport de la Société de transport de Salaberry-de-Valleyfield (STSV).',
    en: 'The ACCÈS pictogram card holds all fares of the Société de transport de Salaberry-de-Valleyfield (STSV).',
    es: 'La tarjeta con pictograma ACCÈS contiene todos los títulos de transporte de la Société de transport de Salaberry-de-Valleyfield (STSV).',
  },
  s2Title: { fr: '2. Interdictions', en: '2. Prohibitions', es: '2. Prohibiciones' },
  s2Lead: {
    fr: 'Il est interdit à toute personne de :',
    en: 'No person may:',
    es: 'Queda prohibido a toda persona:',
  },
  prohibitions: {
    fr: [
      'vendre ou tenter de vendre tout titre de transport ou support conforme;',
      'louer ou tenter de louer tout titre de transport ou support conforme;',
      'accepter ou utiliser un titre de transport ou un support conforme obtenu en contravention des paragraphes précédents;',
      'utiliser un titre de transport qui n’a pas été émis en échange du paiement du tarif applicable;',
      'utiliser un support conforme qui n’a pas été émis en échange du paiement des droits exigibles;',
      'obtenir ou tenter d’obtenir un titre de transport ou un support conforme sans droit;',
      'falsifier, modifier, altérer ou reproduire un titre de transport ou un support conforme;',
      'utiliser ou tenter d’utiliser un titre de transport ou un support conforme périmé, falsifié, modifié, altéré ou reproduit;',
      'obtenir plus d’un droit de correspondance;',
      'obtenir ou tenter d’obtenir un déplacement sans avoir acquitté le droit de passage de la manière prévue à l’article 1.',
    ],
    en: [
      'sell or attempt to sell any fare or compliant medium;',
      'rent or attempt to rent any fare or compliant medium;',
      'accept or use a fare or compliant medium obtained in breach of the preceding paragraphs;',
      'use a fare that was not issued in exchange for payment of the applicable price;',
      'use a compliant medium that was not issued in exchange for payment of the applicable fees;',
      'obtain or attempt to obtain a fare or compliant medium without entitlement;',
      'forge, modify, alter or reproduce a fare or compliant medium;',
      'use or attempt to use an expired, forged, modified, altered or reproduced fare or compliant medium;',
      'obtain more than one transfer entitlement;',
      'obtain or attempt to obtain a trip without paying the fare as set out in section 1.',
    ],
    es: [
      'vender o intentar vender cualquier título o soporte conforme;',
      'alquilar o intentar alquilar cualquier título o soporte conforme;',
      'aceptar o utilizar un título o soporte conforme obtenido en infracción de los apartados anteriores;',
      'utilizar un título que no haya sido emitido a cambio del pago de la tarifa correspondiente;',
      'utilizar un soporte conforme que no haya sido emitido a cambio del pago de las tarifas requeridas;',
      'obtener o intentar obtener un título o soporte conforme sin tener derecho a ello;',
      'falsificar, modificar, alterar o reproducir un título o soporte conforme;',
      'utilizar o intentar utilizar un título o soporte conforme vencido, falsificado, modificado, alterado o reproducido;',
      'obtener más de un derecho de transbordo;',
      'obtener o intentar obtener un viaje sin haber pagado el derecho de paso en la forma prevista en el artículo 1.',
    ],
  },
  autonomyTitle: {
    fr: 'Autonomie avec la carte ACCÈS',
    en: 'Independence with the ACCÈS card',
    es: 'Autonomía con la tarjeta ACCÈS',
  },
  autonomyBody: {
    fr: 'Plus besoin d’avoir de l’argent comptant sur soi pour payer ses titres de transport. Avec la carte ACCÈS, vous chargez le montant qui correspond à vos besoins.',
    en: 'No need to carry cash to pay your fare. With the ACCÈS card, you load the amount that matches your needs.',
    es: 'No necesitas llevar efectivo para pagar tus pasajes. Con la tarjeta ACCÈS cargas el monto que se ajusta a tus necesidades.',
  },
};

/* ------------------------ Transport adapté ------------------------ */
export const adapted = {
  meta: {
    title: {
      fr: 'Transport adapté — STSV',
      en: 'Adapted transportation — STSV',
      es: 'Transporte adaptado — STSV',
    },
    description: {
      fr: 'Formulaires d’admission, territoires desservis, critères d’admissibilité et grille tarifaire du transport adapté de la STSV.',
      en: 'Eligibility forms, service area, admission criteria and fare table for STSV adapted transportation.',
      es: 'Formularios de admisión, territorios cubiertos, criterios de admisión y tarifas del transporte adaptado de la STSV.',
    },
  },
  h1: { fr: 'Transport adapté', en: 'Adapted transportation', es: 'Transporte adaptado' },
  lead: {
    fr: 'Un service dédié aux personnes dont une incapacité limite les déplacements en transport régulier.',
    en: 'A service for people whose disability limits travel on regular transit.',
    es: 'Un servicio para personas cuya discapacidad limita los desplazamientos en el transporte regular.',
  },
  formsTitle: {
    fr: 'Formulaires d’admission',
    en: 'Eligibility forms',
    es: 'Formularios de admisión',
  },
  formsNote: {
    fr: 'Le formulaire doit être complété par un professionnel de la santé (ergothérapeute, travailleur social, médecin, infirmière, etc.). Prévoyez un maximum de 24 heures ouvrables pour le traitement de votre demande.',
    en: 'The form must be completed by a health professional (occupational therapist, social worker, physician, nurse, etc.). Allow up to 24 business hours for processing.',
    es: 'El formulario debe ser completado por un profesional de la salud (terapeuta ocupacional, trabajador social, médico, enfermera, etc.). Prevé un máximo de 24 horas hábiles para el procesamiento.',
  },
  emailNote: {
    fr: 'Envoyez votre demande par courriel à :',
    en: 'Send your request by email to:',
    es: 'Envía tu solicitud por correo electrónico a:',
  },
  emails: ['ta@stsv.ca', 'houellet@stsv.ca'],
  territoryTitle: { fr: 'Territoires couverts', en: 'Service area', es: 'Territorios cubiertos' },
  onTerritory: {
    label: {
      fr: 'Municipalités desservies sur le territoire',
      en: 'Municipalities served within the territory',
      es: 'Municipios servidos dentro del territorio',
    },
    list: [
      'Coteau-du-Lac',
      'Les Coteaux',
      'Rivière-Beaudette',
      'Saint-Louis-de-Gonzague',
      'Saint-Polycarpe',
      'Saint-Stanislas-de-Kostka',
      'Saint-Zotique',
      'Salaberry-de-Valleyfield',
      'Saint-Étienne-de-Beauharnois',
      'Saint-Télesphore',
    ],
  },
  offTerritory: {
    label: {
      fr: 'Municipalités desservies hors territoire',
      en: 'Municipalities served outside the territory',
      es: 'Municipios servidos fuera del territorio',
    },
    list: ['Châteauguay', 'Huntingdon', 'Vaudreuil-Dorion', 'Beauharnois', 'Ormstown', 'L’Île-Perrot'],
  },
  bookingTitle: {
    fr: 'Formulaires de réservation',
    en: 'Booking forms',
    es: 'Formularios de reserva',
  },
  bookingBody: {
    fr: 'Faites parvenir le formulaire de réservation aux adresses courriel indiquées ci-dessus.',
    en: 'Send the booking form to the email addresses listed above.',
    es: 'Envía el formulario de reserva a las direcciones de correo indicadas arriba.',
  },
  bookingFiles: [
    {
      file: 'Reservations-travail-et-plateaux-activites.xls',
      label: {
        fr: 'Réservations pour le travail et les plateaux d’activités',
        en: 'Bookings for work and activity programs',
        es: 'Reservas para trabajo y actividades',
      },
    },
    {
      file: 'Reservations-rendez-vous-medicaux.xls',
      label: {
        fr: 'Réservations pour rendez-vous médicaux',
        en: 'Bookings for medical appointments',
        es: 'Reservas para citas médicas',
      },
    },
  ],
  criteriaTitle: {
    fr: 'Critères d’admissibilité',
    en: 'Admission criteria',
    es: 'Criterios de admisión',
  },
  criteriaLead: {
    fr: 'L’admissibilité relève de la politique du ministère des Transports du Québec. Les critères principaux sont :',
    en: 'Eligibility follows the policy of Quebec’s Ministère des Transports. The main criteria are:',
    es: 'La admisibilidad depende de la política del Ministère des Transports de Québec. Los criterios principales son:',
  },
  criteria: {
    fr: [
      'Incapacité de marcher 400 m sur un terrain uni.',
      'Incapacité de monter une marche de 35 cm avec appui ou d’en descendre une sans appui.',
      'Incapacité d’effectuer un déplacement en utilisant le transport en commun régulier.',
      'Incapacité de s’orienter dans le temps ou dans l’espace.',
      'Incapacité de maîtriser des situations ou des comportements pouvant être préjudiciables à sa propre sécurité ou à celle des autres.',
      'Incapacité de communiquer de façon verbale ou gestuelle. Cette incapacité ne peut toutefois pas être retenue seule aux fins d’admission.',
    ],
    en: [
      'Unable to walk 400 m on level ground.',
      'Unable to climb a 35 cm step with support, or step down without support.',
      'Unable to make a trip using regular public transit.',
      'Unable to orient oneself in time or space.',
      'Unable to control situations or behaviours that could harm one’s own safety or that of others.',
      'Unable to communicate verbally or by gesture. This criterion alone is not sufficient for admission.',
    ],
    es: [
      'Incapacidad de caminar 400 m en terreno plano.',
      'Incapacidad de subir un escalón de 35 cm con apoyo o de bajarlo sin apoyo.',
      'Incapacidad de desplazarse usando el transporte público regular.',
      'Incapacidad de orientarse en el tiempo o en el espacio.',
      'Incapacidad de controlar situaciones o comportamientos que puedan perjudicar su propia seguridad o la de otros.',
      'Incapacidad de comunicarse de forma verbal o gestual. Este criterio por sí solo no basta para la admisión.',
    ],
  },
  policyUrl: 'https://www.quebec.ca/transports/transport-adapte/admissibilite-transport-adapte',
  policyLabel: {
    fr: 'Politique d’admissibilité de Transports Québec',
    en: 'Transports Québec eligibility policy',
    es: 'Política de admisibilidad de Transports Québec',
  },
  offScheduleTitle: {
    fr: 'Horaire du transport adapté hors territoire',
    en: 'Out-of-territory adapted transportation schedule',
    es: 'Horario del transporte adaptado fuera del territorio',
  },
  offScheduleNote: {
    fr: 'Beauharnois, Châteauguay, Ormstown, Huntingdon, Vaudreuil, Île-Perrot.',
    en: 'Beauharnois, Châteauguay, Ormstown, Huntingdon, Vaudreuil, Île-Perrot.',
    es: 'Beauharnois, Châteauguay, Ormstown, Huntingdon, Vaudreuil, Île-Perrot.',
  },
  offScheduleHead: {
    fr: ['Heure d’arrivée à destination', 'Heure de retour à l’embarquement'],
    en: ['Arrival time at destination', 'Return pickup time'],
    es: ['Hora de llegada al destino', 'Hora de regreso al embarque'],
  },
  offSchedule: [
    ['9 h 30', '12 h 30'],
    ['12 h 00', '15 h 00'],
    ['14 h 00', '17 h 00'],
  ],
};

/* ---------------------- Grilles tarifaires TA --------------------- */
export const adaptedFares = [
  {
    id: 'adapted-fare-a',
    title: {
      fr: 'Déplacement dans la même municipalité — Titre A',
      en: 'Travel within the same municipality — Fare A',
      es: 'Viaje dentro del mismo municipio — Título A',
    },
    rows: [
      { label: { fr: '1 passage', en: '1 ride', es: '1 pasaje' }, regular: '4,60 $', reduced: '2,85 $' },
      { label: { fr: 'Passe mensuelle', en: 'Monthly pass', es: 'Pase mensual' }, regular: '118,50 $', reduced: '72,00 $' },
      { label: { fr: 'Étudiant Cégep de Valleyfield', en: 'Cégep de Valleyfield student', es: 'Estudiante Cégep de Valleyfield' }, regular: '71,50 $' },
      { label: { fr: 'Pénalité d’absence', en: 'No-show penalty', es: 'Penalidad por ausencia' }, regular: '5,00 $' },
    ],
  },
  {
    id: 'adapted-fare-b',
    title: {
      fr: 'Intermunicipal — Titre B',
      en: 'Intermunicipal — Fare B',
      es: 'Intermunicipal — Título B',
    },
    rows: [
      { label: { fr: '1 passage', en: '1 ride', es: '1 pasaje' }, regular: '8,25 $', reduced: '6,20 $' },
      { label: { fr: 'Passe mensuelle', en: 'Monthly pass', es: 'Pase mensual' }, regular: '165,00 $', reduced: '98,00 $' },
      { label: { fr: 'Étudiant Cégep de Valleyfield', en: 'Cégep de Valleyfield student', es: 'Estudiante Cégep de Valleyfield' }, regular: '71,50 $' },
      { label: { fr: 'Pénalité d’absence', en: 'No-show penalty', es: 'Penalidad por ausencia' }, regular: '5,00 $' },
    ],
  },
  {
    id: 'adapted-fare-outside',
    title: {
      fr: 'Transport adapté hors territoire',
      en: 'Out-of-territory adapted transportation',
      es: 'Transporte adaptado fuera del territorio',
    },
    rows: [
      { label: { fr: '1 passage', en: '1 ride', es: '1 pasaje' }, regular: '11,00 $', reduced: '7,75 $' },
      { label: { fr: 'Passe mensuelle', en: 'Monthly pass', es: 'Pase mensual' }, regular: '180,00 $', reduced: '115,00 $' },
      { label: { fr: 'Pénalité d’absence', en: 'No-show penalty', es: 'Penalidad por ausencia' }, regular: '15,00 $' },
      {
        label: {
          fr: 'Transport Montréal (fauteuil roulant uniquement) — 1 passage',
          en: 'Montréal transport (wheelchair only) — 1 ride',
          es: 'Transporte a Montreal (solo silla de ruedas) — 1 pasaje',
        },
        regular: '45,00 $',
      },
    ],
  },
];

export const adaptedFareNote = {
  fr: 'Titre B — déplacement à l’extérieur de sa municipalité : Rivière-Beaudette, Saint-Polycarpe, Saint-Zotique, Les Coteaux, Coteau-du-Lac, Salaberry-de-Valleyfield, Saint-Stanislas-de-Kostka, Saint-Louis-de-Gonzague et Saint-Étienne-de-Beauharnois.',
  en: 'Fare B — travel outside your municipality: Rivière-Beaudette, Saint-Polycarpe, Saint-Zotique, Les Coteaux, Coteau-du-Lac, Salaberry-de-Valleyfield, Saint-Stanislas-de-Kostka, Saint-Louis-de-Gonzague and Saint-Étienne-de-Beauharnois.',
  es: 'Título B — viaje fuera de tu municipio: Rivière-Beaudette, Saint-Polycarpe, Saint-Zotique, Les Coteaux, Coteau-du-Lac, Salaberry-de-Valleyfield, Saint-Stanislas-de-Kostka, Saint-Louis-de-Gonzague y Saint-Étienne-de-Beauharnois.',
};

/* -------------------------- Qui sommes-nous ----------------------- */
export const about = {
  meta: {
    title: {
      fr: 'Qui sommes-nous — STSV',
      en: 'About us — STSV',
      es: 'Quiénes somos — STSV',
    },
    description: {
      fr: 'La Société de transport de Salaberry-de-Valleyfield dessert neuf municipalités en transport collectif et adapté.',
      en: 'The Société de transport de Salaberry-de-Valleyfield serves nine municipalities with public and adapted transit.',
      es: 'La Société de transport de Salaberry-de-Valleyfield sirve a nueve municipios con transporte público y adaptado.',
    },
  },
  h1: { fr: 'Qui sommes-nous ?', en: 'About us', es: '¿Quiénes somos?' },
  facts: {
    fr: [
      'La STSV offre un service de transport collectif à la demande dans les municipalités de Saint-Polycarpe, Saint-Zotique, Les Coteaux, Coteau-du-Lac, Salaberry-de-Valleyfield, Les Cèdres et Pointe-des-Cascades.',
      'La STSV offre un service de transport adapté dans les municipalités de Rivière-Beaudette, Saint-Polycarpe, Saint-Zotique, Les Coteaux, Coteau-du-Lac, Salaberry-de-Valleyfield, Saint-Louis-de-Gonzague, Saint-Stanislas-de-Kostka et Saint-Étienne-de-Beauharnois.',
      'Le transport collectif à la demande est disponible de 5 h 20 à 00 h 15, 7 jours sur 7.',
      'La STSV offre également un service sur des lignes fixes sans réservation : la ligne 99 vers la gare de Vaudreuil et la ligne 10 pour le circuit du centre-ville. La ligne 30 vers Beauharnois est sur réservation.',
      'Puisqu’il s’agit de transport collectif, la STSV favorise le jumelage. Il peut y avoir jusqu’à 3 personnes dans un même véhicule.',
    ],
    en: [
      'STSV runs an on-demand public transit service in Saint-Polycarpe, Saint-Zotique, Les Coteaux, Coteau-du-Lac, Salaberry-de-Valleyfield, Les Cèdres and Pointe-des-Cascades.',
      'STSV runs an adapted transportation service in Rivière-Beaudette, Saint-Polycarpe, Saint-Zotique, Les Coteaux, Coteau-du-Lac, Salaberry-de-Valleyfield, Saint-Louis-de-Gonzague, Saint-Stanislas-de-Kostka and Saint-Étienne-de-Beauharnois.',
      'On-demand transit runs from 5:20 a.m. to 12:15 a.m., 7 days a week.',
      'STSV also runs fixed lines with no reservation: line 99 to the Vaudreuil station and line 10 for the downtown loop. Line 30 to Beauharnois is by reservation.',
      'As a shared service, STSV pairs trips when possible. There may be up to 3 passengers in the same vehicle.',
    ],
    es: [
      'La STSV ofrece transporte colectivo a demanda en Saint-Polycarpe, Saint-Zotique, Les Coteaux, Coteau-du-Lac, Salaberry-de-Valleyfield, Les Cèdres y Pointe-des-Cascades.',
      'La STSV ofrece transporte adaptado en Rivière-Beaudette, Saint-Polycarpe, Saint-Zotique, Les Coteaux, Coteau-du-Lac, Salaberry-de-Valleyfield, Saint-Louis-de-Gonzague, Saint-Stanislas-de-Kostka y Saint-Étienne-de-Beauharnois.',
      'El transporte a demanda funciona de 5:20 a 00:15, los 7 días de la semana.',
      'La STSV también opera líneas fijas sin reserva: la línea 99 hacia la estación de Vaudreuil y la línea 10 para el circuito del centro. La línea 30 hacia Beauharnois es con reserva.',
      'Al ser transporte colectivo, la STSV promueve el viaje compartido. Puede haber hasta 3 personas en un mismo vehículo.',
    ],
  },
  bookingTitle: {
    fr: 'Flexibilité grâce aux différents modes de réservation',
    en: 'Flexible booking options',
    es: 'Flexibilidad gracias a distintos métodos de reserva',
  },
  bookingLead: {
    fr: 'Plusieurs options sont offertes pour effectuer votre réservation, accessibles à tout moment du jour ou de la nuit :',
    en: 'Several options are available to book, at any time of day or night:',
    es: 'Tienes varias opciones para reservar, a cualquier hora del día o de la noche:',
  },
  bookingModes: {
    fr: ['Système d’appel automatisé', 'Site Web', 'Messagerie texte'],
    en: ['Automated call system', 'Website', 'Text message'],
    es: ['Sistema de llamada automatizado', 'Sitio web', 'Mensaje de texto'],
  },
  soonTitle: {
    fr: 'Accès rapide pour la réservation',
    en: 'Faster access to booking',
    es: 'Acceso rápido a las reservas',
  },
  soonBody: {
    fr: 'Bientôt, une carte virtuelle sur le site de réservation permettra de localiser l’arrêt le plus proche de votre adresse de départ et de votre destination.',
    en: 'Soon, a virtual map on the booking site will let you locate the stop closest to your departure address and your destination.',
    es: 'Próximamente, un mapa virtual en el sitio de reservas permitirá localizar la parada más cercana a tu dirección de salida y a tu destino.',
  },
};

/* ---------------------------- Documents --------------------------- */
export const documentsPage = {
  meta: {
    title: {
      fr: 'Documents à consulter — STSV',
      en: 'Documents — STSV',
      es: 'Documentos — STSV',
    },
    description: {
      fr: 'Horaires, formulaires du transport adapté et politiques institutionnelles de la STSV, en téléchargement.',
      en: 'STSV schedules, adapted transportation forms and institutional policies, available for download.',
      es: 'Horarios, formularios de transporte adaptado y políticas institucionales de la STSV, para descargar.',
    },
  },
  h1: { fr: 'Documents à consulter', en: 'Documents', es: 'Documentos a consultar' },
  lead: {
    fr: 'Consultez et téléchargez les horaires, formulaires et politiques de la STSV. Tous les fichiers sont en format PDF.',
    en: 'Browse and download STSV schedules, forms and policies. All files are in PDF format.',
    es: 'Consulta y descarga los horarios, formularios y políticas de la STSV. Todos los archivos están en formato PDF.',
  },
};

/* ---------------------------- Tutoriels --------------------------- */
export const tutorials = {
  meta: {
    title: {
      fr: 'Tutoriels — STSV',
      en: 'Tutorials — STSV',
      es: 'Tutoriales — STSV',
    },
    description: {
      fr: 'Vidéos pratiques : s’inscrire au Communobus, réserver en ligne, recharger sa carte ACCÈS et comprendre la facturation.',
      en: 'Practical videos: register for Communobus, book online, top up your ACCÈS card and understand billing.',
      es: 'Videos prácticos: registrarse en Communobus, reservar en línea, recargar la tarjeta ACCÈS y entender la facturación.',
    },
  },
  h1: { fr: 'Tutoriels', en: 'Tutorials', es: 'Tutoriales' },
  lead: {
    fr: 'Des vidéos courtes pour prendre en main les services de la STSV.',
    en: 'Short videos to get started with STSV services.',
    es: 'Videos cortos para empezar a usar los servicios de la STSV.',
  },
  playLabel: { fr: 'Lire la vidéo', en: 'Play video', es: 'Reproducir video' },
  privacyNote: {
    fr: 'La vidéo se charge depuis YouTube seulement lorsque vous cliquez.',
    en: 'The video loads from YouTube only when you click.',
    es: 'El video se carga desde YouTube solo cuando haces clic.',
  },
  items: [
    {
      id: { fr: 'De4L-LQjhRo', en: 'z1yMcMgigr4', es: 'r-z2w0Vva5M' },
      title: {
        fr: 'Comment s’inscrire au Communobus ?',
        en: 'How to register for Communobus?',
        es: '¿Cómo registrarse en Communobus?',
      },
    },
    {
      id: { fr: 'eCkwF1Gor8E', en: 'PSw1N8BLrXc', es: '6pHUVN2cPNI' },
      title: {
        fr: 'Comment fonctionne la facturation du transport adapté ?',
        en: 'How does adapted transport billing work?',
        es: '¿Cómo funciona la facturación del transporte adaptado?',
      },
    },
    {
      id: { fr: 'KRgq6P-EGwQ', en: 'dWgKfb4LYHU', es: 'H5xbaWYxpBI' },
      title: {
        fr: 'Comment réserver un Communobus en ligne ?',
        en: 'How to book a Communobus online?',
        es: '¿Cómo reservar un Communobus en línea?',
      },
    },
    {
      id: { fr: '80u2a9Nx3uY', en: 'HJLC5fChssM', es: 'K9qpTKsgJPE' },
      title: {
        fr: 'Comment recharger votre carte ACCÈS ?',
        en: 'How to top up your ACCÈS card?',
        es: '¿Cómo recargar tu tarjeta ACCÈS?',
      },
    },
    {
      id: { fr: 'AxjRdd0RCgA', en: 'ENqMwciHMMs', es: 'EziSWLCLknU' },
      title: {
        fr: 'Comment fonctionne le Communobus ?',
        en: 'How does the Communobus work?',
        es: '¿Cómo funciona el Communobus?',
      },
    },
  ],
};

/* ----------------------------- Contact ---------------------------- */
export const contactPage = {
  meta: {
    title: {
      fr: 'Nous joindre — STSV',
      en: 'Contact us — STSV',
      es: 'Contáctenos — STSV',
    },
    description: {
      fr: 'Communiquez avec la STSV par téléphone ou par le formulaire. Heures du service de réservation et coordonnées.',
      en: 'Reach STSV by phone or through the form. Reservation service hours and contact details.',
      es: 'Comunícate con la STSV por teléfono o mediante el formulario. Horario del servicio de reservas y datos de contacto.',
    },
  },
  h1: { fr: 'Nous joindre', en: 'Contact us', es: 'Contáctenos' },
  lead: {
    fr: 'Une question sur un trajet, une réservation ou le transport adapté ? Écrivez-nous ou appelez-nous.',
    en: 'A question about a trip, a booking or adapted transportation? Write or call us.',
    es: '¿Una pregunta sobre un viaje, una reserva o el transporte adaptado? Escríbenos o llámanos.',
  },
  phoneTitle: { fr: 'Par téléphone', en: 'By phone', es: 'Por teléfono' },
  hoursTitle: { fr: 'Heures du service de réservation', en: 'Reservation service hours', es: 'Horario del servicio de reservas' },
  hours: {
    fr: ['Lundi au vendredi : 6 h 30 à 18 h 00', 'Samedi : 8 h 00 à 16 h 00', 'Dimanche : fermé'],
    en: ['Monday to Friday: 6:30 a.m. to 6:00 p.m.', 'Saturday: 8:00 a.m. to 4:00 p.m.', 'Sunday: closed'],
    es: ['Lunes a viernes: 6:30 a 18:00', 'Sábado: 8:00 a 16:00', 'Domingo: cerrado'],
  },
  adaptedTitle: { fr: 'Transport adapté', en: 'Adapted transportation', es: 'Transporte adaptado' },
  adaptedBody: {
    fr: 'Pour les demandes d’admission et les réservations du transport adapté :',
    en: 'For adapted transportation eligibility requests and bookings:',
    es: 'Para solicitudes de admisión y reservas del transporte adaptado:',
  },
  formTitle: { fr: 'Écrivez-nous', en: 'Write to us', es: 'Escríbenos' },
};

/* ---------------------------- Infolettre -------------------------- */
export const newsletterPage = {
  meta: {
    title: {
      fr: 'Infolettre — Avis de service et horaires — STSV',
      en: 'Newsletter — Service alerts and schedules — STSV',
      es: 'Boletín — Avisos de servicio y horarios — STSV',
    },
    description: {
      fr: 'Changements d’horaire, avis de service et nouveaux trajets, directement dans votre boîte courriel.',
      en: 'Schedule changes, service alerts and new routes, straight to your inbox.',
      es: 'Cambios de horario, avisos de servicio y nuevas rutas, directo a tu correo.',
    },
  },
  h1: { fr: 'Restez à bord.', en: 'Stay on board.', es: 'Sigue a bordo.' },
  lead: {
    fr: 'Changements d’horaire, mises à jour de service et nouveaux trajets — directement dans votre boîte courriel. Pas de pourriel, pas de remplissage. Juste ce qu’il faut pour planifier votre trajet.',
    en: 'Schedule changes, service updates and route news — straight to your inbox. No spam, no filler. Just what you need to plan your trip.',
    es: 'Cambios de horario, actualizaciones de servicio y nuevas rutas — directo a tu correo. Sin spam, sin relleno. Solo lo que necesitas para planear tu viaje.',
  },
  formTitle: { fr: 'S’abonner', en: 'Subscribe', es: 'Suscribirse' },
  formNote: {
    fr: '30 secondes. Désabonnement en tout temps.',
    en: 'Takes 30 seconds. Unsubscribe anytime.',
    es: '30 segundos. Cancela tu suscripción cuando quieras.',
  },
  benefits: [
    {
      title: {
        fr: 'Changements d’horaire d’abord',
        en: 'Schedule changes first',
        es: 'Cambios de horario primero',
      },
      body: {
        fr: 'Détours, fermetures, horaires des jours fériés — avant qu’ils ne vous surprennent à l’arrêt.',
        en: 'Detours, closures, holiday hours — before they catch you at the stop.',
        es: 'Desvíos, cierres, horarios de días festivos — antes de que te sorprendan en la parada.',
      },
    },
    {
      title: {
        fr: 'Nouveaux trajets et couverture',
        en: 'New routes and coverage',
        es: 'Nuevas rutas y cobertura',
      },
      body: {
        fr: 'Quand on ajoute un arrêt, qu’on prolonge une ligne ou qu’on dessert une nouvelle municipalité — vous le saurez.',
        en: 'When we add a stop, extend a line or reach a new municipality — you’ll know.',
        es: 'Cuando agregamos una parada, extendemos una línea o llegamos a un nuevo municipio — lo sabrás.',
      },
    },
    {
      title: { fr: 'Avis de service', en: 'Service alerts', es: 'Avisos de servicio' },
      body: {
        fr: 'Météo, fermetures de routes, mise à jour de la billetterie. Envoyés seulement quand ça compte.',
        en: 'Weather, road closures, ticket office updates. Sent only when it matters.',
        es: 'Clima, cierres de vías, actualizaciones de la taquilla. Enviados solo cuando importa.',
      },
    },
    {
      title: { fr: 'Pas de pourriel. Jamais.', en: 'No spam. Ever.', es: 'Sin spam. Nunca.' },
      body: {
        fr: 'On écrit quand il y a une nouvelle — pas pour remplir un quota. Désabonnement en un clic.',
        en: 'We email when there’s news — not to fill a quota. One-click unsubscribe.',
        es: 'Escribimos cuando hay noticias — no para llenar un cupo. Cancelación con un clic.',
      },
    },
  ],
};
