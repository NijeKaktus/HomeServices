import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Kreiranje kompletne baze podataka...');

  // Čišćenje postojećih podataka
  await prisma.review.deleteMany();
  await prisma.serviceProviderCategory.deleteMany();
  await prisma.coverageArea.deleteMany();
  await prisma.service.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.serviceProvider.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  console.log('Kreiranje kategorija...');

  // Kategorije
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

  const stolar = await prisma.category.create({
    data: {
      name: 'Stolar',
      description: 'Izrada nameštaja, popravke, ugradnja elemenata',
      icon: 'STO'
    }
  });

  const klimatizar = await prisma.category.create({
    data: {
      name: 'Klimatizar',
      description: 'Ugradnja i servis klima uređaja',
      icon: 'KLI'
    }
  });

  console.log('Kreiranje usluga...');

  // Usluge za svaku kategoriju
  await prisma.service.createMany({
    data: [
      // Keramičar
      { categoryId: keramicar.id, name: 'Postavljanje pločica', description: 'Profesionalno postavljanje pločica u kupatilu i kuhinji', basePrice: 800, unit: 'm2' },
      { categoryId: keramicar.id, name: 'Fugovanje', description: 'Fugovanje između pločica', basePrice: 200, unit: 'm2' },

      // Vodoinstalater
      { categoryId: vodoinstalater.id, name: 'Popravka slavine', description: 'Popravka i zamena slavina', basePrice: 1500, unit: 'kom' },
      { categoryId: vodoinstalater.id, name: 'Čišćenje kanalizacije', description: 'Uklanjanje zapušenja iz cevi', basePrice: 2000, unit: 'intervencija' },

      // Električar
      { categoryId: elektricar.id, name: 'Ugradnja prekidača', description: 'Postavljanje prekidača i utičnica', basePrice: 800, unit: 'kom' },
      { categoryId: elektricar.id, name: 'Ugradnja lustera', description: 'Postavljanje lustera i svetala', basePrice: 1200, unit: 'kom' },

      // Moler
      { categoryId: moler.id, name: 'Krečenje zidova', description: 'Farbanje i krečenje unutrašnjih zidova', basePrice: 300, unit: 'm2' },
      { categoryId: moler.id, name: 'Gletovanje', description: 'Gletovanje i priprema zidova za farbanje', basePrice: 250, unit: 'm2' },

      // Stolar
      { categoryId: stolar.id, name: 'Popravka nameštaja', description: 'Popravka stolica, stolova, ormara', basePrice: 1000, unit: 'kom' },
      { categoryId: stolar.id, name: 'Ugradnja polica', description: 'Izrada i ugradnja polica po meri', basePrice: 1500, unit: 'kom' },

      // Klimatizar
      { categoryId: klimatizar.id, name: 'Ugradnja klime', description: 'Montaža klima uređaja sa puštanjem u rad', basePrice: 8000, unit: 'kom' },
      { categoryId: klimatizar.id, name: 'Servis klime', description: 'Čišćenje i servis postojećih klima uređaja', basePrice: 3000, unit: 'kom' }
    ]
  });

  console.log('Kreiranje korisnika...');

  const hashedPassword = await bcrypt.hash('123456', 10);

  // Test korisnici - mušterije
  const customerUser1 = await prisma.user.create({
    data: {
      username: 'marko123',
      email: 'marko@test.com',
      password: hashedPassword,
      name: 'Marko Petrović',
      phone: '+381 60 123 4567',
      role: UserRole.CUSTOMER
    }
  });

  const customer1 = await prisma.customer.create({
    data: {
      userId: customerUser1.id,
      address: 'Kneza Miloša 12',
      city: 'Beograd'
    }
  });

  const customerUser2 = await prisma.user.create({
    data: {
      username: 'ana_novak',
      email: 'ana@test.com',
      password: hashedPassword,
      name: 'Ana Novak',
      phone: '+381 61 234 5678',
      role: UserRole.CUSTOMER
    }
  });

  const customer2 = await prisma.customer.create({
    data: {
      userId: customerUser2.id,
      address: 'Bulevar oslobođenja 45',
      city: 'Novi Sad'
    }
  });

  const customerUser3 = await prisma.user.create({
    data: {
      username: 'petar_milic',
      email: 'petar@test.com',
      password: hashedPassword,
      name: 'Petar Milić',
      phone: '+381 62 345 6789',
      role: UserRole.CUSTOMER
    }
  });

  const customer3 = await prisma.customer.create({
    data: {
      userId: customerUser3.id,
      address: 'Cara Lazara 8',
      city: 'Niš'
    }
  });

  console.log('Kreiranje majstora...');

  // Majstori
  const majstorUser1 = await prisma.user.create({
    data: {
      username: 'stefan_keramicar',
      email: 'stefan@test.com',
      password: hashedPassword,
      name: 'Stefan Nikolić',
      phone: '+381 63 987 6543',
      role: UserRole.SERVICE_PROVIDER
    }
  });

  const majstor1 = await prisma.serviceProvider.create({
    data: {
      userId: majstorUser1.id,
      bio: 'Iskusan keramičar sa 10 godina rada. Specijalizovan za kupatila i kuhinje. Radim samo sa kvalitetnim materijalima.',
      experience: 10,
      rating: 0,
      totalReviews: 0,
      isVerified: true
    }
  });

  const majstorUser2 = await prisma.user.create({
    data: {
      username: 'milan_vodoinstalater',
      email: 'milan@test.com',
      password: hashedPassword,
      name: 'Milan Jovanović',
      phone: '+381 64 111 2222',
      role: UserRole.SERVICE_PROVIDER
    }
  });

  const majstor2 = await prisma.serviceProvider.create({
    data: {
      userId: majstorUser2.id,
      bio: 'Profesionalni vodoinstalater. Brze intervencije 24/7. 15 godina iskustva u rešavanju problema sa vodom.',
      experience: 15,
      rating: 0,
      totalReviews: 0,
      isVerified: true
    }
  });

  const majstorUser3 = await prisma.user.create({
    data: {
      username: 'nikola_elektricar',
      email: 'nikola@test.com',
      password: hashedPassword,
      name: 'Nikola Stojanović',
      phone: '+381 65 333 4444',
      role: UserRole.SERVICE_PROVIDER
    }
  });

  const majstor3 = await prisma.serviceProvider.create({
    data: {
      userId: majstorUser3.id,
      bio: 'Diplomirani električar sa licencom. Ugradnja i popravke svih vrsta električnih instalacija.',
      experience: 8,
      rating: 0,
      totalReviews: 0,
      isVerified: false
    }
  });

  const majstorUser4 = await prisma.user.create({
    data: {
      username: 'aleksandar_moler',
      email: 'aleksandar@test.com',
      password: hashedPassword,
      name: 'Aleksandar Mitrović',
      phone: '+381 66 555 6666',
      role: UserRole.SERVICE_PROVIDER
    }
  });

  const majstor4 = await prisma.serviceProvider.create({
    data: {
      userId: majstorUser4.id,
      bio: 'Kreativni moler sa strašću prema savršenstvu. Radim dekorativne tehnike i klasično krečenje.',
      experience: 12,
      rating: 0,
      totalReviews: 0,
      isVerified: true
    }
  });

  const majstorUser5 = await prisma.user.create({
    data: {
      username: 'vladimir_stolar',
      email: 'vladimir@test.com',
      password: hashedPassword,
      name: 'Vladimir Radić',
      phone: '+381 67 777 8888',
      role: UserRole.SERVICE_PROVIDER
    }
  });

  const majstor5 = await prisma.serviceProvider.create({
    data: {
      userId: majstorUser5.id,
      bio: 'Majstorski stolar. Radim nameštaj po meri, popravke i renoviranje starih komada.',
      experience: 20,
      rating: 0,
      totalReviews: 0,
      isVerified: true
    }
  });

  console.log('Povezivanje majstora sa kategorijama...');

  // Povezivanje majstora sa kategorijama
  await prisma.serviceProviderCategory.createMany({
    data: [
      { serviceProviderId: majstor1.id, categoryId: keramicar.id },
      { serviceProviderId: majstor2.id, categoryId: vodoinstalater.id },
      { serviceProviderId: majstor3.id, categoryId: elektricar.id },
      { serviceProviderId: majstor4.id, categoryId: moler.id },
      { serviceProviderId: majstor5.id, categoryId: stolar.id },
    ]
  });

  console.log('Dodavanje oblasti rada...');

  // Oblasti rada
  await prisma.coverageArea.createMany({
    data: [
      { serviceProviderId: majstor1.id, city: 'Beograd' },
      { serviceProviderId: majstor1.id, city: 'Novi Sad' },
      { serviceProviderId: majstor2.id, city: 'Beograd' },
      { serviceProviderId: majstor2.id, city: 'Pančevo' },
      { serviceProviderId: majstor2.id, city: 'Smederevo' },
      { serviceProviderId: majstor3.id, city: 'Beograd' },
      { serviceProviderId: majstor4.id, city: 'Novi Sad' },
      { serviceProviderId: majstor4.id, city: 'Subotica' },
      { serviceProviderId: majstor5.id, city: 'Beograd' },
      { serviceProviderId: majstor5.id, city: 'Kragujevac' }
    ]
  });

  console.log('Kreiranje admin korisnika...');

  // Admin korisnik
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@homeservices.rs',
      password: hashedPassword,
      name: 'Sistem Administrator',
      phone: '+381 11 000 0000',
      role: UserRole.ADMIN
    }
  });

  const admin = await prisma.admin.create({
    data: {
      userId: adminUser.id,
      permissions: 'all'
    }
  });

  console.log('Kreiranje test ocena...');

  // Test ocene sa random datumima iz 2025
  function getRandomDateIn2025() {
    const start = new Date('2025-01-01');
    const end = new Date('2025-09-14');
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  const testReviews = [
    { rating: 5, comment: "Odličan rad, brzo i kvalitetno urađeno. Preporučujem!" },
    { rating: 4, comment: "Zadovoljan sam uslugom, stigao je na vreme i obavio posao profesionalno." },
    { rating: 5, comment: "Vrhunski majstor! Obradio je sve u dogovorenom roku." },
    { rating: 3, comment: "Posao je urađen kako treba, ali je kasnio sat vremena." },
    { rating: 5, comment: "Savršeno! Baš ono što sam tražio. Hvala vam puno!" },
    { rating: 4, comment: "Dobar rad, preporučujem svima." },
    { rating: 5, comment: "Izuzetan pristup i kvalitet rada. Definitivno ću pozovati ponovo." },
    { rating: 4, comment: "Solid majstor, vredan je para koje sam dao." },
    { rating: 5, comment: "Bez zamerke! Tačan, precizan i ljubazan." },
    { rating: 4, comment: "Veoma sam zadovoljan rezultatom, hvala vam." },
    { rating: 5, comment: "Neverovatno dobra usluga, preporučujem bez razmišljanja!" },
    { rating: 3, comment: "U redu je rad, moglo je malo bolje." },
    { rating: 5, comment: "TOP! Brz, precizan i povoljno. Sve je savršeno." },
    { rating: 4, comment: "Jako dobro urađeno, majstor zna svoj posao." },
    { rating: 5, comment: "Fenomenalno! Stigao tačno kad je rekao, uradio odličnog." }
  ];

  const majstori = [majstor1, majstor2, majstor3, majstor4, majstor5];
  const customers = [customer1, customer2, customer3];

  let reviewIndex = 0;

  for (const majstor of majstori) {
    const numReviews = Math.floor(Math.random() * 4) + 2; // 2-5 ocena po majstoru

    for (let i = 0; i < numReviews && reviewIndex < testReviews.length; i++) {
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const review = testReviews[reviewIndex % testReviews.length];
      const randomDate = getRandomDateIn2025();

      await prisma.review.create({
        data: {
          customerId: randomCustomer.id,
          serviceProviderId: majstor.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: randomDate
        }
      });

      reviewIndex++;
    }

    // Ažuriranje majstorovog proseka ocena
    const majstorReviews = await prisma.review.findMany({
      where: { serviceProviderId: majstor.id }
    });

    const totalReviews = majstorReviews.length;
    const avgRating = totalReviews > 0
      ? majstorReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    await prisma.serviceProvider.update({
      where: { id: majstor.id },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews
      }
    });

    console.log(`Majstor ${majstor.id} ima ${totalReviews} ocena, prosek: ${avgRating.toFixed(1)}`);
  }

  console.log('✅ Kompletna baza podataka je kreirana!');
  console.log(`
Kreirano:
- ${majstori.length} majstora sa ocenama
- ${customers.length} mušterije
- 6 kategorija sa uslugama
- 1 admin korisnik
- Random ocene iz 2025. godine

Testni nalozi:
- Mušterije: marko123, ana_novak, petar_milic (šifra: 123456)
- Majstori: stefan_keramicar, milan_vodoinstalater, nikola_elektricar, aleksandar_moler, vladimir_stolar (šifra: 123456)
- Admin: admin (šifra: 123456)
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });