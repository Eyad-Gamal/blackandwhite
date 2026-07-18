/**
 * Image Compression Script
 * 
 * This script compresses PNG images in the public folder to WebP format
 * Reduces file sizes by 70-90% without visible quality loss
 * 
 * Usage:
 *   npm install sharp --save-dev
 *   node compress-images.js
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');

// Images to compress
const imagesToCompress = [
    'Gemini_Generated_Image_.png',
    'Gemini_Generated_Image_ (1).png',
    'Gemini_Generated_Image_ (2).png',
    'Gemini_Generated_Image_ (3).png',
    'Gemini_Generated_Image_ (4).png',
    'Gemini_Generated_Image_ (5).png',
    'sec-logo.png'
];

async function compressImage(filename) {
    const inputPath = path.join(PUBLIC_DIR, filename);
    const outputPath = path.join(PUBLIC_DIR, filename.replace('.png', '.webp'));

    try {
        // Check if file exists
        await fs.access(inputPath);

        // Get original file size
        const originalStats = await fs.stat(inputPath);
        const originalSizeMB = (originalStats.size / 1024 / 1024).toFixed(2);

        console.log(`📷 Compressing: ${filename} (${originalSizeMB} MB)`);

        // Compress to WebP
        await sharp(inputPath)
            .webp({
                quality: 85,      // High quality
                effort: 6,        // Balanced compression
                lossless: false   // Lossy compression for better size
            })
            .toFile(outputPath);

        // Get compressed file size
        const compressedStats = await fs.stat(outputPath);
        const compressedSizeMB = (compressedStats.size / 1024 / 1024).toFixed(2);
        const reduction = ((1 - (compressedStats.size / originalStats.size)) * 100).toFixed(1);

        console.log(`✅ Saved: ${outputPath.split('/').pop()} (${compressedSizeMB} MB, -${reduction}%)\n`);

        return {
            original: filename,
            compressed: path.basename(outputPath),
            originalSize: originalSizeMB,
            compressedSize: compressedSizeMB,
            reduction: reduction
        };
    } catch (err) {
        console.error(`❌ Error compressing ${filename}:`, err.message);
        return null;
    }
}

async function main() {
    console.log('🚀 Starting image compression...\n');

    const results = [];

    for (const image of imagesToCompress) {
        const result = await compressImage(image);
        if (result) results.push(result);
    }

    console.log('\n📊 Compression Summary:');
    console.log('═'.repeat(60));

    let totalOriginal = 0;
    let totalCompressed = 0;

    results.forEach(r => {
        totalOriginal += parseFloat(r.originalSize);
        totalCompressed += parseFloat(r.compressedSize);
        console.log(`${r.original} -> ${r.compressed}`);
        console.log(`  ${r.originalSize} MB -> ${r.compressedSize} MB (-${r.reduction}%)`);
    });

    const totalReduction = ((1 - (totalCompressed / totalOriginal)) * 100).toFixed(1);

    console.log('═'.repeat(60));
    console.log(`Total: ${totalOriginal.toFixed(2)} MB -> ${totalCompressed.toFixed(2)} MB (-${totalReduction}%)`);
    console.log('\n✅ Compression complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Update image references in code from .png to .webp');
    console.log('2. Test the website to ensure images load correctly');
    console.log('3. Delete old .png files after verification');
    console.log('4. Deploy to Vercel and monitor bandwidth usage');
}

main().catch(console.error);
