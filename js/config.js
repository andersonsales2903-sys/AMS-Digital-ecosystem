/**
 * AMS Digital — configuração central
 * ------------------------------------------------------------
 * Tudo que muda por ambiente/cliente fica aqui. Nome, número de
 * WhatsApp e integrações nunca ficam espalhados pelo HTML/CSS/JS
 * (mesmo padrão do projeto CrisYoga) — assim renomear a marca ou
 * trocar de planilha não exige tocar em mais nenhum arquivo.
 */
window.AMS_CONFIG = {
  // Nome exibido no header, footer e nas mensagens pré-preenchidas do WhatsApp.
  BRAND_NAME: "AMS Digital",

  // TODO(Anderson): número real da AMS em formato internacional, sem espaços/símbolos.
  // Ex: "5511999999999". Enquanto for o placeholder abaixo, o botão funciona mas
  // abre um número inválido — troque antes de publicar.
  WHATSAPP_NUMBER: "5500000000000",

  // Cole aqui a URL do Google Apps Script (Web App) depois de publicado.
  // Ver integrations/apps-script.gs e README.md, seção "Integração com Google Sheets".
  // Enquanto vazia, o formulário funciona normalmente e só pula o log na planilha.
  SHEET_WEBHOOK_URL: "",

  // Preencher quando o item 7 do painel (Tracking) definir os IDs reais.
  // Enquanto vazios, o tracking simplesmente não dispara (sem erro no console).
  GA4_MEASUREMENT_ID: "",
  META_PIXEL_ID: "",

  // Redes sociais da AMS. Enquanto vazio, o ícone correspondente não aparece no rodapé.
  INSTAGRAM_URL: "",
  LINKEDIN_URL: ""
};
