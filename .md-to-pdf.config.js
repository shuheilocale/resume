module.exports = {
  css: `
    body {
      font-family: "Noto Sans CJK JP", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
      line-height: 1.7;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: "Noto Sans CJK JP", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
      font-weight: bold;
    }
    
    code, pre {
      font-family: "Consolas", "Monaco", "Courier New", monospace;
    }
    
    /* テーブルのスタイル改善 */
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 15px 0;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    
    /* リストのスタイル */
    ul, ol {
      margin-left: 20px;
      margin-bottom: 10px;
    }
    
    /* 改ページの制御 */
    h2 {
      page-break-before: auto;
      page-break-after: avoid;
    }
    
    h3, h4 {
      page-break-after: avoid;
    }
    
    /* リンクの色 */
    a {
      color: #0366d6;
      text-decoration: none;
    }
    
    /* バッジのスタイル */
    img[alt*="badge"] {
      vertical-align: middle;
      margin: 0 2px;
    }
  `,
  // PDF生成時の追加オプション
  pdf_options: {
    format: 'A4',
    margin: {
      top: '25mm',
      right: '25mm',
      bottom: '25mm',
      left: '25mm'
    },
    displayHeaderFooter: true,
    printBackground: true,
    preferCSSPageSize: false
  },
  // Puppeteerの起動オプション（GitHub Actions対応）
  launch_options: {
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
  }
};