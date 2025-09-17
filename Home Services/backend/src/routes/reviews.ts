import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/provider/:providerId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { serviceProviderId: parseInt(req.params.providerId) },
      include: { customer: { include: { user: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      reviews: reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
        customerName: r.customer.user.name
      })),
      total: reviews.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Greška pri učitavanju ocena' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customerUserId, serviceProviderId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Ocena mora biti između 1 i 5' });
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: customerUserId },
      include: { user: true }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Korisnik nije pronađen' });
    }

    const review = await prisma.review.create({
      data: {
        customerId: customer.id,
        serviceProviderId: parseInt(serviceProviderId),
        rating: Number(rating),
        comment: comment?.trim() || null
      }
    });

    await updateProviderRating(parseInt(serviceProviderId));

    res.status(201).json({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      customerName: customer.user.name
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Greška pri kreiranju ocene' });
  }
});

async function updateProviderRating(serviceProviderId: number) {
  const reviews = await prisma.review.findMany({
    where: { serviceProviderId }
  });

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  await prisma.serviceProvider.update({
    where: { id: serviceProviderId },
    data: {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews
    }
  });
}

export default router;