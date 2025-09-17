import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }] }
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Neispravni podaci za prijavu' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
      message: 'Uspešna prijava'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Greška pri prijavi' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, phone, role, serviceProviderData } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Korisnik već postoji' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData: any = {
      username,
      email,
      password: hashedPassword,
      name,
      phone,
      role: role.toUpperCase()
    };

    if (role.toLowerCase() === 'customer') {
      userData.customer = { create: {} };
    } else if (role.toLowerCase() === 'service_provider' && serviceProviderData) {
      userData.serviceProvider = {
        create: {
          bio: serviceProviderData.bio,
          experience: serviceProviderData.experience,
          rating: 0,
          totalReviews: 0,
          isVerified: false,
          categories: {
            create: serviceProviderData.categories.map((categoryId: number) => ({
              categoryId
            }))
          },
          coverageAreas: {
            create: serviceProviderData.coverageAreas.map((city: string) => ({
              city: city.trim()
            }))
          }
        }
      };
    } else if (role.toLowerCase() === 'service_provider') {
      userData.serviceProvider = { create: {} };
    }

    const newUser = await prisma.user.create({ data: userData });

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token,
      message: 'Uspešna registracija'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Greška pri registraciji' });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token je obavezan' });
    }

    const token = authHeader.substring(7);
    let userId;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      userId = decoded.userId;
    } catch (error) {
      return res.status(401).json({ error: 'Nevažeći token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        serviceProvider: {
          include: {
            categories: {
              include: {
                category: true
              }
            },
            coverageAreas: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Korisnik nije pronađen' });
    }

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      ...(user.serviceProvider && {
        serviceProvider: {
          id: user.serviceProvider.id,
          bio: user.serviceProvider.bio,
          experience: user.serviceProvider.experience,
          rating: user.serviceProvider.rating,
          totalReviews: user.serviceProvider.totalReviews,
          isVerified: user.serviceProvider.isVerified,
          categories: user.serviceProvider.categories.map(cat => ({
            id: cat.category.id,
            name: cat.category.name
          })),
          coverageAreas: user.serviceProvider.coverageAreas.map(area => area.city)
        }
      })
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Greška pri učitavanju profila' });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token je obavezan' });
    }

    const token = authHeader.substring(7);
    let userId;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      userId = decoded.userId;
    } catch (error) {
      return res.status(401).json({ error: 'Nevažeći token' });
    }

    const { name, phone, bio, experience, categories, coverageAreas, oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { serviceProvider: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'Korisnik nije pronađen' });
    }

    const updateData: any = { name, phone };

    if (oldPassword && newPassword) {
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isOldPasswordValid) {
        return res.status(400).json({ error: 'Stara šifra nije ispravna' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedNewPassword;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    if (user.serviceProvider && user.role === 'SERVICE_PROVIDER') {
      await prisma.serviceProvider.update({
        where: { id: user.serviceProvider.id },
        data: {
          bio,
          experience: parseInt(experience) || 0,
          categories: {
            deleteMany: {},
            create: categories.map((categoryId: number) => ({
              categoryId
            }))
          },
          coverageAreas: {
            deleteMany: {},
            create: coverageAreas.map((city: string) => ({
              city: city.trim()
            }))
          }
        }
      });
    }

    res.json({ message: 'Profil uspešno ažuriran' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Greška pri ažuriranju profila' });
  }
});

export default router;