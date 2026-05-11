const fs = require('fs');

const filePath = 'c:\\Users\\hp\\kishan22\\src\\lib\\seed.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Regex to extract MOCK_PRODUCTS array content
const match = content.match(/export const MOCK_PRODUCTS = (\[[\s\S]*?\]);/);

if (match) {
    const productsStr = match[1];
    
    // We can't safely JSON.parse because it's a JS object literal, 
    // but we can do a simple split and reconstruct
    const blocks = productsStr.split('},').map(b => b.trim() + (b.endsWith('}') ? '' : '}'));
    if (blocks[blocks.length-1] === '}]}') blocks[blocks.length-1] = blocks[blocks.length-1].slice(0, -2); // fix last one
    
    const uniqueProducts = [];
    const seenImages = new Set();
    const seenNames = new Set();
    
    // Items to specifically remove based on user's image
    const blacklistedImages = [
        'https://images.unsplash.com/photo-1585664811087-47f65abbad64'
    ];
    const blacklistedNames = [
        'Trichoderma Viride Bio-Fungicide',
        'Organic Garlic-Pepper Bio-Pesticide',
        'Organic Pearl Millet (Bajra)'
    ];

    blocks.forEach(block => {
        const nameMatch = block.match(/name:\s*['"](.*?)['"]/);
        const imageMatch = block.match(/image:\s*['"](.*?)['"]/);
        
        if (nameMatch && imageMatch) {
            const name = nameMatch[1];
            const imageUrl = imageMatch[1];
            const baseUrl = imageUrl.split('?')[0];

            if (blacklistedNames.includes(name)) return;
            if (blacklistedImages.some(b => imageUrl.includes(b))) return;
            
            if (!seenImages.has(baseUrl) && !seenNames.has(name)) {
                seenImages.add(baseUrl);
                seenNames.add(name);
                uniqueProducts.push(block);
            }
        }
    });

    const newContent = content.replace(match[1], '[\n  ' + uniqueProducts.join(',\n  ') + '\n]');
    fs.writeFileSync(filePath, newContent);
    console.log('Cleaned up MOCK_PRODUCTS. Kept ' + uniqueProducts.length + ' unique items.');
} else {
    console.log('MOCK_PRODUCTS not found');
}
