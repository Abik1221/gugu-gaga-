#!/usr/bin/env node

/**
 * PWA Icon Generator
 * Generates all required PWA icons from your logo
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_IMAGE = path.join(__dirname, '../public/mesoblogo.jpeg');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');
const THEME_COLOR = '#10b981';

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const MASKABLE_SIZES = [192, 512];

console.log('=====================================');
console.log('🎨 PWA Icon Generator for MesobAI');
console.log('=====================================\n');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✓ Created directory: ${OUTPUT_DIR}`);
}

if (!fs.existsSync(INPUT_IMAGE)) {
    console.error(`✗ Input image not found: ${INPUT_IMAGE}`);
    process.exit(1);
}

console.log(`✓ Input image found\n`);

async function generateIcons() {
    try {
        console.log('📱 Generating regular icons...\n');
        for (const size of SIZES) {
            const outputFile = path.join(OUTPUT_DIR, `icon-${size}.png`);
            process.stdout.write(`  ${size}x${size}...`);

            await sharp(INPUT_IMAGE, { failOnError: false })
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
                })
                .png()
                .toFile(outputFile);

            console.log(' ✓');
        }

        console.log('\n🎭 Generating maskable icons...\n');
        for (const size of MASKABLE_SIZES) {
            const outputFile = path.join(OUTPUT_DIR, `maskable-icon-${size}.png`);
            const innerSize = Math.floor(size * 0.8);

            process.stdout.write(`  maskable ${size}x${size}...`);

            // Create white canvas
            const canvas = await sharp({
                create: {
                    width: size,
                    height: size,
                    channels: 4,
                    background: '#FFFFFF' // Pure white background
                }
            }).png().toBuffer();

            const resizedLogo = await sharp(INPUT_IMAGE, { failOnError: false })
                .resize(innerSize, innerSize, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
                })
                .toBuffer();

            await sharp(canvas)
                .composite([{
                    input: resizedLogo,
                    top: Math.floor((size - innerSize) / 2),
                    left: Math.floor((size - innerSize) / 2)
                }])
                .png()
                .toFile(outputFile);

            console.log(' ✓');
        }

        console.log('\n🍎 Generating Apple Touch Icon...\n');
        await sharp(INPUT_IMAGE, { failOnError: false })
            .resize(180, 180, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
            })
            .png()
            .toFile(path.join(OUTPUT_DIR, 'apple-icon.png'));
        console.log('  180x180... ✓');

        console.log('\n=====================================');
        console.log('✓ Icon generation complete!');
        console.log('=====================================\n');

        const files = fs.readdirSync(OUTPUT_DIR);
        console.log(`📊 Generated ${files.length} files:\n`);
        files.forEach(file => {
            const stats = fs.statSync(path.join(OUTPUT_DIR, file));
            console.log(`  ✓ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
        });

        console.log('\n✨ Next: Test your PWA with npm run dev\n');

    } catch (error) {
        console.error('\n✗ Error:', error.message);
        process.exit(1);
    }
}

try {
    require.resolve('sharp');
    generateIcons();
} catch (e) {
    console.error('✗ Sharp module not found!');
    console.error('\nInstall it with: npm install sharp --save-dev\n');
    process.exit(1);
}
