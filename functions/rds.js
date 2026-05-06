export async function onRequestPost(context) {
  const d = await context.request.json().catch(() => ({}));
  if (!d.email) return new Response('no email', { status: 200 });

  const log = {};

  // Grava reserva no KV para o painel operacional
  try {
    const kv = context.env.RESERVAS;
    if (kv) {
      const lista = (await kv.get('reservas', 'json')) || [];
      lista.push({
        id:           crypto.randomUUID(),
        nome:         d.nome            || '',
        email:        d.email,
        celular:      d.celular         || '',
        instagram:    d.cf_instagram    || '',
        pessoas:      parseInt(d.cf_pessoas)    || 2,
        horario:      d.cf_horario      || '',
        valor:        parseInt(d.cf_valor_total) || 0,
        status:       'reservado',
        timestamp:    new Date().toISOString(),
        utm_source:   d.traffic_source   || '',
        utm_medium:   d.traffic_medium   || '',
        utm_campaign: d.traffic_campaign || '',
      });
      await kv.put('reservas', JSON.stringify(lista));
      log.kv = 'saved';
    }
  } catch (e) {
    log.kvError = e.message;
  }

  // 1. Tenta API legada (token público)
  try {
    const body = new URLSearchParams({
      token_rdstation:  '8600b85d04d88f1318a3d23fe793a344',
      identificador:    'reserva-namorados-2026',
      email:            d.email,
      nome:             d.nome            || '',
      celular:          d.celular         || '',
      cf_instagram:     d.cf_instagram    || '',
      cf_pessoas:       d.cf_pessoas      || '',
      cf_horario:       d.cf_horario      || '',
      cf_valor_total:   d.cf_valor_total  || '',
      traffic_source:   d.traffic_source  || '',
      traffic_medium:   d.traffic_medium  || '',
      traffic_campaign: d.traffic_campaign|| '',
      traffic_term:     d.traffic_term    || ''
    });
    const r1 = await fetch('https://www.rdstation.com.br/api/1.2.1/conversions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    log.legacy = { status: r1.status, body: await r1.text() };
    if (r1.ok) return new Response(JSON.stringify(log), { status: 200 });
  } catch (e) {
    log.legacyError = e.message;
  }

  // 2. Fallback: Platform API (token privado como Bearer)
  try {
    const payload = {
      event_type: 'CONVERSION',
      event_family: 'CDP',
      payload: {
        conversion_identifier: 'reserva-namorados-2026',
        tags:            ['reserva-namorados-2026'],
        name:            d.nome            || '',
        email:           d.email,
        mobile_phone:    d.celular         || '',
        cf_instagram:    d.cf_instagram    || '',
        cf_pessoas:      d.cf_pessoas      || '',
        cf_horario:      d.cf_horario      || '',
        cf_valor_total:  d.cf_valor_total  || '',
        traffic_source:  d.traffic_source  || '',
        traffic_medium:  d.traffic_medium  || '',
        traffic_campaign:d.traffic_campaign|| '',
        traffic_term:    d.traffic_term    || ''
      }
    };
    const r2 = await fetch('https://api.rd.services/platform/conversions?api_key=ZjYlPgOOuAATeDCrdiOcbSTVowlXHcbewjgk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    log.platform = { status: r2.status, body: await r2.text() };
  } catch (e) {
    log.platformError = e.message;
  }

  return new Response(JSON.stringify(log), { status: 200 });
}
