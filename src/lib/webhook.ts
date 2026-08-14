/**
 * Envoi des soumissions de formulaire vers le webhook eNovoOs.
 * Configurer STSV_WEBHOOK_URL (et STSV_WEBHOOK_SECRET si requis) dans Vercel.
 */
export type Payload = Record<string, unknown>;

const MAX = { name: 120, email: 160, phone: 40, subject: 160, message: 4000 };

export function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export function validate(body: Payload, kind: 'contact' | 'newsletter') {
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

export async function forward(data: Payload) {
  const url = import.meta.env.STSV_WEBHOOK_URL;
  if (!url) throw new Error('STSV_WEBHOOK_URL manquant');
  const secret = import.meta.env.STSV_WEBHOOK_SECRET;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'X-STSV-Signature': secret } : {}),
    },
    body: JSON.stringify({ ...data, source: 'stsv.ca', receivedAt: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error('webhook ' + res.status);
}
