function doGet(e) {
  var sheetName = (e && e.parameter && e.parameter.sheet) || "Pivot";
  var sheetId = "YOUR_GOOGLE_SHEET_ID";
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Sheet not found", sheet: sheetName }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var values = sheet.getDataRange().getDisplayValues();
  if (!values.length) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = values.shift();
  var result = values
    .filter(function(row) {
      return row.some(function(cell) { return cell !== ""; });
    })
    .map(function(row) {
      var obj = {};
      headers.forEach(function(header, index) {
        obj[header || ("column_" + index)] = row[index];
      });
      return obj;
    });

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
