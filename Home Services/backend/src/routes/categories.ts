import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        services: {
          where: { isActive: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon || '',
      isActive: category.isActive,
      services: category.services.map(service => ({
        id: service.id,
        categoryId: service.categoryId,
        name: service.name,
        description: service.description,
        isActive: service.isActive
      }))
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Konflikt u podacima' });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Kategorije nisu pronađene' });
    }

    if (error.message?.includes('connect') || error.message?.includes('timeout')) {
      return res.status(503).json({ error: 'Privremeni problem sa bazom podataka' });
    }

    res.status(500).json({ error: 'Greška pri učitavanju kategorija' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        icon: icon || '',
        isActive: true
      },
      include: {
        services: true
      }
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ error: 'Greška pri kreiranju kategorije' });
  }
});

export default router;