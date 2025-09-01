function day2Function() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const START_ROW = 2;
  const lastRow = sheet.getLastRow();
  if (lastRow < START_ROW) return;

  const numRows = lastRow - START_ROW + 1;
  const lastCol = sheet.getLastColumn();
  const values = sheet.getRange(START_ROW, 1, numRows, 1).getValues(); // A列のみ

  for (let i = 0; i < values.length; i++) {
    for (let x = i + 1; x < values.length; x++) {
      const a = values[i][0];
      const b = values[x][0];
      if (a === b && a !== "") {
        const rowI = START_ROW + i;
        const rowX = START_ROW + x;
        sheet.getRange(rowI, 1, 1, lastCol).setBackground("#fff8dc");
        sheet.getRange(rowX, 1, 1, lastCol).setBackground("#fff8dc");
      }
    }
  }
}

// 改良版
function day2FunctionFast() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const START_ROW = 2;
  const lastRow = sheet.getLastRow();
  if (lastRow < START_ROW) return;

  const numRows = lastRow - START_ROW + 1;
  const lastCol = sheet.getLastColumn();
  const values = sheet.getRange(START_ROW, 1, numRows, 1).getValues();

  const countMap = new Map();
  for (let i = 0; i < values.length; i++) {
    const key = String(values[i][0] ?? "");
    if (!key) continue; // 空セルは除外
    countMap.set(key, (countMap.get(key) || 0) + 1);
  }

  const backgrounds = sheet.getRange(START_ROW, 1, numRows, lastCol).getBackgrounds();
  Logger.log(backgrounds)

  for (let i = 0; i < values.length; i++) {
    const key = String(values[i][0] ?? "");
    if (key && countMap.get(key) >= 2) {
      for (let c = 0; c < lastCol; c++) {
        backgrounds[i][c] = "#fff8dc";
      }
    } else {
      // 必要なら既存の色をクリア
      // for (let c = 0; c < lastCol; c++) backgrounds[i][c] = null;
    }
  }

  sheet.getRange(START_ROW, 1, numRows, lastCol).setBackgrounds(backgrounds);
}
