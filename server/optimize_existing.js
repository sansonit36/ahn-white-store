const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadDir = path.join(__dirname, 'uploads');

async function optimizeImages() {
    console.log('🚀 Starting optimization of existing images...');

    if (!fs.existsSync(uploadDir)) {
        console.log('No uploads directory found.');
        return;
    }

    const files = fs.readdirSync(uploadDir);
    let count = 0;
    let savedSpace = 0;

    for (const file of files) {
        // Skip already optimized WebP files if we are looking for png/jpg
        if (file.endsWith('.webp')) continue;

        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);

        // Skip small files (< 500KB)
        if (stats.size < 500 * 1024) continue;

        try {
            const ext = path.extname(file).toLowerCase();
            let pipeline = sharp(filePath).resize({ width: 1000, withoutEnlargement: true });

            if (ext === '.png') {
                // Aggressive PNG compression
                pipeline = pipeline.png({ quality: 60, compressionLevel: 9, force: true, palette: true });
            } else if (ext === '.jpg' || ext === '.jpeg') {
                pipeline = pipeline.jpeg({ quality: 60, mozjpeg: true, force: true });
            } else {
                continue; // Skip unknown formats
            }

            const buffer = await pipeline.toBuffer();

            // Only overwrite if optimization actually reduced size
            if (buffer.length < stats.size) {
                fs.writeFileSync(filePath, buffer);
                const savings = (stats.size - buffer.length) / 1024 / 1024;
                savedSpace += savings;
                count++;
                console.log(`✅ Optimized ${file}: ${(stats.size / 1024 / 1024).toFixed(2)}MB -> ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
            } else {
                console.log(`Skipped ${file} (no size reduction)`);
            }
        } catch (err) {
            console.error(`❌ Failed to optimize ${file}:`, err.message);
        }
    }

    console.log(`\n🎉 Optimization Complete!`);
    console.log(`Processed ${count} files.`);
    console.log(`Saved total space: ${savedSpace.toFixed(2)} MB`);
}

optimizeImages();
