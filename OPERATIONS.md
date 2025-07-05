# 職務経歴書リポジトリ運用ガイド

## 概要

このリポジトリは、GitHub Pagesを使用して職務経歴書を公開・管理するための自動化されたシステムです。日本語と英語の両方に対応し、PDF生成、品質チェック、バージョン管理が自動化されています。

## リポジトリ構成

```
resume/
├── index.html          # 言語選択ページ
├── ja/
│   └── index.md       # 日本語版職務経歴書
├── en/
│   └── index.md       # 英語版職務経歴書
├── .github/
│   ├── workflows/
│   │   └── ci.yml     # GitHub Actions設定
│   ├── spellcheck.yml # スペルチェック設定
│   └── wordlist.txt   # カスタム単語リスト
├── .markdownlint.json  # Markdownリンター設定
├── _config.yml         # Jekyll設定
└── OPERATIONS.md       # このファイル
```

## 主な機能

### 1. 自動PDF生成
- pushするたびに日本語版と英語版のPDFが自動生成されます
- 生成されたPDFは自動的にリリースとして公開されます
- ダウンロードURL: https://github.com/shuheilocale/resume/releases

### 2. 品質チェック
- **Markdownリンター**: フォーマットの一貫性をチェック
- **スペルチェック**: 英語のスペルミスを検出
- Pull Request時に自動実行

### 3. 自動更新
- 最終更新日が自動的に更新されます
- バージョンタグが日付形式（v20250104）で自動付与

### 4. 多言語対応
- 日本語: https://shuheilocale.github.io/resume/ja/
- 英語: https://shuheilocale.github.io/resume/en/

## 運用手順

### 職務経歴の更新

1. **日本語版の更新**
   ```bash
   # ja/index.mdを編集
   git add ja/index.md
   git commit -m "update: 新しい職歴を追加"
   git push
   ```

2. **英語版の更新**
   ```bash
   # en/index.mdを編集
   git add en/index.md
   git commit -m "update: add new work experience"
   git push
   ```

3. **両方同時に更新**
   ```bash
   # 両方のファイルを編集後
   git add ja/index.md en/index.md
   git commit -m "update: 職歴を更新 / update work experience"
   git push
   ```

### 新しいプロジェクトの追加

各言語のファイルで、該当するセクションに以下の形式で追加：

**日本語版 (ja/index.md)**:
```markdown
#### プロジェクト名（開始年月〜終了年月）
- **概要：** プロジェクトの説明
- **担当フェーズ：** 担当した工程
- **使用技術：** 使用した技術スタック
- **チーム規模・役割：** チーム人数、あなたの役割
```

**英語版 (en/index.md)**:
```markdown
#### Project Name (Start Date - End Date)
- **Overview:** Project description
- **Responsibilities:** Your responsibilities
- **Technologies:** Tech stack used
- **Team Size & Role:** Team size, your role
```

### スキルの更新

技術スタックセクションで、カテゴリごとに箇条書きで追加・削除します。

## GitHub Actions詳細

### ワークフロー構成

1. **lint**: コード品質チェック
   - Markdownフォーマットチェック
   - スペルチェック

2. **generate-pdf**: PDF生成
   - A4サイズ、ヘッダー・フッター付き
   - ページ番号表示

3. **update-metadata**: メタデータ更新
   - 最終更新日の自動更新
   - mainブランチへのpush時のみ実行

4. **release**: リリース作成
   - 日付ベースのタグ付け
   - PDFファイルの添付

### カスタマイズ

#### Markdownリンターのルール変更
`.markdownlint.json`を編集：
```json
{
  "MD013": false,  // 行の長さ制限を無効化
  "MD033": false   // インラインHTMLを許可
}
```

#### スペルチェックの単語追加
`.github/wordlist.txt`に単語を追加：
```
新しい技術名
会社名
```

## トラブルシューティング

### GitHub Pagesが更新されない
1. Settings > Pages でソースが正しく設定されているか確認
2. Actions タブでビルドエラーがないか確認
3. キャッシュクリア: ブラウザで Ctrl+F5

### PDFが生成されない
1. Actions タブでワークフローのログを確認
2. Markdownの構文エラーがないか確認
3. 特殊文字やエスケープが必要な文字がないか確認

### スペルチェックでエラー
1. 技術用語や固有名詞は`.github/wordlist.txt`に追加
2. 日本語部分は無視されるので英語部分のみチェック

## ベストプラクティス

1. **コミットメッセージ**
   - 日本語: `update: 職歴を更新`
   - 英語: `feat: add new certification`
   - 両方: `update: スキル追加 / add new skills`

2. **更新頻度**
   - 新しいプロジェクト完了時
   - 資格取得時
   - 年次での見直し

3. **プライバシー**
   - 機密情報は記載しない
   - 具体的な数値は公開可能な範囲で

4. **SEO対策**
   - キーワードを適切に配置
   - 技術スタックは検索されやすい正式名称で

## 今後の拡張案

1. **アナリティクス連携**
   - Google Analytics追加でアクセス解析
   - どの企業からアクセスがあったか把握

2. **テーマカスタマイズ**
   - ダークモード対応
   - 印刷用CSS最適化

3. **API連携**
   - LinkedIn自動同期
   - Wantedly API連携

4. **通知システム**
   - 更新時のSlack通知
   - アクセス急増時のアラート

5. **A/Bテスト**
   - 異なるフォーマットの効果測定
   - コンバージョン率の分析

## お問い合わせ

質問や提案がある場合は、Issuesまたは直接連絡してください。