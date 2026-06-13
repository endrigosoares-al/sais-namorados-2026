export async function onRequestPost(context) {
  const d = await context.request.json().catch(() => ({}));
  if (!d.email) return new Response(JSON.stringify({ error: 'no email' }), { status: 400 });

  const log = {};

  try {
    const kv = context.env.RESERVAS;
    if (kv) {
      const lista = (await kv.get('lista-espera-2027', 'json')) || [];
      lista.push({
        id:        crypto.randomUUID(),
        email:     d.email,
        source:    d.source || 'pos-evento-2026',
        timestamp: new Date().toISOString(),
        ua:        context.request.headers.get('user-agent') || ''
      });
      await kv.put('lista-espera-2027', JSON.stringify(lista));
      log.kv = 'saved';
    }
  } catch (e) {
    log.kvError = e.message;
  }

  try {
    const body = new URLSearchParams({
      token_rdstation:  '8600b85d04d88f1318a3d23fe793a344',
      identificador:    'lista-espera-namorados-2027',
      email:            d.email,
      tags:             'lista-espera-2027,pos-evento-2026',
      traffic_source:   d.traffic_source   || '',
      traffic_medium:   d.traffic_medium   || '',
      traffic_campaign: d.traffic_campaign || ''
    });
    const r1 = await fetch('https://www.rdstation.com.br/api/1.2.1/conversions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    log.legacy = { status: r1.status };
    if (r1.ok) return new Response(JSON.stringify(log), { status: 200 });
  } catch (e) {
    log.legacyError = e.message;
  }

  try {
    const payload = {
      event_type: 'CONVERSION',
      event_family: 'CDP',
      payload: {
        conversion_identifier: 'lista-espera-namorados-2027',
        tags:  ['lista-espera-2027', 'pos-evento-2026'],
        email: d.email
      }
    };
    const r2 = await fetch('https://api.rd.services/platform/conversions?api_key=ZjYlPgOOuAATeDCrdiOcbSTVowlXHcbewjgk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    log.platform = { status: r2.status };
  } catch (e) {
    log.platformError = e.message;
  }

  return new Response(JSON.stringify(log), { status: 200 });
}
