const SENHA       = 'sais@2026';
const RDS_API_KEY = 'ZjYlPgOOuAATeDCrdiOcbSTVowlXHcbewjgk';
const RESEND_KEY  = 're_CBLL7vdE_FqJpLJbijn7ojRbPt41Adxd5';
const FROM_EMAIL  = 'Sais Beach Living Hotel <onboarding@resend.dev>';

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
      const origin = url.origin;
      sendVoucherEmail(data[i], origin).catch(() => {});
      fireRdsPago(data[i], origin).catch(() => {});
    }

    return json({ ok: true });
  }

  return new Response('Method Not Allowed', { status: 405 });
}

// ── Resend ──────────────────────────────────────────────────────────────────

async function sendVoucherEmail(r, origin) {
  const voucherUrl = origin + '/voucher?id=' + r.id;
  const num        = r.id.slice(-8).toUpperCase();
  const nome       = r.nome    || 'Cliente';
  const primeiroNome = nome.split(' ')[0];
  const horario    = r.horario || 'A confirmar';
  const pessoas    = r.pessoas || 2;
  const valor      = 'R$ ' + Number(r.valor || 0).toLocaleString('pt-BR');
  const plural     = pessoas > 1 ? 's' : '';

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="pt-BR">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Sua reserva está confirmada</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
body{margin:0!important;padding:0!important;background-color:#060C1A}
@media only screen and (max-width:520px){
  .ew{width:100%!important}
  .ph{padding:24px 20px!important}
  .pb{padding:24px 20px!important}
  .pi{padding:16px 18px!important}
  .tl{font-size:26px!important}
  .ch{display:block!important;width:100%!important;padding-bottom:12px!important}
}
</style>
</head>
<body style="margin:0;padding:0;background-color:#060C1A;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#060C1A;">Sua noite em Saint-Tropez est&aacute; confirmada. Acesse seu voucher exclusivo.&#847;&zwnj;&nbsp;</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#060C1A" style="background-color:#060C1A;">
<tr><td align="center" style="padding:20px 10px 36px;">
<table class="ew" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;border-collapse:collapse;">

<!-- HEADER -->
<tr><td class="ph" bgcolor="#060C1A" style="background-color:#060C1A;padding:30px 38px 26px;border-top:1px solid #2A2010;border-left:1px solid #2A2010;border-right:1px solid #2A2010;">
  <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:.32em;text-transform:uppercase;color:#C1A15C;">SAIS BEACH LIVING HOTEL</p>
  <p style="margin:0 0 9px;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#6A5025;">JANTAR DEGUSTA&Ccedil;&Atilde;O &middot; DIA DOS NAMORADOS</p>
  <p class="tl" style="margin:0;font-family:'EB Garamond',Georgia,serif;font-size:32px;font-style:italic;font-weight:500;line-height:.95;color:#FAFAF8;">Uma Noite em</p>
  <p class="tl" style="margin:0 0 15px;font-family:'EB Garamond',Georgia,serif;font-size:32px;font-style:italic;font-weight:500;line-height:.95;color:#D4BC80;">Saint-Tropez</p>
  <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr>
    <td width="36" height="1" bgcolor="#C1A15C" style="background-color:#C1A15C;font-size:1px;line-height:1px;">&nbsp;</td>
    <td width="140" height="1" bgcolor="#1A1508" style="background-color:#1A1508;font-size:1px;line-height:1px;">&nbsp;</td>
  </tr></table>
  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#3E3020;">12 DE JUNHO DE 2026 &nbsp;&middot;&nbsp; MACEI&Oacute;, ALAGOAS</p>
</td></tr>

<!-- BODY -->
<tr><td class="pb" bgcolor="#0D1628" style="background-color:#0D1628;padding:30px 38px;border-left:1px solid #2A2010;border-right:1px solid #2A2010;">
  <p style="margin:0 0 4px;font-family:'EB Garamond',Georgia,serif;font-size:20px;font-style:italic;color:#FAFAF8;">Ol&aacute;, ${escHtml(primeiroNome)},</p>
  <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.75;color:#7A8EA0;">Sua reserva est&aacute; confirmada e sua noite em Saint-Tropez est&aacute; garantida.<br>Prepare-se para uma experi&ecirc;ncia inesquec&iacute;vel &agrave; beira-mar.</p>

  <!-- Details -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;border:1px solid #1E2010;">
  <tr><td class="pi" bgcolor="#060C1A" style="background-color:#060C1A;padding:20px 24px;">
    <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:8px;letter-spacing:.28em;text-transform:uppercase;color:#6A5025;">HOR&Aacute;RIO</p>
    <p style="margin:0 0 16px;font-family:'EB Garamond',Georgia,serif;font-size:17px;font-style:italic;color:#FAFAF8;">${escHtml(horario)}</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;"><tr><td height="1" bgcolor="#1C2535" style="background-color:#1C2535;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;"><tr>
      <td class="ch" width="50%" valign="top" style="padding-right:10px;">
        <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:8px;letter-spacing:.28em;text-transform:uppercase;color:#6A5025;">CONVIDADOS</p>
        <p style="margin:0;font-family:'EB Garamond',Georgia,serif;font-size:17px;font-style:italic;color:#FAFAF8;">${pessoas} pessoa${plural}</p>
      </td>
      <td class="ch" width="50%" valign="top">
        <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:8px;letter-spacing:.28em;text-transform:uppercase;color:#6A5025;">VALOR PAGO</p>
        <p style="margin:0;font-family:'EB Garamond',Georgia,serif;font-size:17px;font-style:italic;color:#FAFAF8;">${valor}</p>
      </td>
    </tr></table>
    <table cellpadding="0" cellspacing="0" border="0"><tr>
      <td bgcolor="#2D6E30" style="background-color:#2D6E30;padding:5px 12px;">
        <span style="font-family:Arial,Helvetica,sans-serif;font-size:8px;letter-spacing:.22em;text-transform:uppercase;color:#7FD882;">&#10003;&nbsp; PAGAMENTO CONFIRMADO</span>
      </td>
    </tr></table>
  </td></tr></table>

  <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.8;color:#7A8EA0;">Seu voucher exclusivo est&aacute; dispon&iacute;vel abaixo. Apresente-o na entrada do evento &mdash; ele &eacute; seu passaporte para uma noite &agrave; beira-mar com a elegan&ccedil;a de Saint-Tropez.</p>

  <!-- CTA -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr><td align="center">
    <table cellpadding="0" cellspacing="0" border="0"><tr>
      <td bgcolor="#060C1A" style="background-color:#060C1A;border:1px solid #C1A15C;">
        <a href="${voucherUrl}" target="_blank" style="display:inline-block;padding:12px 38px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#C1A15C;text-decoration:none;white-space:nowrap;">ACESSAR MEU VOUCHER</a>
      </td>
    </tr></table>
  </td></tr></table>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;"><tr><td height="1" bgcolor="#1C2535" style="background-color:#1C2535;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>
  <p style="margin:0 0 4px;font-family:'EB Garamond',Georgia,serif;font-size:16px;font-style:italic;color:#FAFAF8;">At&eacute; breve,</p>
  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#3E3020;">Equipe Sais Beach Living Hotel</p>
</td></tr>

<!-- FOOTER -->
<tr><td bgcolor="#060C1A" align="center" style="background-color:#060C1A;padding:17px 38px;border-bottom:1px solid #2A2010;border-left:1px solid #2A2010;border-right:1px solid #2A2010;">
  <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:#2A2010;">SAIS BEACH LIVING HOTEL &nbsp;&middot;&nbsp; JATI&Uacute;CA BEACH &nbsp;&middot;&nbsp; MACEI&Oacute; &mdash; AL</p>
  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:8px;color:#222010;">namorados.saishotel.com.br &nbsp;&middot;&nbsp; Voucher N&deg; ${num}</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`;

  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + RESEND_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:    FROM_EMAIL,
      to:      [r.email],
      subject: 'Sua reserva está confirmada — Uma Noite em Saint-Tropez',
      html:    html,
    }),
  });
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── RD Station (mantido para enriquecimento de contato) ─────────────────────

async function fireRdsPago(r, origin) {
  const voucherUrl = origin + '/voucher?id=' + r.id;

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

  const payload = {
    event_type: 'CONVERSION', event_family: 'CDP',
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

// ── helpers ──────────────────────────────────────────────────────────────────

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
