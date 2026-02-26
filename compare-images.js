import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read files
const viPath = path.join(__dirname, 'src', 'data', 'medicineData.js');
const enPath = path.join(__dirname, 'src', 'data', 'medicineData.en.js');

const viContent = fs.readFileSync(viPath, 'utf8');
const enContent = fs.readFileSync(enPath, 'utf8');

// Extract medicines array using regex
function extractMedicines(content) {
  const medicines = new Map();
  
  // Match each object starting with id: and ending with },
  const pattern = /{\s*id:\s*(\d+),\s*name:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"/g;
  
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const id = match[1];
    const name = match[2];
    const image = match[3];
    medicines.set(id, { name, image });
  }
  
  return medicines;
}

const viMedicines = extractMedicines(viContent);
const enMedicines = extractMedicines(enContent);

console.log(`\n=== PHÂN TÍCH ===`);
console.log(`Số lượng trong VI: ${viMedicines.size}`);
console.log(`Số lượng trong EN: ${enMedicines.size}`);

// Compare
const differences = [];

for (const [id, viData] of viMedicines) {
  if (enMedicines.has(id)) {
    const enData = enMedicines.get(id);
    if (viData.image !== enData.image) {
      differences.push({
        id,
        name: viData.name,
        viImage: viData.image,
        enImage: enData.image
      });
    }
  }
}

console.log(`\n=== KẾT QUẢ ===`);
console.log(`Tổng số ID có URL ảnh khác nhau: ${differences.length}\n`);

// Save to file
const output = differences.map(diff => {
  return `ID ${diff.id}: ${diff.name}\n- URL VI (đúng): ${diff.viImage}\n- URL EN (sai):  ${diff.enImage}\n`;
}).join('\n');

fs.writeFileSync('image-differences.txt', output, 'utf8');

// Also create a summary with just IDs
const summary = `=== TẤT CẢ ${differences.length} ID CÓ URL ẢNH KHÁC NHAU ===\n\n` +
  differences.map(d => `ID ${d.id}: ${d.name}`).join('\n');
  
fs.writeFileSync('image-differences-summary.txt', summary, 'utf8');

console.log('✓ Đã lưu chi tiết vào: image-differences.txt');
console.log('✓ Đã lưu tóm tắt vào: image-differences-summary.txt');
console.log('\nDanh sách các ID:');
console.log(differences.map(d => `ID ${d.id}: ${d.name}`).join('\n'));
