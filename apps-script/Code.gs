/**
 * Приёмник результатов квеста «Тайна Королевства Вердан»
 * Вставьте этот код в Apps Script вашей Google-таблицы
 * (Расширения → Apps Script), затем разверните как веб-приложение.
 *
 * ВАЖНО при развёртывании:
 *  - Execute as: Me (Я)
 *  - Who has access: Anyone (Все) — не «Anyone with Google account»
 *  - После любых правок: Развернуть → Управление развёртываниями → ✏️ → Новая версия
 */

var TOKEN = 'verdania-2026'; // должен совпадать со значением CONFIG.TOKEN в app.js

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'Пустой запрос' });
    }

    var data = JSON.parse(e.postData.contents);
    if (data.token !== TOKEN) {
      return json({ ok: false, error: 'Неверный ключ' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      return json({
        ok: false,
        error: 'Скрипт не привязан к таблице. Откройте его через Расширения → Apps Script.'
      });
    }

    var sheet = ss.getSheetByName('Результаты') || ss.getSheets()[0];
    ensureHeader(sheet);

    var ts = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'dd.MM.yyyy HH:mm:ss');

    var row = [
      ts,
      String(data.name || '').slice(0, 100),
      String(data.group || '').slice(0, 30),
      Number(data.score) || 0,
      Number(data.maxScore) || 0,
      String(data.time || '').slice(0, 20),
      Number(data.seconds) || 0
    ];

    // Защита от гонок при одновременной отправке несколькими студентами
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true });
  } catch (err) {
    // Полный стек попадёт в «Выполнения» Apps Script — удобно для диагностики
    console.error(err && err.stack ? err.stack : String(err));
    return json({ ok: false, error: (err && err.message) || String(err) });
  }
}

function doGet() {
  return json({
    ok: true,
    info: 'Приёмник результатов квеста работает',
    tokenConfigured: !!(TOKEN && TOKEN.length > 0)
  });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Дата и время', 'ФИО', 'Группа', 'Балл', 'Максимум', 'Время (мм:сс)', 'Время (сек)']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#e7d3a9');
    sheet.setFrozenRows(1);
  }
}