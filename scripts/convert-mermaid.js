const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Mermaidブロックを見つける正規表現
const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;

// Puppeteer設定ファイルを作成（GitHub Actions対応）
function createPuppeteerConfig() {
  const configPath = '/tmp/puppeteer-config.json';
  const config = {
    "args": ["--no-sandbox", "--disable-setuid-sandbox"]
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return configPath;
}

// ファイルを処理する関数
function processMermaidInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modifiedContent = content;
  let matches = [];
  let match;
  let index = 0;
  
  // Puppeteer設定ファイルを作成
  createPuppeteerConfig();

  // Mermaidブロックを検索
  while ((match = mermaidRegex.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      mermaidContent: match[1],
      index: index++
    });
  }

  if (matches.length === 0) {
    console.log(`No mermaid blocks found in ${filePath}`);
    return;
  }

  console.log(`Found ${matches.length} mermaid blocks in ${filePath}`);

  // 画像ディレクトリを作成
  const baseName = path.basename(filePath, path.extname(filePath));
  const dirName = path.dirname(filePath);
  const imgDir = path.join(dirName, 'images', 'mermaid');
  
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
  }

  // 各Mermaidブロックを処理
  matches.forEach((item, idx) => {
    const mmdFile = path.join(imgDir, `${baseName}-diagram-${idx}.mmd`);
    const svgFile = path.join(imgDir, `${baseName}-diagram-${idx}.svg`);
    const pngFile = path.join(imgDir, `${baseName}-diagram-${idx}.png`);
    
    // Mermaidファイルを作成
    fs.writeFileSync(mmdFile, item.mermaidContent);
    
    try {
      // SVGに変換（GitHub Actions用に--no-sandboxを追加）
      execSync(`npx -y @mermaid-js/mermaid-cli@latest -i "${mmdFile}" -o "${svgFile}" -t default -b transparent -p /tmp/puppeteer-config.json`, {
        stdio: 'inherit'
      });
      
      // PNGにも変換（PDFでの互換性のため）
      execSync(`npx -y @mermaid-js/mermaid-cli@latest -i "${mmdFile}" -o "${pngFile}" -t default -b white -w 1200 -H 800 -p /tmp/puppeteer-config.json`, {
        stdio: 'inherit'
      });
      
      console.log(`✓ Generated ${svgFile} and ${pngFile}`);
      
      // MarkdownでMermaidブロックを画像に置換
      const relativeSvgPath = path.relative(dirName, svgFile).replace(/\\/g, '/');
      const relativePngPath = path.relative(dirName, pngFile).replace(/\\/g, '/');
      
      // HTMLとMarkdownの両方に対応した画像タグ
      const imageReplacement = `<!-- Mermaid diagram ${idx} -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="${relativeSvgPath}">
  <img src="${relativePngPath}" alt="Diagram ${idx}" style="max-width: 100%; height: auto;">
</picture>`;
      
      modifiedContent = modifiedContent.replace(item.fullMatch, imageReplacement);
      
    } catch (error) {
      console.error(`Error processing mermaid block ${idx}: ${error.message}`);
    }
  });

  // 元のファイルをバックアップ
  const backupPath = filePath + '.backup';
  fs.copyFileSync(filePath, backupPath);
  
  // 変更されたコンテンツを書き込み
  fs.writeFileSync(filePath, modifiedContent);
  console.log(`✓ Updated ${filePath} with image references`);
  console.log(`✓ Backup saved to ${backupPath}`);
}

// コマンドライン引数からファイルパスを取得
const args = process.argv.slice(2);

if (args.length === 0) {
  // デフォルトで日本語と英語の履歴書を処理
  const files = ['ja/index.md', 'en/index.md'];
  files.forEach(file => {
    if (fs.existsSync(file)) {
      processMermaidInFile(file);
    }
  });
} else {
  // 指定されたファイルを処理
  args.forEach(file => {
    if (fs.existsSync(file)) {
      processMermaidInFile(file);
    } else {
      console.error(`File not found: ${file}`);
    }
  });
}