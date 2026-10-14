import type { L10n } from './site';

export const recruitmentRecipient = 'houellet@stsv.ca';
export const recruitment: {
  title: L10n; intro: L10n; requirementsTitle: L10n; requirements: L10n[];
  benefitsTitle: L10n; benefits: L10n[]; applyTitle: L10n; apply: L10n; cta: L10n;
} = {
  title: { fr: 'Chauffeurs recherchés – STSV', en: 'Drivers wanted – STSV', es: 'Buscamos conductores – STSV' },
  intro: {
    fr: 'STSV est à la recherche de chauffeurs pour se joindre à son équipe dans le domaine du transport collectif et du transport adapté. Aucun véhicule personnel n’est requis : nous cherchons des personnes qui souhaitent conduire nos véhicules. Si vous avez le sens du service et que vous faites preuve de rigueur et de professionnalisme, cette occasion est pour vous.',
    en: 'STSV is looking for drivers to join its public transit and adapted transportation team. No personal vehicle is required: we are looking for people who want to drive our vehicles. If you are service-minded, dependable and professional, this opportunity is for you.',
    es: 'STSV busca conductores para unirse a su equipo de transporte colectivo y transporte adaptado. No se requiere vehículo personal: buscamos personas que quieran conducir nuestros vehículos. Si tienes vocación de servicio y trabajas con rigor y profesionalismo, esta oportunidad es para ti.',
  },
  requirementsTitle: { fr: 'Ce que nous recherchons', en: 'What we are looking for', es: 'Lo que buscamos' },
  requirements: [
    { fr: 'Un chauffeur qui respecte notre politique de qualité de service', en: 'A driver who follows our service quality policy', es: 'Un conductor que respete nuestra política de calidad de servicio' },
    { fr: 'Une ponctualité irréprochable', en: 'Consistent punctuality', es: 'Puntualidad impecable' },
    { fr: 'De l’intégrité dans toutes vos interactions', en: 'Integrity in every interaction', es: 'Integridad en todas tus interacciones' },
    { fr: 'Du respect envers les besoins de l’organisation et de la clientèle', en: 'Respect for the needs of the organization and its passengers', es: 'Respeto por las necesidades de la organización y de sus pasajeros' },
    { fr: 'Une approche centrée sur le client, avec le souci de lui offrir une expérience soignée', en: 'A passenger-focused approach and a commitment to a positive experience', es: 'Un enfoque centrado en el cliente, con atención a ofrecer una experiencia cuidada' },
  ],
  benefitsTitle: { fr: 'Ce que nous offrons', en: 'What we offer', es: 'Lo que ofrecemos' },
  benefits: [
    { fr: 'Rémunération d’environ 30 $ de l’heure', en: 'Pay of approximately $30 per hour', es: 'Remuneración de aproximadamente 30 $ por hora' },
    { fr: 'Conditions de travail à convenir avec le propriétaire', en: 'Working conditions to be agreed upon with the owner', es: 'Condiciones de trabajo a convenir con el propietario' },
    { fr: 'Une place dans une équipe qui valorise le service et le professionnalisme', en: 'A place on a team that values service and professionalism', es: 'Un lugar en un equipo que valora el servicio y el profesionalismo' },
  ],
  applyTitle: { fr: 'Comment postuler', en: 'How to apply', es: 'Cómo postular' },
  apply: {
    fr: 'Remplissez le formulaire en indiquant votre expérience et vos disponibilités. Votre candidature sera transmise à houellet@stsv.ca.',
    en: 'Complete the form with your experience and availability. Your application will be forwarded to houellet@stsv.ca.',
    es: 'Completa el formulario indicando tu experiencia y disponibilidad. Tu candidatura se enviará a houellet@stsv.ca.',
  },
  cta: { fr: 'Postuler', en: 'Apply', es: 'Postular' },
};
