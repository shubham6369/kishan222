const fs = require('fs');

const content = fs.readFileSync('c:\\Users\\hp\\kishan22\\src\\lib\\seed.ts', 'utf8');
const match = content.match(/export const MOCK_PRODUCTS = (\[[\s\S]*?\]);/);

if (match) {
    try {
        // We can't easily eval because it's TS and has external refs, 
        // but we can parse the string if it's simple enough or just regex for pairs
        const pairs = [];
        const regex = /name:\s*['"](.*?)['"][\s\S]*?image:\s*['"](.*?)['"]/g;
        let m;
        while ((m = regex.exec(match[1])) !== null) {
            pairs.push({ name: m[1], image: m[2] });
        }
        
        const counts = {};
        pairs.forEach(p => {
            const key = `${p.name}|${p.image}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        
        const duplicates = Object.entries(counts).filter(([k, v]) => v > 1);
        console.log('Duplicates found:', duplicates);
    } catch (e) {
        console.error('Error parsing MOCK_PRODUCTS:', e);
    }
} else {
    console.log('MOCK_PRODUCTS not found');
}
