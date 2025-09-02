# Day3 - Googleフォーム自動返信スクリプト

Googleフォームで受け付けた内容に応じて、自動で返信メールを送信するApps Scriptです。  
希望日や相談内容に応じて返信テンプレートを切り替え、実行ログもスプレッドシートに保存します。

---

## 📌 主な機能

- Googleフォーム送信時に自動メール返信（Gmail）
- 入力内容に応じた**条件分岐付きの返信処理**
  - NGワードが含まれていれば、お断りテンプレで返信
  - 土日希望であれば、日程再調整のテンプレで返信
  - 上記以外は通常受付のテンプレートで返信
- 「Log」シートに処理ログを保存（成功/失敗、理由など）

---

## ⚙️ 使用方法

1. 以下の項目でGoogleフォームを作成：
   - メールアドレス
   - お名前
   - 相談内容
   - 希望日（形式：2025/09/04 など）

2. フォームの回答先スプレッドシートにこのスクリプトを貼り付ける  
   → `form-autoreply.gs`

3. トリガーを設定（エディタ上で）  
   - 実行関数：`onFormSubmit`  
   - イベントの種類：**フォーム送信時**

4. テスト送信後、メールとログを確認

---

## 🛑 条件分岐の仕様

| 条件 | 動作内容 |
|------|----------|
| 相談内容に「見積のみ」「営業」などが含まれる | お断りメールを返信 |
| 希望日が土日（曜日判定） | 平日への再調整依頼メールを返信 |
| それ以外 | 通常の受付完了メールを返信 |

---

## 🧪 ログ出力内容（Logシート）

| 項目名 | 説明 |
|--------|------|
| timestamp | 実行時刻 |
| email | 宛先メールアドレス |
| result | OK / NG / ERROR |
| reason | 条件に該当した理由 |
| messageId | 通信識別用のID（UUID） |

---
## 📚 参考リンク

- [GmailApp.sendEmail (公式)](https://developers.google.com/apps-script/reference/gmail/gmail-app#sendemailrecipient,-subject,-body,-options)
- [Google Apps Script: トリガーの使い方](https://developers.google.com/apps-script/guides/triggers)