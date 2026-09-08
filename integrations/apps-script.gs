/**
 * AMS Digital — Lead logger para Google Sheets
 * ---------------------------------------------------------
 * Cole este código no Apps Script vinculado à planilha (veja README.md
 * para o passo a passo completo). Ele recebe o POST do formulário da
 * landing page e grava uma linha na aba "Leads".
 *
 * Não lida com nada sensível: só nome, whatsapp, serviço de interesse,
 * origem, campanha (UTM) e página — os mesmos campos que já aparecem
 * no formulário da própria página.
 */

var SHEET_NAME = "Leads";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Validação simples — evita gravar linhas vazias/lixo se a URL vazar.
    if (!data.nome || !data.whatsapp) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "campos obrigatorios ausentes" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getOrCreateSheet_();
    sheet.appendRow([
      new Date(),
      data.nome || "",
      data.whatsapp || "",
      data.servico || "",
      data.origem || "",
      data.campanha || "",
      data.pagina || "",
      "Novo"
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Data/Hora", "Nome", "WhatsApp", "Serviço", "Origem", "Campanha (UTM)", "Página", "Status"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
