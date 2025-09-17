import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { prisma } from '../lib/prisma';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/portfolio'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'portfolio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Dozvoljene su samo slike (jpeg, jpg, png, gif)'));
    }
  }
});

router.get('/', async (req, res) => {
  const { categoryId, city, search } = req.query;

  try {
    const where: any = {};

    if (categoryId) {
      where.categories = { some: { categoryId: parseInt(categoryId as string) } };
    }

    if (city) {
      where.coverageAreas = { some: { city: city as string } };
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search as string } } },
        { bio: { contains: search as string } }
      ];
    }

    const providers = await prisma.serviceProvider.findMany({
      where,
      include: {
        user: true,
        categories: { include: { category: true } },
        coverageAreas: true
      },
      orderBy: [
        { isVerified: 'desc' },
        { rating: 'desc' }
      ]
    });

    res.json(providers.map(p => ({
      id: p.id,
      userId: p.user.id,
      name: p.user.name,
      phone: p.user.phone,
      bio: p.bio,
      experience: p.experience,
      rating: p.rating,
      totalReviews: p.totalReviews,
      isVerified: p.isVerified,
      categories: p.categories.map(c => ({
        id: c.category.id,
        name: c.category.name,
        icon: c.category.icon || ''
      })),
      coverageAreas: p.coverageAreas.map(a => a.city)
    })));
  } catch (error) {
    console.error('Error fetching service providers:', error);
    res.status(500).json({ error: 'Greška pri učitavanju majstora' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: true,
        categories: { include: { category: true } },
        coverageAreas: true,
        portfolio: true,
        reviews: {
          include: { customer: { include: { user: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!provider) {
      return res.status(404).json({ error: 'Majstor nije pronađen' });
    }

    res.json({
      id: provider.id,
      userId: provider.user.id,
      name: provider.user.name,
      phone: provider.user.phone,
      bio: provider.bio,
      experience: provider.experience,
      rating: provider.rating,
      totalReviews: provider.totalReviews,
      isVerified: provider.isVerified,
      categories: provider.categories.map(c => ({
        id: c.category.id,
        name: c.category.name,
        icon: c.category.icon || ''
      })),
      coverageAreas: provider.coverageAreas.map(a => a.city),
      portfolio: provider.portfolio,
      reviews: provider.reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        customer: { name: r.customer.user.name }
      }))
    });
  } catch (error) {
    console.error('Error fetching service provider:', error);
    res.status(500).json({ error: 'Greška pri učitavanju majstora' });
  }
});

router.post('/:id/portfolio', upload.single('image'), async (req, res) => {
  try {
    const serviceProviderId = parseInt(req.params.id);
    const { title, description, categoryId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Slika je obavezna' });
    }

    const imageUrl = `/uploads/portfolio/${req.file.filename}`;

    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        serviceProviderId,
        title,
        description,
        imageUrl,
        categoryId: categoryId ? parseInt(categoryId) : null
      }
    });

    res.json(portfolioItem);
  } catch (error) {
    console.error('Error uploading portfolio item:', error);
    res.status(500).json({ error: 'Greška pri kačenju slike' });
  }
});

router.get('/portfolio/latest', async (req, res) => {
  try {
    const portfolioItems = await prisma.portfolioItem.findMany({
      take: 12,
      include: {
        serviceProvider: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(portfolioItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
      serviceProvider: {
        id: item.serviceProvider.id,
        name: item.serviceProvider.user.name
      }
    })));
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    res.status(500).json({ error: 'Greška pri učitavanju galerije' });
  }
});

export default router;