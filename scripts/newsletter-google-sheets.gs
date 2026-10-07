// Install in the client-owned Google Sheet's Apps Script project.
// Script Properties: COMMUNITY_SHEETS_SECRET (at least 32 random characters)
// and COMMUNITY_SHEET_NAME (the existing destination tab, after confirming columns).
// Deploy as Web App, execute as owner. The server-only secret authenticates writes.
// Destination supplied by the client in AJUSTES A HOME, p. 7.
const COMMUNITY_SHEET_ID = '19qpJmxDqWfGlSzM8oC5jfct6iBuse5lJkOmPOgtv32c';
function doPost(event) {
  const output = value => ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
  const lock = LockService.getScriptLock();
  try {
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty('COMMUNITY_SHEETS_SECRET');
    const tabName = properties.getProperty('COMMUNITY_SHEET_NAME');
    const body = JSON.parse(event.postData.contents);
    if (!secret || secret.length < 32 || !tabName || body.secret !== secret || body.consent !== true || body.consentVersion !== 'home-2026-10-06' || !['es','en'].includes(body.lang) || !['footer','donate'].includes(body.source) || !['email','whatsapp'].includes(body.channel) || typeof body.contact !== 'string' || body.contact.length > 254 || typeof body.name !== 'string' || body.name.length > 100 || typeof body.id !== 'string' || !/^[\da-f-]{36}$/.test(body.id)) return output({ok:false});
    lock.waitLock(10000);
    const sheet = SpreadsheetApp.openById(COMMUNITY_SHEET_ID).getSheetByName(tabName);
    if (!sheet) return output({ok:false});
    // Confirm this header mapping before activation; never overwrite a client template.
    const expected = ['ID','Fecha','Nombre','Contacto','Canal','Idioma','Origen','Consentimiento','Versión del consentimiento'];
    const existing = sheet.getRange(1,1,1,expected.length).getValues()[0];
    if (existing.some((v,i)=>v !== expected[i])) return output({ok:false});
    const safe = value => /^[=+\-@]/.test(String(value)) ? "'"+value : String(value);
    sheet.appendRow([body.id,new Date().toISOString(),safe(body.name),safe(body.contact),body.channel,body.lang,body.source,'Sí',body.consentVersion]);
    return output({ok:true});
  } catch (_) { return output({ok:false}); }
  finally { if (lock.hasLock()) lock.releaseLock(); }
}
