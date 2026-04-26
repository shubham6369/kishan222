import fs from 'fs';

function checkTags(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const openTags = (content.match(/<[a-zA-Z0-9]+/g) || []).length;
    const closeTags = (content.match(/<\/[a-zA-Z0-9]+/g) || []).length;
    const selfClosingTags = (content.match(/<[a-zA-Z0-9]+[^>]*\/>/g) || []).length;
    
    console.log(`File: ${filePath}`);
    console.log(`Open tags: ${openTags}`);
    console.log(`Close tags: ${closeTags}`);
    console.log(`Self-closing tags: ${selfClosingTags}`);
    console.log(`Estimated Balance: ${openTags - closeTags - selfClosingTags}`);
    
    // More precise check for nested structures
    const lines = content.split('\n');
    let stack = [];
    let lineNum = 1;
    // This is a very basic check and won't work perfectly for complex JSX, 
    // but might catch obvious ones.
}

const files = [
    'c:/Users/hp/kishan22/src/app/[lang]/login/page.tsx',
    'c:/Users/hp/kishan22/src/app/[lang]/forgot-password/page.tsx'
];

files.forEach(checkTags);
