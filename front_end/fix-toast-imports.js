const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        const isFile = fs.statSync(dirPath).isFile();

        if (isDirectory) {
            if (f !== 'node_modules' && f !== '.next' && f !== 'dist') {
                walkDir(dirPath, callback);
            }
        }
        else if (isFile && (f.endsWith('.tsx') || f.endsWith('.ts'))) {
            callback(dirPath);
        }
    });
}

let count = 0;
walkDir('.', (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/from "@\/components\/ui\/toast"/g, 'from "@/components/ui/use-toast"');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        count++;
        console.log(`Fixed: ${filePath}`);
    }
});

console.log(`\nTotal files fixed: ${count}`);
