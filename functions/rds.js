export async function onRequestPost(context) {
  try {
    const d = await context.request.json();
    if (!d.email) return new Response(null, { status: 200 });

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

    await fetch('https://www.rdstation.com.br/api/1.2.1/conversions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
  } catch (_) {}

  return new Response(null, { status: 200 });
}
