const fs = require('fs');
const content = fs.readFileSync('src/data/medicineData.en.js', 'utf-8');

// Get all used categoryIds
const usedMatches = content.match(/categoryId:\s*["']([^"']+)["']/g) || [];
const used = new Set();
usedMatches.forEach(m => {
  const match = m.match(/categoryId:\s*["']([^"']+)["']/);
  if (match) used.add(match[1]);
});

// Get all family category IDs  
const familyMatches = content.match(/{\s*id:\s*["']([a-z]+aceae)["']/g) || [];
const allFamilies = new Set();
familyMatches.forEach(m => {
  const match = m.match(/id:\s*["']([a-z]+aceae)["']/);
  if (match) allFamilies.add(match[1]);
});

// Find unused
const unused = Array.from(allFamilies).filter(f => !used.has(f)).sort();

console.log('Used families:', used.size);
console.log('Total families:', allFamilies.size);
console.log('Unused families:', unused.length);
console.log('');
console.log('Families to remove:');
unused.forEach(f => console.log(f));
