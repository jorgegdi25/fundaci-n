// Separate Apps Script web app in a foundation-owned spreadsheet.
// Script Properties: DONATION_SHEET_ID, DONATION_SHEET_NAME,
// DONATION_SHEETS_SECRET (32+ random characters). Confirm headers before activation.
// Store only payment events supplied by the authenticated server, never PSP
// payloads, payment credentials, card numbers, passwords or personal access links.
function doPost(event) {
  const output = value => ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
  const lock = LockService.getScriptLock();
  try {
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty('DONATION_SHEETS_SECRET');
    const id = properties.getProperty('DONATION_SHEET_ID');
    const tab = properties.getProperty('DONATION_SHEET_NAME');
    if (!secret || secret.length < 32 || !id || !tab || !event.postData || event.postData.contents.length > 5000) return output({ok:false});
    const body = JSON.parse(event.postData.contents);
    if (body.secret !== secret || typeof body.eventId !== 'string' || !/^(wompi|paypal)\/[A-Za-z0-9_-]{1,120}$/.test(body.eventId) || body.status !== 'approved' || body.environment !== 'sandbox' || !['wompi','paypal'].includes(body.provider) || typeof body.reference !== 'string' || body.eventId !== body.provider+'/'+body.reference || !Number.isSafeInteger(body.amountMinor) || body.amountMinor <= 0 || body.amountMinor > 10000000000 || !['COP','USD','EUR'].includes(body.currency) || (body.provider === 'wompi') !== (body.currency === 'COP') || !['once','monthly'].includes(body.frequency) || !['general','el-cairo','sierra-nevada','amazonas','mhuysqa'].includes(body.cause) || !['es','en'].includes(body.lang) || typeof body.occurredAt !== 'string' || !Number.isFinite(Date.parse(body.occurredAt)) || (body.email !== null && (typeof body.email !== 'string' || body.email.length > 254 || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(body.email)))) return output({ok:false});
    lock.waitLock(10000);
    const sheet = SpreadsheetApp.openById(id).getSheetByName(tab);
    if (!sheet) return output({ok:false});
    const expected = ['ID evento','Fecha pago','Pasarela','Referencia','Valor','Moneda','Frecuencia','Proyecto','Correo','Idioma','Entorno','Estado pago','Estado SARLAFT'];
    const existing = sheet.getRange(1,1,1,expected.length).getValues()[0];
    if (existing.some((v,i) => v !== expected[i])) return output({ok:false});
    if (sheet.getLastRow() > 1 && sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(body.eventId).matchEntireCell(true).findNext()) return output({ok:true,duplicate:true});
    const safe = value => /^[\s]*[=+\-@]/.test(String(value)) ? "'"+value : String(value);
    sheet.appendRow([body.eventId,body.occurredAt,body.provider,body.reference,body.amountMinor/100,body.currency,body.frequency,body.cause,safe(body.email || ''),body.lang,body.environment,'Aprobado en Sandbox','Sin conciliar']);
    return output({ok:true});
  } catch (_) { return output({ok:false}); }
  finally { if (lock.hasLock()) lock.releaseLock(); }
}
