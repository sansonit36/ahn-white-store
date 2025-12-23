const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Use Memory Storage to process image with Sharp
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST upload file
router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + '.webp'; // Convert to WebP
        const filepath = path.join(uploadDir, filename);

        // Optimize Image (Aggressive Mobile)
        await sharp(req.file.buffer)
            .resize({ width: 1000, withoutEnlargement: true }) // Max width 1000px
            .webp({ quality: 60 }) // 60% Quality
            .toFile(filepath);

        // Return the file URL
        const fileUrl = `/uploads/${filename}`;
        res.json({ url: fileUrl });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Image processing failed' });
    }
});

module.exports = router;
