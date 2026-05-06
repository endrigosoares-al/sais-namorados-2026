const SENHA = 'sais@2026';
const RDS_API_KEY = 'ZjYlPgOOuAATeDCrdiOcbSTVowlXHcbewjgk';

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

    if (status === 'pago') {
      fireRdsPago(data[i], url.origin).catch(() => {});
    }

    return json({ ok: true });
  }

  return new Response('Method Not Allowed', { status: 405 });
}

async function fireRdsPago(r, origin) {
  const voucherUrl = origin + '/voucher?id=' + r.id;
  const payload = {
    event_type: 'CONVERSION',
    event_family: 'CDP',
    payload: {
      conversion_identifier: 'pagamento-confirmado-namorados-2026',
      tags: ['pago', 'namorados-2026'],
      name:            r.nome     || '',
      email:           r.email,
      mobile_phone:    r.celular  || '',
      cf_horario:      r.horario  || '',
      cf_pessoas:      String(r.pessoas || ''),
      cf_valor_total:  String(r.valor   || ''),
      cf_voucher_url:  voucherUrl,
    }
  };
  return fetch('https://api.rd.services/platform/conversions?api_key=' + RDS_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
