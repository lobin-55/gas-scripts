function listAllFilesRecursivelyReturn() {
  const folderId = "1nG3S9nzMIr46Qw8-2EcOstgO96TXrBdo";
  const root = DriveApp.getFolderById(folderId);
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getActiveSheet();
  sh.clear();

  const rows = collectRowsRecursively_(root, "");
  if (rows.length === 0) {
    sh.getRange(1,1,1,1).setValue("No files.");
    return;
  }
  sh.getRange(1,1,1,6).setValues([["ファイル名","パス","更新日","MimeType","ID","URL"]]);
  sh.getRange(2,1,rows.length,rows[0].length).setValues(rows);
}

function collectRowsRecursively_(folder, path) {
  const currentPath = (path ? path : "") + "/" + folder.getName();
  const rows = [];

  const files = folder.getFiles();
  while (files.hasNext()) {
    const f = files.next();
    rows.push([
      f.getName(),
      currentPath,
      f.getLastUpdated(),
      f.getMimeType(),
      f.getId(),
      f.getUrl()
    ]);
  }

  const subs = folder.getFolders();
  while (subs.hasNext()) {
    const sub = subs.next();
    const childRows = collectRowsRecursively_(sub, currentPath);
    if (childRows.length) rows.push.apply(rows, childRows);
  }

  return rows;
}