# LP AMS Digital — guia de configuração e publicação

Página estática (`index.html` + `css/styles.css` + `js/`), sem framework, sem build step. Mesmo padrão de arquitetura do projeto [CrisYoga](https://github.com/andersonsales2903-sys/crisyoga-lp), publicada no Cloudflare Pages.

Referência do plano completo (posicionamento, copy, design, CRO): painel no Notion — "Painel de Construção — LP Institucional AMS Digital".

## Estrutura

```
index.html
css/styles.css
js/config.js        → toda configuração fica aqui (nome, WhatsApp, integrações, tracking)
js/main.js          → UTM, tracking, cards "dois caminhos", formulário → WhatsApp
integrations/apps-script.gs → cole no Google Apps Script (passo 2 abaixo)
_headers             → cabeçalhos de segurança lidos automaticamente pelo Cloudflare Pages
assets/logo/         → colocar aqui o logo real (hoje a página usa um wordmark tipográfico)
```

## 1. Configurar WhatsApp e ligar/desligar tracking

Tudo fica no topo de `js/config.js`:

```js
window.AMS_CONFIG = {
  BRAND_NAME: "AMS Digital",
  WHATSAPP_NUMBER: "5500000000000",  // TROCAR pelo número real antes de publicar
  SHEET_WEBHOOK_URL: "",             // cole aqui a URL do Apps Script (passo 2)
  GA4_MEASUREMENT_ID: "",
  META_PIXEL_ID: "",
  INSTAGRAM_URL: "",
  LINKEDIN_URL: ""
};
```

Enquanto `SHEET_WEBHOOK_URL`, `GA4_MEASUREMENT_ID` e `META_PIXEL_ID` estiverem vazios, a página funciona normalmente — só não grava na planilha nem dispara eventos (sem erro no console).

## 2. Configurar a captura de lead no Google Sheets (~5 min)

Precisa ser feito manualmente uma vez, na conta Google dona da planilha — a publicação de um Apps Script como "Web App" exige autorização no navegador, não dá pra automatizar por API.

1. Crie uma Google Sheet nova (ex: "AMS Digital - Leads").
2. Menu **Extensões → Apps Script**.
3. Apague o código de exemplo e cole o conteúdo de `integrations/apps-script.gs`.
4. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**.
   - Executar como: **Eu**.
   - Quem pode acessar: **Qualquer pessoa**.
5. Autorize as permissões pedidas.
6. Copie a **URL do app da Web** gerada (termina em `/exec`).
7. Cole essa URL em `SHEET_WEBHOOK_URL` no `js/config.js`.

A aba "Leads" é criada automaticamente no primeiro envio, com as colunas: Data/Hora, Nome, WhatsApp, Serviço, Origem, Campanha (UTM), Página, Status.

## 3. Tracking (GA4 / Meta Pixel)

Eventos já implementados em `js/main.js`:

| Evento | Quando dispara | Parâmetros |
|---|---|---|
| `cta_click` | Clique em qualquer botão de CTA (nav, hero, cards, WhatsApp flutuante, form) | `local` |
| `form_submit` | Envio do formulário | `servico`, `origem`, `campanha` |
| `whatsapp_click` | No momento do redirecionamento pro WhatsApp | `origem` |

A matriz de eventos final e os IDs reais ficam a cargo do item 7 do painel (Tracking). Assim que tiver os IDs, é só colar em `GA4_MEASUREMENT_ID` e `META_PIXEL_ID`.

## 4. Publicar no Cloudflare Pages

1. Suba este repositório no GitHub (branch principal).
2. No Cloudflare Pages, crie um novo projeto **"Connect to Git"** apontando pro repositório.
3. Build command: nenhum (deixar vazio). Output directory: `/` (raiz).
4. Deploy. O arquivo `_headers` na raiz já aplica cabeçalhos básicos de segurança automaticamente — não precisa configurar nada extra no Cloudflare pra isso.

## 5. Pendências antes de considerar a LP "pronta" (ver itens 6–10 do painel)

- [x] Trocar `WHATSAPP_NUMBER` pelo número real da AMS Digital em `js/config.js`.
- [ ] Configurar `SHEET_WEBHOOK_URL` (passo 2 acima) — item 6 do painel (Integrações).
- [ ] IDs de GA4 e Meta Pixel — item 7 do painel (Tracking).
- [x] Texto de consentimento e nota de privacidade revisados pela Gigi (item 8 do painel — LGPD): finalidade, prazo de retenção (12 meses) e canal de exclusão via WhatsApp já estão no ar. **Ainda pendente, feito por você (não é código):** garantir que a planilha de leads do Google Sheets fique com compartilhamento restrito (nunca "qualquer pessoa com o link"), e de fato excluir/arquivar leads sem contato depois de 12 meses.
- [ ] Metadata (title/description finais), Open Graph com imagem e dados estruturados — item 9 do painel (SEO).
- [ ] Logo real da AMS em `assets/logo/` (hoje a página usa um wordmark tipográfico + inicial "A" em círculo dourado, porque ainda não há um arquivo de logo em PNG/SVG anexado a este repositório).
- [ ] Logos reais dos clientes na seção "Do simples ao completo" (CrisYoga, Método Controle Consciente, Vivência Ser Mulher, Encontro e Meditação para Mulheres, Entre Lobas, Studio Simone Santos) — não consegui buscar essas imagens automaticamente (ambiente sem acesso à internet aberta). Me manda os arquivos de logo (ou os links diretos das imagens) que eu subo em `assets/clients/` e troco o texto pelo logo.
- [ ] QA mobile real (não só redimensionar o navegador) + Playwright antes de publicar — item 10 do painel (Deploy).
