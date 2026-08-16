/**
 * Envoi des soumissions de formulaire vers les webhooks eNovoOs.
 *
 * Chaque formulaire a sa propre URL. Les valeurs sont des variables
 * d'environnement Vercel — elles ne sont jamais dans le dépôt :
 *   STSV_WEBHOOK_CONTACT     → formulaire « Nous joindre »
 *   STSV_WEBHOOK_NEWSLETTER  → formulaire « Infolettre »
 *   STSV_WEBHOOK_SECRET      → optionnel, en-tête X-STSV-Signature
 */
export type Kind = 'contact' | 'newsletter';
export type Payload = Record<string, unknown>;

const MAX = { name: 120, email: 160, phone: 40, subject: 160, message: 4000 };

export function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export function validate(body: Payload, kind: Kind) {
  // Honeypot : un bot remplit le champ caché.
  if (clean(body.company, 80)) return { ok: false as const, reason: 'spam' };

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  if (!name || !isEmail(email)) return { ok: false as const, reason: 'invalid' };
  if (!body.consent) return { ok: false as const, reason: 'consent' };

  const locale = ['fr', 'en', 'es'].includes(String(body.locale)) ? String(body.locale) : 'fr';

  if (kind === 'newsletter') {
    return { ok: true as const, data: { kind, locale, name, email } };
  }

  const subject = clean(body.subject, MAX.subject);
  const message = clean(body.message, MAX.message);
  if (!subject || !message) return { ok: false as const, reason: 'invalid' };

  return {
    ok: true as const,
    data: { kind, locale, name, email, phone: clean(body.phone, MAX.phone), subject, message },
  };
}

function endpointFor(kind: Kind): string | undefined {
  const env = import.meta.env;
  const specific = kind === 'contact' ? env.STSV_WEBHOOK_CONTACT : env.STSV_WEBHOOK_NEWSLETTER;
  // STSV_WEBHOOK_URL sert de repli si une seule URL est configurée.
  return specific || env.STSV_WEBHOOK_URL;
}

export async function forward(kind: Kind, data: Payload) {
  const url = endpointFor(kind);
  if (!url) throw new Error(`Webhook non configuré pour « ${kind} »`);

  const secret = import.meta.env.STSV_WEBHOOK_SECRET;

  // Le workflow ne doit pas rester bloqué si l'API tarde à répondre.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'X-STSV-Signature': secret } : {}),
      },
      body: JSON.stringify({ ...data, source: 'stsv.ca', receivedAt: new Date().toISOString() }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  } finally {
    clearTimeout(timer);
  }
}
