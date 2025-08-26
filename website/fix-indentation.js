import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixIndentation(filePath) {
    console.log(`Processing: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split('\n');
    let fixedLines = [];
    
    for (let line of lines) {
        let leadingSpaces = line.match(/^(\s*)/)[1];
        let restOfLine = line.slice(leadingSpaces.length);
        
        if (leadingSpaces.length > 0) {
            // Convert any number of spaces to 4-space multiples
            let spaceCount = leadingSpaces.length;
            let newSpaceCount = Math.ceil(spaceCount / 2) * 2; // Convert to even number of spaces
            let newLeadingSpaces = ' '.repeat(newSpaceCount);
            fixedLines.push(newLeadingSpaces + restOfLine);
        } else {
            fixedLines.push(line);
        }
    }
    
    fs.writeFileSync(filePath, fixedLines.join('\n'));
    console.log(`Fixed: ${filePath}`);
}

function findTypeScriptFiles(dir) {
    const files = [];
    
    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
                files.push(fullPath);
            }
        }
    }
    
    traverse(dir);
    return files;
}

// Find and fix all TypeScript files
const tsFiles = findTypeScriptFiles('./src');
console.log(`Found ${tsFiles.length} TypeScript files`);

for (const file of tsFiles) {
    fixIndentation(file);
}

console.log('Indentation fix complete!');
