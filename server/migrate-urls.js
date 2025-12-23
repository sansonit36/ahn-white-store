const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
    console.log('Starting URL migration...');

    // Helper to fix a single URL
    const fixUrl = (url) => {
        if (!url) return url;
        // Replace http://localhost:5001/uploads/... or similar with /uploads/...
        // Regex matches protocol + host + port
        return url.replace(/^https?:\/\/[^/]+(\/uploads\/)/, '$1');
    };

    // 1. Products
    const products = await prisma.product.findMany();
    for (const p of products) {
        let changed = false;
        const newImage = fixUrl(p.image);
        if (newImage !== p.image) changed = true;

        // Handle JSON images array
        let newImages = p.images;
        try {
            const imagesArr = JSON.parse(p.images);
            const fixedArr = imagesArr.map(fixUrl);
            newImages = JSON.stringify(fixedArr);
            if (newImages !== p.images) changed = true;
        } catch (e) {
            console.warn(`Failed to parse images for product ${p.id}`);
        }

        if (changed) {
            await prisma.product.update({
                where: { id: p.id },
                data: { image: newImage, images: newImages }
            });
            console.log(`Updated Product: ${p.name}`);
        }
    }

    // 2. Settings
    const settings = await prisma.settings.findFirst();
    if (settings) {
        const updates = {};
        const fields = ['beforeImage', 'afterImage', 'safePromiseImage', 'ingredientsImage'];

        fields.forEach(f => {
            const fixed = fixUrl(settings[f]);
            if (fixed !== settings[f]) updates[f] = fixed;
        });

        // Handle realGlowImages JSON
        try {
            const glowArr = JSON.parse(settings.realGlowImages || "[]");
            const fixedGlow = JSON.stringify(glowArr.map(fixUrl));
            if (fixedGlow !== settings.realGlowImages) updates.realGlowImages = fixedGlow;
        } catch (e) { }

        if (Object.keys(updates).length > 0) {
            await prisma.settings.update({
                where: { id: settings.id },
                data: updates
            });
            console.log('Updated Settings');
        }
    }

    // 3. Media
    const media = await prisma.media.findMany();
    for (const m of media) {
        const newSrc = fixUrl(m.src);
        if (newSrc !== m.src) {
            await prisma.media.update({
                where: { id: m.id },
                data: { src: newSrc }
            });
            console.log(`Updated Media: ${m.type} for ${m.user || 'Admin'}`);
        }
    }

    console.log('Migration complete.');
}

migrate()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
