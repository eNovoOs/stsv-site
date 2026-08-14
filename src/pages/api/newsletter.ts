import type { APIRoute } from 'astro';
import { validate, forward } from '../../lib/webhook';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'bad_json' }), { status: 400 });
  }

  const result = validate(body, 'newsletter');
  if (!result.ok) {
    // Un bot détecté reçoit 200 : inutile de lui signaler l'échec.
    if (result.reason === 'spam') return new Response(JSON.stringify({ ok: true }), { status: 200 });
    return new Response(JSON.stringify({ error: result.reason }), { status: 422 });
  }

  try {
    await forward(result.data);
  } catch (err) {
    console.error('[newsletter]', err);
    return new Response(JSON.stringify({ error: 'upstream' }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
