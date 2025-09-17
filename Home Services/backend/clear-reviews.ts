import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearReviews() {
  console.log('Brisanje svih recenzija...');

  await prisma.review.deleteMany();
  console.log('Sve recenzije obrisane');

  console.log('Resetovanje rating-a majstora...');
  await prisma.serviceProvider.updateMany({
    data: {
      rating: 0,
      totalReviews: 0
    }
  });
  console.log('Rating-ovi resetovani');

  console.log('Gotovo!');
}

clearReviews()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });