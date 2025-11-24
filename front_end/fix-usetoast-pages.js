const fs = require('fs');
const path = require('path');

// List of all page files that use useToast
const pageFiles = [
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\staff\\sales\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\staff\\pos\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\staff\\notifications\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\staff\\inventory\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\settings\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\pos\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\payment\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\suppliers\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\staff\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\staff\\new\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\settings\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\pharmacies\\[id]\\settings\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\orders\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\order-status\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\inventory\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\integrations\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\expenses\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\chat\\[threadId]\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\chat\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\branches\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\analytics\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\owner\\agent\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\kyc\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\inventory\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\admin\\users\\[id]\\roles\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\admin\\users\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\admin\\suppliers\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\admin\\settings\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\admin\\segments\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\admin\\pharmacies\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\admin\\payouts\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\admin\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\admin\\audit\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\admin\\announcements\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\admin\\affiliates\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\(supplier-flow)\\supplier-payment\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\(supplier-flow)\\supplier-kyc\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\(supplier-flow)\\supplier\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\(supplier-flow)\\supplier\\orders\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\(supplier-flow)\\supplier\\chat\\page.tsx',
    'd:\\mesob\\gugu-gaga-\\front_end\\app\\(dashboard)\\dashboard\\(supplier-flow)\\supplier\\analytics\\page.tsx',
];

let fixedCount = 0;
let skippedCount = 0;

pageFiles.forEach((filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`Skipping non-existent file: ${filePath}`);
            skippedCount++;
            return;
        }

        const content = fs.readFileSync(filePath, 'utf8');

        // Check if already has dynamic export
        if (content.includes('export const dynamic')) {
            console.log(`Already has dynamic export: ${path.basename(filePath)}`);
            skippedCount++;
            return;
        }

        // Add dynamic export after "use client"
        const newContent = content.replace(
            /("use client";?\r?\n)\r?\n/,
            `$1\nexport const dynamic = 'force-dynamic';\n\n`
        );

        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Fixed: ${path.basename(filePath)}`);
            fixedCount++;
        } else {
            console.log(`No "use client" found in: ${path.basename(filePath)}`);
            skippedCount++;
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
});

console.log(`\nSummary: Fixed ${fixedCount} files, Skipped ${skippedCount} files`);
