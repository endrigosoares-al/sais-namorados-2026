export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return notFound();

  const kv = env.RESERVAS;
  if (!kv) return new Response('Serviço indisponível', { status: 503 });

  const lista = (await kv.get('reservas', 'json')) || [];
  const r = lista.find(x => x.id === id);
  if (!r) return notFound();

  return new Response(buildHtml(r), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function notFound() {
  return new Response('Voucher não encontrado', { status: 404 });
}

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function moeda(v) {
  return 'R$ ' + Number(v || 0).toLocaleString('pt-BR');
}

function fmtData(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function buildHtml(r) {
  const num = r.id.slice(-8).toUpperCase();
  const nome = esc(r.nome || 'Não informado');
  const horario = esc(r.horario || 'A confirmar');
  const pessoas = r.pessoas || 2;
  const valor = moeda(r.valor);
  const email = esc(r.email || '');
  const celular = esc(r.celular || '');
  const confirmadoEm = fmtData(r.pago_em || r.timestamp);
  const plural = pessoas > 1 ? 's' : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Voucher N° ${num} · Sais Namorados 2026</title>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet">
  <style>
    @media print {
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .no-print { display: none !important; }
      body { background: #060C1A !important; padding: 0 !important; }
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
    body {
      background: #0D1628;
      font-family: 'EB Garamond', Georgia, serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px 60px;
      color: #FAFAF8;
    }
    .toolbar {
      width: 100%;
      max-width: 680px;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }
    .btn-pdf {
      background: transparent;
      border: 1px solid #C1A15C;
      color: #C1A15C;
      padding: 11px 28px;
      font-size: 11px;
      letter-spacing: .28em;
      text-transform: uppercase;
      font-family: sans-serif;
      cursor: pointer;
      transition: all .2s;
    }
    .btn-pdf:hover { background: #C1A15C; color: #060C1A; }

    /* CARD */
    .card {
      background: #060C1A;
      width: 100%;
      max-width: 680px;
      border: 1px solid rgba(193,161,92,.35);
      position: relative;
      overflow: hidden;
    }

    /* HERO */
    .hero {
      padding: 48px 56px 40px;
      border-bottom: 1px solid rgba(193,161,92,.2);
      position: relative;
    }
    .hero::after {
      content: '';
      position: absolute;
      top: 0; right: 0;
      width: 240px; height: 240px;
      background: radial-gradient(circle at top right, rgba(193,161,92,.07), transparent 65%);
      pointer-events: none;
    }
    .hero-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
    }
    .hotel-name {
      font-family: sans-serif;
      font-size: 11px;
      letter-spacing: .36em;
      text-transform: uppercase;
      color: #C1A15C;
    }
    .voucher-id-block { text-align: right; }
    .voucher-label {
      font-family: sans-serif;
      font-size: 10px;
      letter-spacing: .28em;
      text-transform: uppercase;
      color: rgba(193,161,92,.7);
      border: 1px solid rgba(193,161,92,.3);
      padding: 5px 14px;
      display: inline-block;
    }
    .voucher-num {
      font-family: sans-serif;
      font-size: 10px;
      letter-spacing: .18em;
      color: rgba(250,248,248,.3);
      margin-top: 6px;
    }
    .kicker {
      font-family: sans-serif;
      font-size: 11px;
      letter-spacing: .3em;
      text-transform: uppercase;
      color: rgba(193,161,92,.7);
      margin-bottom: 12px;
    }
    .event-title {
      font-size: 56px;
      font-style: italic;
      font-weight: 500;
      line-height: .9;
      color: #FAFAF8;
      margin-bottom: 22px;
    }
    .event-title span {
      background: linear-gradient(135deg,#B68F43 0%,#F4D894 42%,#C1A15C 70%,#8A6E3A 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .gold-line { width: 48px; height: 1px; background: linear-gradient(90deg,#C1A15C,transparent); margin-bottom: 16px; }
    .event-meta {
      font-family: sans-serif;
      font-size: 12px;
      letter-spacing: .2em;
      text-transform: uppercase;
      color: rgba(250,248,248,.45);
    }

    /* DATA */
    .data-section {
      padding: 36px 56px;
      border-bottom: 1px solid rgba(193,161,92,.15);
    }
    .data-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px 48px;
    }
    .data-full { grid-column: 1 / -1; }
    .d-label {
      font-family: sans-serif;
      font-size: 10px;
      letter-spacing: .28em;
      text-transform: uppercase;
      color: rgba(193,161,92,.65);
      margin-bottom: 7px;
    }
    .d-value {
      font-size: 24px;
      font-style: italic;
      color: #FAFAF8;
      line-height: 1.1;
    }
    .d-value.mono {
      font-size: 15px;
      font-style: normal;
      font-family: sans-serif;
      letter-spacing: .04em;
      color: rgba(250,248,248,.75);
    }

    /* STATUS BAR */
    .status-bar {
      padding: 18px 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(193,161,92,.12);
      background: rgba(76,175,80,.06);
    }
    .pago-badge {
      background: #4CAF50;
      color: #fff;
      font-family: sans-serif;
      font-size: 10px;
      letter-spacing: .26em;
      text-transform: uppercase;
      padding: 6px 18px;
    }
    .confirmed-date {
      font-family: sans-serif;
      font-size: 11px;
      color: rgba(250,248,248,.35);
      letter-spacing: .08em;
    }

    /* FOOTER */
    .card-footer {
      padding: 20px 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .footer-hotel {
      font-family: sans-serif;
      font-size: 10px;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: rgba(250,248,248,.25);
    }
    .footer-id {
      font-family: sans-serif;
      font-size: 10px;
      color: rgba(250,248,248,.18);
      letter-spacing: .1em;
    }

    /* corner decoration */
    .deco-corner {
      position: absolute;
      bottom: 0; right: 0;
      width: 80px; height: 80px;
      border-top: 1px solid rgba(193,161,92,.15);
      border-left: 1px solid rgba(193,161,92,.15);
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div class="toolbar no-print">
    <button class="btn-pdf" onclick="window.print()">Baixar / Imprimir PDF</button>
  </div>

  <div class="card">
    <div class="hero">
      <div class="hero-top">
        <p class="hotel-name">Sais Beach Living Hotel</p>
        <div class="voucher-id-block">
          <span class="voucher-label">Voucher de Reserva</span>
          <p class="voucher-num">N° ${num}</p>
        </div>
      </div>
      <p class="kicker">Jantar Degustação · Dia dos Namorados</p>
      <h1 class="event-title">Uma Noite em<br><span>Saint-Tropez</span></h1>
      <div class="gold-line"></div>
      <p class="event-meta">12 de Junho de 2026 &nbsp;·&nbsp; Maceió, Alagoas</p>
    </div>

    <div class="data-section">
      <div class="data-grid">
        <div>
          <p class="d-label">Titular</p>
          <p class="d-value">${nome}</p>
        </div>
        <div>
          <p class="d-label">Horário</p>
          <p class="d-value">${horario}</p>
        </div>
        <div>
          <p class="d-label">Convidados</p>
          <p class="d-value">${pessoas} pessoa${plural}</p>
        </div>
        <div>
          <p class="d-label">Valor pago</p>
          <p class="d-value">${valor}</p>
        </div>
        ${email ? `<div class="data-full">
          <p class="d-label">E-mail</p>
          <p class="d-value mono">${email}</p>
        </div>` : ''}
        ${celular ? `<div>
          <p class="d-label">Celular</p>
          <p class="d-value mono">${celular}</p>
        </div>` : ''}
      </div>
    </div>

    <div class="status-bar">
      <span class="pago-badge">&#10003; Pagamento Confirmado</span>
      ${confirmadoEm ? `<p class="confirmed-date">Confirmado em ${confirmadoEm}</p>` : ''}
    </div>

    <div class="card-footer">
      <p class="footer-hotel">Sais Beach Living Hotel &nbsp;·&nbsp; Jatiúca Beach &nbsp;·&nbsp; Maceió — AL</p>
      <p class="footer-id">ID ${num}</p>
    </div>
    <div class="deco-corner"></div>
  </div>
</body>
</html>`;
}
