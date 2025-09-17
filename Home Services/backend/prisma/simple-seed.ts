import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Počinje jednostavan seeding...');

  // Čišćenje baze
  await prisma.review.deleteMany();
  await prisma.serviceProviderCategory.deleteMany();
  await prisma.coverageArea.deleteMany();
  await prisma.service.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.serviceProvider.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // Kreiranje kategorija
  const keramicar = await prisma.category.create({
    data: {
      name: 'Keramičar',
      description: 'Postavljanje pločica, keramike, popravke u kupatilu',
      icon: 'KER'
    }
  });

  const vodoinstalater = await prisma.category.create({
    data: {
      name: 'Vodoinstalater',
      description: 'Popravka cevi, instalacija, kvariovi sa vodom',
      icon: 'VOD'
    }
  });

  const elektricar = await prisma.category.create({
    data: {
      name: 'Električar',
      description: 'Električne instalacije, popravke, ugradnja svetala',
      icon: 'ELE'
    }
  });

  const moler = await prisma.category.create({
    data: {
      name: 'Moler',
      description: 'Krečenje, gletovanje, dekorativne tehnike',
      icon: 'MOL'
    }
  });

  console.log('Kategorije kreirane:', keramicar.id, vodoinstalater.id, elektricar.id, moler.id);

  // Kreiranje test korisnika
  const hashedPassword = await bcrypt.hash('123456', 10);

  const customerUser = await prisma.user.create({
    data: {
      username: 'marko123',
      email: 'marko@test.com',
      password: hashedPassword,
      name: 'Marko Petrović',
      phone: '+381 60 123 4567',
      role: UserRole.CUSTOMER
    }
  });

  const customer = await prisma.customer.create({
    data: {
      userId: customerUser.id,
      address: 'Kneza Miloša 12',
      city: 'Beograd'
    }
  });

  // Test majstor
  const providerUser = await prisma.user.create({
    data: {
      username: 'stefan_keramicar',
      email: 'stefan@test.com',
      password: hashedPassword,
      name: 'Stefan Nikolić',
      phone: '+381 63 987 6543',
      role: UserRole.SERVICE_PROVIDER
    }
  });

  const provider = await prisma.serviceProvider.create({
    data: {
      userId: providerUser.id,
      bio: 'Iskusan keramičar sa 10 godina rada. Specijalizovan za kupatila.',
      experience: 10,
      rating: 4.8,
      totalReviews: 0,
      isVerified: true
    }
  });

  // Povezivanje majstora sa kategorijom
  await prisma.serviceProviderCategory.create({
    data: {
      serviceProviderId: provider.id,
      categoryId: keramicar.id
    }
  });

  // Oblast rada
  await prisma.coverageArea.create({
    data: {
      serviceProviderId: provider.id,
      city: 'Beograd'
    }
  });

  console.log('Test podaci uspešno kreirani!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });