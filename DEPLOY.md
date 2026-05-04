# Deploy: namorados.saishotel.com.br

Pasta publicável da landing page de Dia dos Namorados 2026.

## Arquivos

- `index.html`: landing page final.
- `assets/`: somente os assets usados pela página.
- `assets/hero-namorados-web.mp4`: vídeo da hero comprimido para web.

## Subdomínio recomendado

`namorados.saishotel.com.br`

## Opção A — cPanel/servidor do site

1. Criar o subdomínio `namorados`.
2. Definir o document root do subdomínio para esta pasta publicada.
3. Subir todo o conteúdo de `deploy/namorados/`.
4. Ativar SSL/HTTPS para o subdomínio.

## Opção B — hospedagem estática externa

1. Subir todo o conteúdo de `deploy/namorados/` na hospedagem.
2. No DNS de `saishotel.com.br`, criar um `CNAME`:
   - Nome: `namorados`
   - Valor: host fornecido pela plataforma de deploy
3. Ativar SSL/HTTPS na plataforma.

## Antes de mídia paga

- Instalar Google Tag Manager, GA4, Meta Pixel e Google Ads.
- Criar eventos: `ViewContent`, `Lead`, `InitiateCheckout`, `Purchase`.
- Conectar o botão de pagamento ao gateway SafraPay.
- Configurar RD Station para capturar nome, e-mail, telefone, instagram, pessoas, horário, valor e origem UTM.
