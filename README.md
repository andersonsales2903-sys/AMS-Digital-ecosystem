# AMS Digital — guia de configuração e publicação

Site institucional estático (`index.html` + `crm-studios/` + `css/` + `js/`), sem framework, sem build step, publicado no Cloudflare Pages. Fonte de verdade do projeto: `CLAUDE.md` nesta mesma pasta — se este README divergir dele, vale o `CLAUDE.md`.

Branch de trabalho: `refacao-institucional`. A `main` é a versão antiga (LP simples), ainda no ar em digitalams.com.br — não fazer push nela até o Anderson aprovar a troca.

## Estrutura

```
index.html                    → home: hero, 6 serviços, galeria de modelos, clientes, como funciona, FAQ, formulário
crm-studios/index.html        → tour do CRM (réplica HTML com dados fictícios), noindex
crm-studios/style.css         → estilos específicos do tour (sidebar, cards, chat simulado)
crm-studios/tour.js           → troca de aba, chamada, Pix de exemplo, chat do Atendente IA
css/styles.css                → design system compartilhado (cores, tipografia, componentes da home)
js/config.js                  → toda configuração fica aqui (nome, WhatsApp, integrações, tracking)
js/main.js                    → UTM, tracking, painéis de serviço, galeria, formulário → WhatsApp
integrations/apps-script.gs   → cole no Google Apps Script (passo 2 abaixo)
assets/logo/                  → logo da AMS (símbolo + frase "Estratégia, conversão e crescimento")
assets/clients/               → logos dos clientes usados na galeria de modelos
scripts/edit_logo.py          → script que gerou o logo atual a partir do original com "MKT DIGITAL"
```

## 1. Configurar WhatsApp e ligar/desligar tracking

Tudo fica no topo de `js/config.js`:

```js
window.AMS_CONFIG = {
  BRAND_NAME: "AMS Digital",
  WHATSAPP_NUMBER: "5511963144061",
  SHEET_WEBHOOK_URL: "",             // cole aqui a URL do Apps Script (passo 2)
  GA4_MEASUREMENT_ID: "",
  META_PIXEL_ID: "",
  INSTAGRAM_URL: "",
  LINKEDIN_URL: ""
};
```

Enquanto `SHEET_WEBHOOK_URL`, `GA4_MEASUREMENT_ID` e `META_PIXEL_ID` estiverem vazios, o site funciona normalmente — só não grava na planilha nem dispara eventos (sem erro no console).

## 2. Configurar a captura de lead no Google Sheets (~5 min)

Precisa ser feito manualmente uma vez, na conta Google dona da planilha. Publicar um Apps Script como "Web App" exige autorização no navegador, não dá pra automatizar por API.

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

**Importante:** deixe o compartilhamento da planilha restrito (nunca "qualquer pessoa com o link pode editar"). É a forma mais simples de evitar vazamento dos dados de contato.

## 3. Tracking (GA4 / Meta Pixel)

Eventos já implementados:

| Evento | Quando dispara | Onde | Parâmetros |
|---|---|---|---|
| `cta_click` | Clique em qualquer botão com `data-cta` | home e tour | `local` |
| `servico_card_click` | Clique no resumo de um card de serviço | home | `servico` |
| `painel_abertura` | O painel do serviço abre (não dispara ao fechar) | home | `servico` |
| `modelo_ampliar` | Abertura do modal de um modelo na galeria | home | `modelo` |
| `demo_tab_switch` | Troca de aba no tour do CRM | `/crm-studios` | `aba` |
| `form_submit` | Envio do formulário | home | `servico`, `origem`, `campanha` |
| `whatsapp_click` | Redirecionamento pro WhatsApp | home e tour | `origem` |

Assim que tiver os IDs reais de GA4/Meta Pixel, é só colar em `GA4_MEASUREMENT_ID` e `META_PIXEL_ID` — os eventos acima já disparam para os dois automaticamente.

## 4. Publicar no Cloudflare Pages

1. Confirme que está publicando a branch `refacao-institucional`, não a `main`.
2. No Cloudflare Pages, o projeto já existe e gera uma prévia por branch — valide nessa prévia antes de qualquer promoção pra produção.
3. Build command: nenhum (deixar vazio). Output directory: `/` (raiz).
4. O arquivo `_headers` na raiz já aplica cabeçalhos básicos de segurança automaticamente.

## 5. Pendências abertas (ver `CLAUDE.md` para o texto completo)

- [ ] Serviço prestado e link do cliente **Orthoprime** — hoje sinalizado como provisório no card de clientes e precisa da confirmação do Anderson.
- [ ] Decisão sobre **plano de manutenção** de sites e landing pages (sim ou não) — hoje sinalizado como "em definição" no FAQ.
- [ ] **Capturas reais do CRM**: o tour em `/crm-studios` usa réplica HTML com dados fictícios (Ana Souza, Bruno Lima, Carla Dias, Diego Reis). Quando o MVP (`crm-studio-simone-santos`) estiver pronto, trocar pelas capturas reais.
- [ ] **Screenshots reais** dos 6 modelos na galeria: hoje cada card mostra o logo do cliente dentro da moldura, como espera enquanto não há captura de tela real da página. Substituir em `index.html`, dentro de `.device-frame__placeholder`.
- [ ] Logo de **"Encontro e Meditação para Mulheres"** ainda não enviada — o card usa o ícone abstrato de útero como provisório.
- [ ] IDs de GA4 e Meta Pixel.
- [ ] QA mobile real (não só redimensionar o navegador) antes de promover a branch pra `main`.
