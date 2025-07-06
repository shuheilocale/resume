const fs = require('fs');
const path = require('path');

// バックアップから元のMermaidブロックを復元する関数
function restoreMermaidInFile(filePath) {
  const backupPath = filePath + '.backup';
  
  if (!fs.existsSync(backupPath)) {
    console.error(`Backup file not found: ${backupPath}`);
    return;
  }
  
  // バックアップから復元
  fs.copyFileSync(backupPath, filePath);
  console.log(`✓ Restored ${filePath} from backup`);
  
  // バックアップファイルを削除（オプション）
  // fs.unlinkSync(backupPath);
}

// コマンドライン引数からファイルパスを取得
const args = process.argv.slice(2);

if (args.length === 0) {
  // デフォルトで日本語と英語の履歴書を復元
  const files = ['ja/index.md', 'en/index.md'];
  files.forEach(file => {
    if (fs.existsSync(file + '.backup')) {
      restoreMermaidInFile(file);
    }
  });
} else {
  // 指定されたファイルを復元
  args.forEach(file => {
    restoreMermaidInFile(file);
  });
}