import express from 'express';
import { PrismaClient, UserRole } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/dashboard/stats', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalCustomers = await prisma.customer.count();
    const totalProviders = await prisma.serviceProvider.count();
    const totalCategories = await prisma.category.count();
    const verifiedProviders = await prisma.serviceProvider.count({
      where: { isVerified: true }
    });
    const totalReviews = await prisma.review.count();

    const avgRatingResult = await prisma.review.aggregate({
      _avg: { rating: true }
    });
    const averageRating = avgRatingResult._avg.rating || 0;

    res.json({
      overview: {
        totalUsers,
        totalCustomers,
        totalProviders,
        totalCategories,
        verifiedProviders,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10
      },
      monthlyRegistrations: [],
      recentProviders: [],
      popularCategories: []
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', String(error));
    res.status(500).send('Greška pri dohvatanju statistika');
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      take: 20,
      include: {
        customer: true,
        serviceProvider: {
          include: {
            categories: {
              include: { category: true }
            }
          }
        },
        admin: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const safeUsers = JSON.parse(JSON.stringify(users, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    res.json({
      users: safeUsers,
      pagination: {
        page: 1,
        limit: 20,
        total: safeUsers.length,
        pages: 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', String(error));
    res.status(500).send('Greška pri dohvatanju korisnika');
  }
});

router.patch('/users/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { serviceProvider: true }
    });

    if (!user || !user.serviceProvider) {
      return res.status(404).json({ error: 'Majstor nije pronađen' });
    }

    await prisma.serviceProvider.update({
      where: { id: user.serviceProvider.id },
      data: { isVerified }
    });

    res.json({ message: 'Status verifikacije ažuriran' });
  } catch (error) {
    console.error('Error updating verification:', error);
    res.status(500).json({ error: 'Greška pri ažuriranju verifikacije' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Korisnik obrisan' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Greška pri brisanju korisnika' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        services: true,
        serviceProviders: {
          include: {
            serviceProvider: {
              include: { user: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Greška pri dohvatanju kategorija' });
  }
});

router.patch('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    await prisma.category.update({
      where: { id: Number(id) },
      data: { isActive }
    });

    res.json({ message: 'Kategorija ažurirana' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Greška pri ažuriranju kategorije' });
  }
});

export default router;