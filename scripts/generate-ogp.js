const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateOGP() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // OGP画像生成対象
    const pages = [
      { 
        name: 'default', 
        title: '山本 修平 - 職務経歴書',
        subtitle: 'Software Engineer / ML Engineer',
        description: '15年以上の開発経験を持つフルスタックエンジニア'
      },
      { 
        name: 'ja', 
        title: '山本 修平 - 職務経歴書',
        subtitle: 'ソフトウェアエンジニア / 機械学習エンジニア',
        description: '画像処理・機械学習・深層学習を活用したプロダクト開発'
      },
      { 
        name: 'en', 
        title: 'Shuhei Yamamoto - Resume',
        subtitle: 'Software Engineer / ML Engineer',
        description: 'Full-stack engineer with 15+ years of experience'
      }
    ];

    for (const pageInfo of pages) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 630 });

      // OGP画像のHTML
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              padding: 0;
              width: 1200px;
              height: 630px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              width: 90%;
              height: 80%;
              background: rgba(255, 255, 255, 0.95);
              border-radius: 20px;
              padding: 60px;
              box-sizing: border-box;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            h1 {
              font-size: 48px;
              margin: 0 0 20px 0;
              color: #333;
              font-weight: 700;
            }
            h2 {
              font-size: 32px;
              margin: 0 0 30px 0;
              color: #666;
              font-weight: 400;
            }
            p {
              font-size: 24px;
              margin: 0;
              color: #888;
              line-height: 1.6;
            }
            .footer {
              position: absolute;
              bottom: 30px;
              right: 40px;
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .badge {
              background: rgba(102, 126, 234, 0.1);
              color: #667eea;
              padding: 8px 20px;
              border-radius: 20px;
              font-size: 18px;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${pageInfo.title}</h1>
            <h2>${pageInfo.subtitle}</h2>
            <p>${pageInfo.description}</p>
          </div>
          <div class="footer">
            <span class="badge">GitHub Pages</span>
            <span class="badge">Portfolio</span>
          </div>
        </body>
        </html>
      `;

      await page.setContent(html);
      
      // スクリーンショットを保存
      const outputPath = path.join(__dirname, '..', 'assets', 'ogp', `${pageInfo.name}.png`);
      await page.screenshot({ path: outputPath });
      console.log(`Generated OGP image: ${outputPath}`);

      await page.close();
    }
  } finally {
    await browser.close();
  }
}

// assetsディレクトリが存在しない場合は作成
const assetsDir = path.join(__dirname, '..', 'assets', 'ogp');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 実行
generateOGP().catch(console.error);