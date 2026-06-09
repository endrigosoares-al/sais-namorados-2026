const HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Painel · Sais Namorados 2026</title>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
    :root {
      --bg: #060C1A;
      --surface: #0D1628;
      --border: rgba(193,161,92,.28);
      --gold: #C1A15C;
      --gold2: #D4BC80;
      --text: #FAFAF8;
      --muted: rgba(250,248,248,.55);
      --pago: #4CAF50;
      --cancel: #E74C3C;
    }
    body { background: var(--bg); color: var(--text); font-family: 'EB Garamond', Georgia, serif; min-height: 100vh }

    /* LOGIN */
    #login { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px }
    .login-card { border: 1px solid var(--border); padding: 48px 40px; max-width: 380px; width: 100%; background: var(--surface) }
    .login-logo { font-size: 13px; letter-spacing: .32em; text-transform: uppercase; color: var(--gold); font-family: sans-serif; margin-bottom: 32px }
    .login-title { font-size: 28px; font-style: italic; margin-bottom: 8px }
    .login-sub { font-size: 14px; color: var(--muted); font-family: sans-serif; letter-spacing: .1em; margin-bottom: 32px }
    .login-input { width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 12px 16px; font-size: 15px; font-family: inherit; outline: none; transition: border-color .2s }
    .login-input:focus { border-color: var(--gold) }
    .login-input.err { border-color: var(--cancel); box-shadow: 0 0 0 2px rgba(231,76,60,.18) }
    .pwd-wrap { position: relative }
    .pwd-wrap .login-input { padding-right: 48px }
    .pwd-eye { position: absolute; right: 4px; top: 50%; transform: translateY(-50%); background: transparent; border: 0; color: var(--gold); font-size: 18px; padding: 8px 12px; cursor: pointer; line-height: 1 }
    .pwd-eye:hover { color: var(--gold2) }
    .login-btn { width: 100%; margin-top: 16px; background: transparent; border: 1px solid var(--gold); color: var(--gold); padding: 12px; font-size: 13px; letter-spacing: .28em; text-transform: uppercase; font-family: sans-serif; cursor: pointer; transition: background .2s, color .2s }
    .login-btn:hover { background: var(--gold); color: var(--bg) }
    .login-error { color: var(--cancel); font-size: 13px; font-family: sans-serif; margin-top: 14px; padding: 10px 12px; border: 1px solid rgba(231,76,60,.4); background: rgba(231,76,60,.08); display: none; line-height: 1.5 }
    .login-error.show { display: block }
    .login-error b { color: #ff8a7a }

    /* DASHBOARD */
    #dash { display: none; padding: 32px 40px; max-width: 1400px; margin: 0 auto }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1px solid var(--border) }
    .header-title { font-size: 22px; font-style: italic }
    .header-sub { font-size: 12px; letter-spacing: .24em; text-transform: uppercase; color: var(--muted); font-family: sans-serif; margin-top: 4px }
    .logout-btn { background: none; border: 1px solid var(--border); color: var(--muted); padding: 8px 20px; font-size: 12px; letter-spacing: .2em; text-transform: uppercase; font-family: sans-serif; cursor: pointer; transition: all .2s }
    .logout-btn:hover { border-color: var(--gold); color: var(--gold) }

    /* CARDS */
    .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 36px }
    .card { background: var(--surface); border: 1px solid var(--border); padding: 24px 28px }
    .card-label { font-size: 11px; letter-spacing: .3em; text-transform: uppercase; color: var(--muted); font-family: sans-serif; margin-bottom: 10px }
    .card-value { font-size: 44px; font-style: italic; color: var(--gold2); line-height: 1 }
    .card-sub { font-size: 12px; color: var(--muted); font-family: sans-serif; margin-top: 6px; letter-spacing: .08em }

    /* HORÁRIOS */
    .section-title { font-size: 11px; letter-spacing: .3em; text-transform: uppercase; color: var(--gold); font-family: sans-serif; margin-bottom: 16px }
    .slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin-bottom: 36px }
    .slot { background: var(--surface); border: 1px solid var(--border); padding: 18px 20px }
    .slot-time { font-size: 22px; font-style: italic; color: var(--gold2); margin-bottom: 6px }
    .slot-info { font-size: 12px; color: var(--muted); font-family: sans-serif; letter-spacing: .08em }
    .slot-bar { height: 2px; background: rgba(193,161,92,.18); margin-top: 14px }
    .slot-bar-fill { height: 100%; background: var(--gold); transition: width .6s }

    /* FILTERS */
    .filters { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-bottom: 14px }
    .filter-select, .filter-input { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 9px 14px; font-size: 13px; font-family: sans-serif; outline: none; transition: border-color .2s }
    .filter-input { min-width: 260px; flex: 1 1 260px; max-width: 360px }
    .filter-select:focus, .filter-input:focus { border-color: var(--gold) }
    .filter-count { font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: var(--muted); font-family: sans-serif; margin-left: auto }

    /* TABLE */
    .refresh-row { display: flex; align-items: center; gap: 16px; margin-bottom: 16px }
    .refresh-btn { background: none; border: 1px solid var(--border); color: var(--muted); padding: 8px 20px; font-size: 11px; letter-spacing: .22em; text-transform: uppercase; font-family: sans-serif; cursor: pointer; transition: all .2s }
    .refresh-btn:hover { border-color: var(--gold); color: var(--gold) }
    .last-update { font-size: 12px; color: var(--muted); font-family: sans-serif }
    .table-wrap { overflow-x: auto; margin-bottom: 60px }
    table { width: 100%; border-collapse: collapse; font-size: 14px }
    thead th { background: var(--surface); color: var(--gold); font-family: sans-serif; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; font-weight: 400; padding: 12px 14px; text-align: left; border-bottom: 1px solid var(--border); white-space: nowrap }
    tbody tr { border-bottom: 1px solid rgba(193,161,92,.08) }
    tbody tr:hover { background: rgba(193,161,92,.04) }
    tbody td { padding: 11px 14px; color: rgba(250,248,248,.85); vertical-align: middle }
    .badge { display: inline-block; padding: 3px 12px; font-size: 10px; letter-spacing: .18em; text-transform: uppercase; font-family: sans-serif }
    .badge-reservado { border: 1px solid var(--gold); color: var(--gold) }
    .badge-pago { background: var(--pago); color: #fff }
    .badge-cancelado { background: var(--cancel); color: #fff }
    .status-btn { background: none; border: 1px solid var(--border); color: var(--muted); padding: 3px 10px; font-size: 10px; font-family: sans-serif; cursor: pointer; margin-left: 5px; letter-spacing: .1em; transition: all .15s; white-space: nowrap }
    .status-btn:hover { border-color: var(--gold); color: var(--gold) }

    @media (max-width: 960px) {
      #dash { padding: 20px 16px }
      .cards { grid-template-columns: repeat(2, 1fr) }
    }
    @media (max-width: 480px) {
      .cards { grid-template-columns: 1fr 1fr }
      .card-value { font-size: 32px }
      .header { flex-direction: column; align-items: flex-start; gap: 16px }
    }
  </style>
</head>
<body>

<div id="login">
  <div class="login-card">
    <p class="login-logo">Sais Beach Living Hotel</p>
    <h1 class="login-title">Painel Operacional</h1>
    <p class="login-sub">Dia dos Namorados 2026</p>
    <div class="pwd-wrap">
      <input id="pwd" class="login-input" type="password" placeholder="Senha de acesso" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" inputmode="text">
      <button type="button" class="pwd-eye" onclick="toggleEye()" aria-label="Mostrar senha">👁</button>
    </div>
    <button class="login-btn" onclick="doLogin()">Acessar</button>
    <div id="login-err" class="login-error">
      <b>Senha incorreta.</b><br>
      Digite exatamente <b>sais2026</b> (8 caracteres · tudo minúsculo · sem símbolos). Use o botão 👁 pra ver o que digitou.
    </div>
  </div>
</div>

<div id="dash">
  <div class="header">
    <div>
      <p class="header-title">Painel &middot; Uma Noite em Saint-Tropez</p>
      <p class="header-sub">Sais Beach Living Hotel &middot; 12 de Junho de 2026</p>
    </div>
    <button class="logout-btn" onclick="doLogout()">Sair</button>
  </div>

  <div class="cards">
    <div class="card">
      <p class="card-label">Reservas Ativas</p>
      <p class="card-value" id="c-reservas">—</p>
      <p class="card-sub" id="c-reservas-sub">&nbsp;</p>
    </div>
    <div class="card">
      <p class="card-label">Pessoas</p>
      <p class="card-value" id="c-pessoas">—</p>
      <p class="card-sub">convidados confirmados</p>
    </div>
    <div class="card">
      <p class="card-label">Receita Estimada</p>
      <p class="card-value" id="c-receita">—</p>
      <p class="card-sub">soma dos pedidos ativos</p>
    </div>
    <div class="card">
      <p class="card-label">Vagas Livres</p>
      <p class="card-value" id="c-vagas">—</p>
      <p class="card-sub">capacidade total: 100</p>
    </div>
  </div>

  <p class="section-title">Distribuição por Horário</p>
  <div id="slots" class="slots"></div>

  <div class="refresh-row">
    <button class="refresh-btn" onclick="loadData()">&#8635; Atualizar</button>
    <p class="last-update" id="last-update"></p>
  </div>

  <p class="section-title">Todas as Reservas</p>
  <div class="filters">
    <select id="f-status" class="filter-select">
      <option value="">Todos os status</option>
      <option value="reservado">Reservados</option>
      <option value="pago">Pagos</option>
      <option value="cancelado">Cancelados</option>
    </select>
    <input id="f-search" class="filter-input" type="search" placeholder="Buscar por nome, email ou celular" autocomplete="off">
    <span id="f-count" class="filter-count"></span>
  </div>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Celular</th>
          <th>Instagram</th>
          <th>Pax</th>
          <th>Horário</th>
          <th>Valor</th>
          <th>Status</th>
          <th>Data</th>
          <th>Origem</th>
        </tr>
      </thead>
      <tbody id="tbody"></tbody>
    </table>
  </div>
</div>

<script>
var SENHA = 'sais2026';
var CAPACIDADE = 100;
var lastData = [];

function doLogout() {
  document.getElementById('dash').style.display = 'none';
  document.getElementById('login').style.display = 'flex';
}

function moeda(v) {
  return 'R$ ' + Number(v || 0).toLocaleString('pt-BR');
}

function dataFmt(iso) {
  if (!iso) return '—';
  var d = new Date(iso);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
}

function badgeClass(s) {
  if (s === 'pago') return 'badge badge-pago';
  if (s === 'cancelado') return 'badge badge-cancelado';
  return 'badge badge-reservado';
}

function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function patchStatus(id, status, nome) {
  if (status === 'pago' && !confirm('Marcar como PAGO?\n\n' + (nome ? 'Reserva: ' + nome + '\n\n' : '') + 'Isso dispara o email de voucher e a conversão no RD Station — não dá pra desfazer.')) return;
  if (status === 'cancelado' && !confirm('Cancelar esta reserva?\n\n' + (nome ? 'Reserva: ' + nome : '') )) return;
  try {
    var res = await fetch('/painel-api?auth=' + SENHA, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: id, status: status})
    });
    if (res.ok && status === 'pago') {
      window.open('/voucher?id=' + id, '_blank');
    }
    loadData();
  } catch(e) {
    console.error('patch error', e);
  }
}

async function loadData() {
  try {
    var r = await fetch('/painel-api?auth=' + SENHA);
    if (r.status === 401) { doLogout(); return; }
    lastData = await r.json();
    renderDash();
    document.getElementById('last-update').textContent = 'Atualizado: ' + new Date().toLocaleTimeString('pt-BR');
  } catch(e) {
    document.getElementById('last-update').textContent = 'Erro ao carregar dados';
    console.error(e);
  }
}

function renderDash() {
  var data = lastData;
  var ativos = data.filter(function(r) { return r.status !== 'cancelado'; });
  var totalPessoas = ativos.reduce(function(s, r) { return s + (r.pessoas || 0); }, 0);
  var totalReceita = ativos.reduce(function(s, r) { return s + (r.valor || 0); }, 0);

  document.getElementById('c-reservas').textContent = ativos.length;
  document.getElementById('c-reservas-sub').textContent = data.length + ' total · ' + ativos.length + ' ativas';
  document.getElementById('c-pessoas').textContent = totalPessoas;
  document.getElementById('c-receita').textContent = moeda(totalReceita);
  document.getElementById('c-vagas').textContent = Math.max(0, CAPACIDADE - totalPessoas);

  var slotsMap = {};
  ativos.forEach(function(r) {
    var h = r.horario || 'Não informado';
    if (!slotsMap[h]) slotsMap[h] = {reservas: 0, pessoas: 0};
    slotsMap[h].reservas++;
    slotsMap[h].pessoas += (r.pessoas || 0);
  });

  var slotsHtml = '';
  var keys = Object.keys(slotsMap).sort();
  if (keys.length === 0) {
    slotsHtml = '<p style="color:var(--muted);font-family:sans-serif;font-size:13px;padding:8px 0">Nenhuma reserva ainda</p>';
  } else {
    keys.forEach(function(h) {
      var s = slotsMap[h];
      var pct = Math.min(100, Math.round(s.pessoas / CAPACIDADE * 100));
      slotsHtml += '<div class="slot">' +
        '<p class="slot-time">' + esc(h) + '</p>' +
        '<p class="slot-info">' + s.reservas + ' reservas &middot; ' + s.pessoas + ' pessoas</p>' +
        '<div class="slot-bar"><div class="slot-bar-fill" style="width:' + pct + '%"></div></div>' +
        '</div>';
    });
  }
  document.getElementById('slots').innerHTML = slotsHtml;

  var statusFilter = (document.getElementById('f-status').value || '').toLowerCase();
  var searchTerm = (document.getElementById('f-search').value || '').toLowerCase().trim();
  var filtered = data.filter(function(r) {
    if (statusFilter && (r.status || '').toLowerCase() !== statusFilter) return false;
    if (searchTerm) {
      var hay = ((r.nome||'') + ' ' + (r.email||'') + ' ' + (r.celular||'')).toLowerCase();
      if (hay.indexOf(searchTerm) === -1) return false;
    }
    return true;
  });
  var hasFilter = !!(statusFilter || searchTerm);
  document.getElementById('f-count').textContent =
    hasFilter ? (filtered.length + ' de ' + data.length) : (data.length + ' reservas');

  var rows = '';
  filtered.forEach(function(r, i) {
    var utm = [r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(' / ');
    var nameAttr = esc(r.nome || '');
    var btns = '';
    if (r.status !== 'pago') btns += '<button class="status-btn" data-id="' + esc(r.id) + '" data-st="pago" data-nome="' + nameAttr + '">Pago</button>';
    if (r.status !== 'cancelado') btns += '<button class="status-btn" data-id="' + esc(r.id) + '" data-st="cancelado" data-nome="' + nameAttr + '">Cancelar</button>';
    if (r.status !== 'reservado') btns += '<button class="status-btn" data-id="' + esc(r.id) + '" data-st="reservado" data-nome="' + nameAttr + '">Reservado</button>';
    rows += '<tr>' +
      '<td style="color:var(--muted);font-family:sans-serif;font-size:11px">' + (filtered.length - i) + '</td>' +
      '<td>' + esc(r.nome || '—') + '</td>' +
      '<td style="font-family:sans-serif;font-size:13px">' + esc(r.email) + '</td>' +
      '<td style="font-family:sans-serif;font-size:13px">' + esc(r.celular || '—') + '</td>' +
      '<td style="font-family:sans-serif;font-size:13px">' + esc(r.instagram || '—') + '</td>' +
      '<td style="text-align:center;font-family:sans-serif">' + (r.pessoas || '—') + '</td>' +
      '<td style="font-family:sans-serif;font-size:13px">' + esc(r.horario || '—') + '</td>' +
      '<td style="font-family:sans-serif;font-size:13px">' + (r.valor ? moeda(r.valor) : '—') + '</td>' +
      '<td><span class="' + badgeClass(r.status) + '">' + esc(r.status || '—') + '</span>' + btns + '</td>' +
      '<td style="font-family:sans-serif;font-size:11px;color:var(--muted);white-space:nowrap">' + dataFmt(r.timestamp) + '</td>' +
      '<td style="font-family:sans-serif;font-size:11px;color:var(--muted)">' + esc(utm || '—') + '</td>' +
      '</tr>';
  });
  var emptyMsg = hasFilter
    ? 'Nenhum resultado para o filtro · <a href="#" id="f-clear" style="color:var(--gold);text-decoration:underline">limpar filtros</a>'
    : 'Aguardando primeira reserva';
  document.getElementById('tbody').innerHTML = rows ||
    '<tr><td colspan="11" style="text-align:center;padding:48px;color:var(--muted);font-family:sans-serif;font-size:13px">' + emptyMsg + '</td></tr>';
}

document.getElementById('tbody').addEventListener('click', function(e) {
  var clear = e.target.closest('#f-clear');
  if (clear) {
    e.preventDefault();
    document.getElementById('f-status').value = '';
    document.getElementById('f-search').value = '';
    renderDash();
    return;
  }
  var btn = e.target.closest('.status-btn');
  if (!btn) return;
  patchStatus(btn.dataset.id, btn.dataset.st, btn.dataset.nome);
});

document.getElementById('f-status').addEventListener('change', renderDash);
document.getElementById('f-search').addEventListener('input', renderDash);

// LIBERADO 09/06 · acesso direto ao dashboard (gate de login removido) · mutações ainda exigem senha
sessionStorage.setItem('painel_ok', '1');
document.getElementById('login').style.display = 'none';
document.getElementById('dash').style.display = 'block';
loadData();
</script>
</body>
</html>`;

export async function onRequestGet() {
  return new Response(HTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
