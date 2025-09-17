// Quick test sa osnovnim JavaScript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function quickTest() {
  console.log('Testiranje Prisma konekcije...');

  try {
    // Test 1: Dodaj kategoriju
    const kat = await prisma.category.create({
      data: {
        name: 'Test Keramičar',
        description: 'Test opis',
        icon: 'KER'
      }
    });
    console.log('✅ Kategorija kreirana:', kat.id);

    // Test 2: Dodaj korisnika
    const hashedPassword = await bcrypt.hash('123456', 10);
    const user = await prisma.user.create({
      data: {
        username: 'test_user',
        email: 'test@test.com',
        password: hashedPassword,
        name: 'Test User',
        phone: '+381 60 123 456',
        role: 'SERVICE_PROVIDER'
      }
    });
    console.log('✅ Korisnik kreiran:', user.id);

    // Test 3: Dodaj majstora
    const majstor = await prisma.serviceProvider.create({
      data: {
        userId: user.id,
        bio: 'Test majstor',
        experience: 5,
        rating: 4.5,
        totalReviews: 10,
        isVerified: true
      }
    });
    console.log('✅ Majstor kreiran:', majstor.id);

    // Test 4: Povezat majstora sa kategorijom
    await prisma.serviceProviderCategory.create({
      data: {
        serviceProviderId: majstor.id,
        categoryId: kat.id
      }
    });

    // Test 5: Dodaj oblast rada
    await prisma.coverageArea.create({
      data: {
        serviceProviderId: majstor.id,
        city: 'Beograd'
      }
    });

    console.log('✅ Svi testovi prošli!');

  } catch (error) {
    console.error('❌ Greška:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickTest();