const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BUNDLES = [
    {
        id: 'starter',
        name: 'The Starter Kit',
        price: 1950,
        originalPrice: 2800,
        image: "https://i.postimg.cc/7L9Bqvpw/a3fd3232_52de_4ab3_a56b_29eab2aa9065.png",
        description: '1x AHN White+ Cream (50ml). Ideal for testing the formula.',
        savings: 850,
        itemsCount: 1
    },
    {
        id: 'glow-up',
        name: 'The Glow Up Set',
        price: 2850,
        originalPrice: 5600,
        image: "https://i.postimg.cc/vmhPGRpM/b941fd23_363b_4178_b2d9_54f5c50964a4.png",
        description: '2x Jars + Free Priority Delivery. Recommended for full 6-week course.',
        badge: 'DERMATOLOGIST CHOICE',
        savings: 2750,
        itemsCount: 2
    },
    {
        id: 'ultimate',
        name: 'Full Radiance Course',
        price: 3750,
        originalPrice: 8400,
        image: "https://i.postimg.cc/7L9Bqvpw/a3fd3232_52de_4ab3_a56b_29eab2aa9065.png",
        description: '3x Jars. The complete regimen for stubborn pigmentation.',
        badge: 'BEST VALUE',
        savings: 4650,
        itemsCount: 3
    }
];

const REVIEWS = [
    { user: "Sana Ahmed", rating: 5, comment: "I was scared of using whitening creams because of steroids, but this ingredients list is safe. Niacinamide really helped my oily T-zone in Karachi heat." },
    { user: "Fatima Sheikh", rating: 5, comment: "No itching, no redness! Finally a cream that doesn't burn my sensitive skin. My acne marks are fading slowly but surely." },
    { user: "Zainab Ali", rating: 4, comment: "Packaging is sealed properly, batch code was verified. 100% original. Result takes time, don't expect magic in 2 days." }
];

const MEDIA = [
    { type: 'video', src: "https://images.unsplash.com/photo-1616763355603-9755a640a287?auto=format&fit=crop&q=80&w=400", user: "Hira's Routine" },
    { type: 'image', src: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=400", user: "Before/After" },
];

async function main() {
    console.log('Seeding products...');
    for (const product of BUNDLES) {
        await prisma.product.upsert({
            where: { id: product.id },
            update: {},
            create: product,
        });
    }

    console.log('Seeding reviews...');
    for (const review of REVIEWS) {
        await prisma.review.create({
            data: review
        });
    }

    console.log('Seeding media...');
    for (const m of MEDIA) {
        await prisma.media.create({
            data: m
        });
    }

    console.log('Seeding settings...');
    await prisma.settings.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1 }
    });

    console.log('Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
