import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

function getRandomDateIn2025() {
  const start = new Date('2025-01-01');
  const end = new Date('2025-09-14'); // Do danas
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedReviews() {
  console.log('Dodavanje test ocena...');

  // Get all customers
  const customers = await prisma.customer.findMany({
    include: { user: true }
  });

  // Get all service providers
  const serviceProviders = await prisma.serviceProvider.findMany();

  if (customers.length === 0 || serviceProviders.length === 0) {
    console.log('Nema dovoljno korisnika ili majstora za kreiranje ocena');
    return;
  }

  // Delete existing reviews first
  await prisma.review.deleteMany();

  let reviewIndex = 0;

  // Add 2-4 reviews per service provider
  for (const provider of serviceProviders) {
    const numReviews = Math.floor(Math.random() * 3) + 2; // 2-4 reviews

    for (let i = 0; i < numReviews && reviewIndex < testReviews.length; i++) {
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const review = testReviews[reviewIndex % testReviews.length];
      const randomDate = getRandomDateIn2025();

      await prisma.review.create({
        data: {
          customerId: randomCustomer.id,
          serviceProviderId: provider.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: randomDate
        }
      });

      reviewIndex++;
    }

    // Update provider rating based on actual reviews
    const providerReviews = await prisma.review.findMany({
      where: { serviceProviderId: provider.id }
    });

    const totalReviews = providerReviews.length;
    const avgRating = totalReviews > 0
      ? providerReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    await prisma.serviceProvider.update({
      where: { id: provider.id },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews
      }
    });

    console.log(`Dodano ${totalReviews} ocena za ${provider.id} (prosek: ${avgRating.toFixed(1)})`);
  }

  console.log('Test ocene su dodane uspešno!');
}

seedReviews()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });