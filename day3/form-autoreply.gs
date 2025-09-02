function onFormSubmit(e) {

  Logger.log("受信");
  const res = e.namedValues; 
  // 例：res["メールアドレス"][0], res["お名前"][0], res["相談内容"][0], res["希望日"][0]
  const email = (res["メールアドレス"] || [""])[0].trim();
  const name = (res["名前"] || [""])[0].trim();
  const message = (res["相談内容"] || [""])[0].trim();
  const preferred = (res["希望日"] || [""])[0].trim();

  // ==== 1) 条件分岐 ====
  const weekday = getWeekday(preferred); // 日付→曜日（0=日,6=土）
  const hasNG = /見積のみ|営業|スパム/i.test(message);

  let subject = "お問い合わせありがとうございます";
  let body = "";
  let result = "OK";
  let reason = "";

  if (hasNG) {
    subject = "ご連絡ありがとうございます（ご案内）";
    body = `${name} 様

    大変恐縮ですが、内容より今回は対応の対象外と判断いたしました。
    もし別のご相談（具体的な要件・実装依頼 等）がありましたら、改めてご連絡ください。

    — 自動返信（GAS）`;
    result = "NG";
    reason = "NGワード";
  } else if (weekday === 0 || weekday === 6) {
    subject = "日程再調整のお願い";
    body = `${name} 様

    お問い合わせありがとうございます。
    ご希望日が週末のため、平日での再調整をお願いできますでしょうか。

    ご希望の候補日を2〜3つお知らせください。

    — 自動返信（GAS）`;
    reason = "週末希望";
  } else {
    body = `${name} 様

    お問い合わせありがとうございます。以下の内容で受け付けました。

    ■ 相談内容
    ${message}

    ■ ご希望日
    ${preferred}

    当方より追ってご連絡いたします。返信までしばらくお待ちください。

    — 自動返信（GAS）`;
  }

  let messageId = "";
  try {
    const sendRes = GmailApp.sendEmail(email, subject, body, { name: "GAS Bot" });
    // Apps Scriptの戻り値でMessage-Idは直接取れないが、スレッド検索で追う方法もある
    messageId = Utilities.getUuid(); // 代替のトラッキングIDを自前発行
    Logger.log("送信");
  } catch (err) {
    result = "ERROR";
    reason = String(err && err.message || err);
  }
  
  appendLog_({
    email, result, reason, preferred, name, message, messageId
  });
}

function getWeekday(dateStr) {
  Logger.log("getWeekday");
  const d = new Date(dateStr);
  const weekday =  isNaN(d.getTime()) ? -1 : d.getDay();
  Logger.log("weekday = " + weekday);
  return weekday;
}

function appendLog_(entry) {
  Logger.log("appendLog_");
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName("Log") || ss.insertSheet("Log");
  if (sh.getLastRow() === 0) {
    sh.appendRow(["timestamp","email","result","reason","preferred","name","message","messageId"]);
  }
  sh.appendRow([
    new Date(),
    entry.email,
    entry.result,
    entry.reason,
    entry.preferred,
    entry.name,
    entry.message,
    entry.messageId
  ]);
}