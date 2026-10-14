import type { APIRoute } from 'astro';
import { validate, forward } from '../../lib/webhook';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const json = (body: object, status: number) => new Response(JSON.stringify(body), {
    status, headers: { 'Content-Type': 'application/json' },
  });
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return json({ error: 'bad_json' }, 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'invalid' }, 422);
  const result = validate(body, 'recruitment');
  if (!result.ok) {
    if (result.reason === 'spam') return json({ ok: true }, 200);
    return json({ error: result.reason }, 422);
  }
  try { await forward('recruitment', result.data); }
  catch {
    console.error('[recruitment] Échec de transmission de la candidature');
    return json({ error: 'upstream' }, 502);
  }
  return json({ ok: true }, 200);
};
