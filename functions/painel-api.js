const SENHA = 'sais@2026';

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  if (url.searchParams.get('auth') !== SENHA) {
    return json({ error: 'unauthorized' }, 401);
  }

  const kv = env.RESERVAS;
  if (!kv) return json({ error: 'KV_NOT_BOUND' }, 500);

  if (request.method === 'GET') {
    const data = (await kv.get('reservas', 'json')) || [];
    return json([...data].reverse());
  }

  if (request.method === 'PATCH') {
    const { id, status } = await request.json().catch(() => ({}));
    if (!id || !status) return json({ error: 'bad_request' }, 400);
    const data = (await kv.get('reservas', 'json')) || [];
    const i = data.findIndex(r => r.id === id);
    if (i < 0) return json({ error: 'not_found' }, 404);
    data[i].status = status;
    if (status === 'pago') data[i].pago_em = new Date().toISOString();
    await kv.put('reservas', JSON.stringify(data));
    return json({ ok: true });
  }

  return new Response('Method Not Allowed', { status: 405 });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
