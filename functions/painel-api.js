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

  // Legacy API — cria o identificador no dropdown de automações do RD
  const body = new URLSearchParams({
    token_rdstation:  '8600b85d04d88f1318a3d23fe793a344',
    identificador:    'pagamento-confirmado-namorados-2026',
    email:            r.email,
    nome:             r.nome           || '',
    celular:          r.celular        || '',
    cf_horario:       r.horario        || '',
    cf_pessoas:       String(r.pessoas || ''),
    cf_valor_total:   String(r.valor   || ''),
    cf_voucher_url:   voucherUrl,
  });
  const r1 = fetch('https://www.rdstation.com.br/api/1.2.1/conversions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  // Platform API — enriquece o contato com tags e campo voucher
  const payload = {
    event_type: 'CONVERSION',
    event_family: 'CDP',
    payload: {
      conversion_identifier: 'pagamento-confirmado-namorados-2026',
      tags: ['pago', 'namorados-2026'],
      name:           r.nome    || '',
      email:          r.email,
      mobile_phone:   r.celular || '',
      cf_horario:     r.horario || '',
      cf_pessoas:     String(r.pessoas || ''),
      cf_valor_total: String(r.valor   || ''),
      cf_voucher_url: voucherUrl,
    }
  };
  const r2 = fetch('https://api.rd.services/platform/conversions?api_key=' + RDS_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return Promise.all([r1, r2]);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
