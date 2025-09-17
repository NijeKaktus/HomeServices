import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function checkDataExists() {
  const categoriesCount = await prisma.category.count();
  const usersCount = await prisma.user.count();

  return {
    hasCategories: categoriesCount > 0,
    hasUsers: usersCount > 0,
    categoriesCount,
    usersCount
  };
}

async function main() {
  console.log('Početak seeding-a...');

  const existingData = await checkDataExists();

  if (existingData.hasCategories && existingData.hasUsers) {
    console.log(`✓ Podaci već postoje (${existingData.categoriesCount} kategorija, ${existingData.usersCount} korisnika)`);
    console.log('Preskačem seeding jer podaci već postoje.');
    return;
  }

  console.log('Kreiram osnovne podatke...');

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Keramičar',
        description: 'Postavljanje pločica, keramike, popravke u kupatilu',
        icon: 'KER',
        services: {
          create: [
            { name: 'Postavljanje pločica', description: 'Profesionalno postavljanje pločica u kupatilu i kuhinji' },
            { name: 'Fugovanje', description: 'Fugovanje između pločica' }
          ]
        }
      }
    }),

    prisma.category.create({
      data: {
        name: 'Vodoinstalater',
        description: 'Popravka cevi, instalacija, kvariovi sa vodom',
        icon: 'VOD',
        services: {
          create: [
            { name: 'Popravka slavine', description: 'Popravka i zamena slavina' },
            { name: 'Čišćenje kanalizacije', description: 'Uklanjanje zapušenja iz cevi' }
          ]
        }
      }
    }),

    prisma.category.create({
      data: {
        name: 'Električar',
        description: 'Električne instalacije, popravke, ugradnja svetala',
        icon: 'ELE',
        services: {
          create: [
            { name: 'Ugradnja prekidača', description: 'Postavljanje prekidača i utičnica' },
            { name: 'Ugradnja lustera', description: 'Postavljanje lustera i svetala' }
          ]
        }
      }
    }),

    prisma.category.create({
      data: {
        name: 'Moler',
        description: 'Krečenje, gletovanje, dekorativne tehnike',
        icon: 'MOL',
        services: {
          create: [
            { name: 'Krečenje zidova', description: 'Farbanje i krečenje unutrašnjih zidova' },
            { name: 'Gletovanje', description: 'Gletovanje i priprema zidova za farbanje' }
          ]
        }
      }
    }),

    prisma.category.create({
      data: {
        name: 'Stolar',
        description: 'Izrada nameštaja, popravke, ugradnja elemenata',
        icon: 'STO',
        services: {
          create: [
            { name: 'Popravka nameštaja', description: 'Popravka stolica, stolova, ormara' },
            { name: 'Ugradnja polica', description: 'Izrada i ugradnja polica po meri' }
          ]
        }
      }
    }),

    prisma.category.create({
      data: {
        name: 'Klimatizer',
        description: 'Ugradnja i servis klima uređaja',
        icon: 'KLI',
        services: {
          create: [
            { name: 'Ugradnja klime', description: 'Montaža klima uređaja sa puštanjem u rad' },
            { name: 'Servis klime', description: 'Čišćenje i servisiranje klima uređaja' }
          ]
        }
      }
    })
  ]);

  console.log('Kategorije kreirane:', categories.length);

  const hashedPassword = await bcrypt.hash('test123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'marko.petrovic',
        email: 'marko.petrovic@email.com',
        password: hashedPassword,
        name: 'Marko Petrović',
        phone: '+381 64 123 4567',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Imam 15 godina iskustva u postavljanju pločica i keramike. Radim precizno i kvalitetno.',
            experience: 15,
            isVerified: true,
            categories: {
              create: [{ categoryId: categories[0].id }]
            },
            coverageAreas: {
              create: [
                { city: 'Novi Sad' },
                { city: 'Veternik' },
                { city: 'Futog' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'stefan.nikolic',
        email: 'stefan.nikolic@email.com',
        password: hashedPassword,
        name: 'Stefan Nikolić',
        phone: '+381 65 987 6543',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Vodoinstalater sa dugogodišnjim iskustvom. Brza intervencija 24h.',
            experience: 12,
            isVerified: true,
            categories: {
              create: [{ categoryId: categories[1].id }]
            },
            coverageAreas: {
              create: [
                { city: 'Novi Sad' },
                { city: 'Sremska Kamenica' },
                { city: 'Petrovaradin' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'jovana.markovic',
        email: 'jovana.markovic@email.com',
        password: hashedPassword,
        name: 'Jovana Marković',
        phone: '+381 63 456 7890',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Licencionani električar. Specijalizovana za stambene instalacije.',
            experience: 8,
            isVerified: true,
            categories: {
              create: [{ categoryId: categories[2].id }]
            },
            coverageAreas: {
              create: [
                { city: 'Novi Sad' },
                { city: 'Detelinara' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'milan.jovanovic',
        email: 'milan.jovanovic@email.com',
        password: hashedPassword,
        name: 'Milan Jovanović',
        phone: '+381 60 111 2222',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Moler-farbac sa 20 godina iskustva. Radim sa kvalitetnim bojama.',
            experience: 20,
            isVerified: false,
            categories: {
              create: [{ categoryId: categories[3].id }]
            },
            coverageAreas: {
              create: [
                { city: 'Novi Sad' },
                { city: 'Veternik' },
                { city: 'Futog' },
                { city: 'Begeč' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'petar.stojanovic',
        email: 'petar.stojanovic@email.com',
        password: hashedPassword,
        name: 'Petar Stojanović',
        phone: '+381 61 333 4444',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Stolar sa dugogodišnjim iskustvom u izradi nameštaja po meri.',
            experience: 18,
            isVerified: true,
            categories: {
              create: [{ categoryId: categories[4].id }]
            },
            coverageAreas: {
              create: [
                { city: 'Novi Sad' },
                { city: 'Sremska Kamenica' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'nikola.mitrovic',
        email: 'nikola.mitrovic@email.com',
        password: hashedPassword,
        name: 'Nikola Mitrović',
        phone: '+381 62 777 8888',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Specijalizovan za ugradnju i servis klima uređaja svih brendova.',
            experience: 10,
            isVerified: true,
            categories: {
              create: [{ categoryId: categories[5].id }]
            },
            coverageAreas: {
              create: [
                { city: 'Novi Sad' },
                { city: 'Futog' },
                { city: 'Veternik' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'vladimir.popovic',
        email: 'vladimir.popovic@email.com',
        password: hashedPassword,
        name: 'Vladimir Popović',
        phone: '+381 66 999 0000',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Multifunkcionalan majstor - radim elektriku, vodu i manje adaptacije.',
            experience: 22,
            isVerified: true,
            categories: {
              create: [
                { categoryId: categories[1].id },
                { categoryId: categories[2].id }
              ]
            },
            coverageAreas: {
              create: [
                { city: 'Novi Sad' },
                { city: 'Petrovaradin' },
                { city: 'Sremska Kamenica' },
                { city: 'Detelinara' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'dragan.milosavljevic',
        email: 'dragan.milosavljevic@email.com',
        password: hashedPassword,
        name: 'Dragan Milosavljević',
        phone: '+381 64 001 1111',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Keramičar sa 18 godina iskustva u Beogradu. Specijalizovan za luksuzna kupatila.',
            experience: 18,
            isVerified: true,
            categories: {
              create: [{ categoryId: categories[0].id }]
            },
            coverageAreas: {
              create: [
                { city: 'Beograd' },
                { city: 'Novi Beograd' },
                { city: 'Zemun' },
                { city: 'Zvezdara' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'milica.stankovic',
        email: 'milica.stankovic@email.com',
        password: hashedPassword,
        name: 'Milica Stanković',
        phone: '+381 65 002 2222',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Licencirani vodoinstalater. Hitne intervencije 24/7 po celom Beogradu.',
            experience: 14,
            isVerified: true,
            categories: {
              create: [{ categoryId: categories[1].id }]
            },
            coverageAreas: {
              create: [
                { city: 'Beograd' },
                { city: 'Čukarica' },
                { city: 'Voždovac' },
                { city: 'Rakovica' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'aleksandar.jovanovic',
        email: 'aleksandar.jovanovic@email.com',
        password: hashedPassword,
        name: 'Aleksandar Jovanović',
        phone: '+381 63 003 3333',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Električar sa atestom. Specijalizovan za pametne kuće i LED osvetljenje.',
            experience: 11,
            isVerified: true,
            categories: {
              create: [{ categoryId: categories[2].id }]
            },
            coverageAreas: {
              create: [
                { city: 'Beograd' },
                { city: 'Stari Grad' },
                { city: 'Vračar' },
                { city: 'Palilula' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'nenad.mitrovic',
        email: 'nenad.mitrovic@email.com',
        password: hashedPassword,
        name: 'Nenad Mitrović',
        phone: '+381 60 004 4444',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Moler-farbac sa 25 godina iskustva. Radim dekorativne tehnike i restauraciju.',
            experience: 25,
            isVerified: false,
            categories: {
              create: [{ categoryId: categories[3].id }]
            },
            coverageAreas: {
              create: [
                { city: 'Beograd' },
                { city: 'Savski Venac' },
                { city: 'Dorćol' },
                { city: 'Karaburma' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'marija.stojanovic',
        email: 'marija.stojanovic@email.com',
        password: hashedPassword,
        name: 'Marija Stojanović',
        phone: '+381 61 005 5555',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Stolar sa dugogodišnjim iskustvom u izradi kuhinja i garderoba po meri.',
            experience: 16,
            isVerified: true,
            categories: {
              create: [{ categoryId: categories[4].id }]
            },
            coverageAreas: {
              create: [
                { city: 'Beograd' },
                { city: 'Novi Beograd' },
                { city: 'Banovo Brdo' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'milos.nikolic',
        email: 'milos.nikolic@email.com',
        password: hashedPassword,
        name: 'Miloš Nikolić',
        phone: '+381 62 006 6666',
        role: UserRole.SERVICE_PROVIDER,
        serviceProvider: {
          create: {
            bio: 'Klimatizer sa atestom za sve brendove klima uređaja. Brz i pouzdan servis.',
            experience: 13,
            isVerified: true,
            categories: {
              create: [{ categoryId: categories[5].id }]
            },
            coverageAreas: {
              create: [
                { city: 'Beograd' },
                { city: 'Zemun' },
                { city: 'Surčin' },
                { city: 'Mladenovac' }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'ana.jovanovic',
        email: 'ana.jovanovic@email.com',
        password: hashedPassword,
        name: 'Ana Jovanović',
        phone: '+381 64 555 1111',
        role: UserRole.CUSTOMER,
        customer: {
          create: {
            address: 'Bulevar oslobođenja 123',
            city: 'Novi Sad'
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'marija.petrovic',
        email: 'marija.petrovic@email.com',
        password: hashedPassword,
        name: 'Marija Petrović',
        phone: '+381 63 222 3333',
        role: UserRole.CUSTOMER,
        customer: {
          create: {
            address: 'Futoška ulica 45',
            city: 'Novi Sad'
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'stefan.milenkovic',
        email: 'stefan.milenkovic@email.com',
        password: hashedPassword,
        name: 'Stefan Milenković',
        phone: '+381 65 444 5555',
        role: UserRole.CUSTOMER,
        customer: {
          create: {
            address: 'Jovana Ducića 12',
            city: 'Novi Sad'
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@homeservices.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Administrator',
        phone: '+381 11 000 0000',
        role: UserRole.ADMIN,
        admin: {
          create: {
            permissions: 'all'
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'milica.jovanovic',
        email: 'milica.jovanovic@email.com',
        password: hashedPassword,
        name: 'Milica Jovanović',
        phone: '+381 64 777 1111',
        role: UserRole.CUSTOMER,
        customer: {
          create: {
            address: 'Knez Mihailova 25',
            city: 'Beograd'
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'stefan.mitrovic',
        email: 'stefan.mitrovic@email.com',
        password: hashedPassword,
        name: 'Stefan Mitrović',
        phone: '+381 63 888 2222',
        role: UserRole.CUSTOMER,
        customer: {
          create: {
            address: 'Bulevar kralja Aleksandra 45',
            city: 'Beograd'
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        username: 'jovana.nikolic',
        email: 'jovana.nikolic@email.com',
        password: hashedPassword,
        name: 'Jovana Nikolić',
        phone: '+381 65 999 3333',
        role: UserRole.CUSTOMER,
        customer: {
          create: {
            address: 'Terazije 12',
            city: 'Beograd'
          }
        }
      }
    })
  ]);

  console.log('Korisnici kreirani:', users.length);





  const updateProviderStats = async () => {
    const allProviders = await prisma.serviceProvider.findMany({
      include: { reviews: true }
    });

    for (const provider of allProviders) {
      const totalReviews = provider.reviews.length;
      const avgRating = totalReviews > 0
        ? provider.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

      await prisma.serviceProvider.update({
        where: { id: provider.id },
        data: {
          totalReviews,
          rating: Math.round(avgRating * 10) / 10
        }
      });
    }
  };

  await updateProviderStats();
  console.log('Statistike majstora ažurirane');

  console.log('Seeding završen uspešno!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });