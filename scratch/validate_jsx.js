import fs from 'fs';

function validateJSX(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let stack = [];
    let lineNum = 1;

    // Very simple state machine for tags
    let i = 0;
    while (i < content.length) {
        if (content[i] === '<' && content[i+1] !== ' ' && content[i+1] !== '!' && content[i+1] !== '=') {
            // Check if it's a closing tag
            if (content[i+1] === '/') {
                let j = i + 2;
                while (j < content.length && content[j] !== ' ' && content[j] !== '>') j++;
                let tagName = content.substring(i + 2, j);
                let last = stack.pop();
                if (last !== tagName) {
                    console.log(`Error: Mismatched tag at line ${getLineNum(content, i)}. Expected </${last}>, found </${tagName}>`);
                }
                i = j;
            } else {
                // Opening tag
                let j = i + 1;
                while (j < content.length && content[j] !== ' ' && content[j] !== '>' && content[j] !== '/') j++;
                let tagName = content.substring(i + 1, j);
                
                // Find end of tag
                let k = j;
                let isSelfClosing = false;
                while (k < content.length && content[k] !== '>') {
                    if (content[k] === '/' && content[k+1] === '>') {
                        isSelfClosing = true;
                        break;
                    }
                    k++;
                }
                
                if (!isSelfClosing && !isVoidElement(tagName)) {
                    stack.push(tagName);
                }
                i = k;
            }
        }
        i++;
    }
    
    if (stack.length > 0) {
        console.log(`Error: Unclosed tags remaining in ${filePath}: ${stack.join(', ')}`);
    } else {
        console.log(`Success: Tags balanced in ${filePath}`);
    }
}

function getLineNum(content, index) {
    return content.substring(0, index).split('\n').length;
}

function isVoidElement(tag) {
    return ['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tag.toLowerCase());
}

const files = [
    'c:/Users/hp/kishan22/src/app/[lang]/login/page.tsx',
    'c:/Users/hp/kishan22/src/app/[lang]/forgot-password/page.tsx'
];

files.forEach(validateJSX);
