const fs = require('fs');
const path = require('path');

const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');

// Update Japanese version
const jaPath = path.join(__dirname, '../ja/index.md');
let jaContent = fs.readFileSync(jaPath, 'utf8');
jaContent = jaContent.replace(/\|最終更新\|.*\|/, `|最終更新|${today}|`);
fs.writeFileSync(jaPath, jaContent);

// Update English version
const enPath = path.join(__dirname, '../en/index.md');
let enContent = fs.readFileSync(enPath, 'utf8');
enContent = enContent.replace(/\|Last Updated\|.*\|/, `|Last Updated|${today}|`);
fs.writeFileSync(enPath, enContent);

console.log(`Updated date to ${today}`);