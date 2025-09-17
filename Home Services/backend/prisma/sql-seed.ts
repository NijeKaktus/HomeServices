import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Kreiranje podataka kroz SQL...');

  const hashedPassword = await bcrypt.hash('123456', 10);

  try {
    // Čišćenje tabela
    await prisma.$executeRaw`DELETE FROM reviews`;
    await prisma.$executeRaw`DELETE FROM service_provider_categories`;
    await prisma.$executeRaw`DELETE FROM coverage_areas`;
    await prisma.$executeRaw`DELETE FROM services`;
    await prisma.$executeRaw`DELETE FROM customers`;
    await prisma.$executeRaw`DELETE FROM service_providers`;
    await prisma.$executeRaw`DELETE FROM admins`;
    await prisma.$executeRaw`DELETE FROM users`;
    await prisma.$executeRaw`DELETE FROM categories`;

    // Reset AUTO_INCREMENT
    await prisma.$executeRaw`ALTER TABLE categories AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE users AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE customers AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE service_providers AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE services AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE reviews AUTO_INCREMENT = 1`;

    console.log('Dodavanje kategorija...');

    // Kategorije
    await prisma.$executeRaw`
      INSERT INTO categories (name, description, icon, isActive) VALUES
      ('Keramičar', 'Postavljanje pločica, keramike, popravke u kupatilu', 'KER', true),
      ('Vodoinstalater', 'Popravka cevi, instalacija, kvariovi sa vodom', 'VOD', true),
      ('Električar', 'Električne instalacije, popravke, ugradnja svetala', 'ELE', true),
      ('Moler', 'Krečenje, gletovanje, dekorativne tehnike', 'MOL', true),
      ('Stolar', 'Izrada nameštaja, popravke, ugradnja elemenata', 'STO', true),
      ('Klimatizar', 'Ugradnja i servis klima uređaja', 'KLI', true)
    `;

    console.log('Dodavanje usluga...');

    // Usluge
    await prisma.$executeRaw`
      INSERT INTO services (categoryId, name, description, basePrice, unit, isActive) VALUES
      (1, 'Postavljanje pločica', 'Profesionalno postavljanje pločica u kupatilu i kuhinji', 800, 'm2', true),
      (1, 'Fugovanje', 'Fugovanje između pločica', 200, 'm2', true),
      (2, 'Popravka slavine', 'Popravka i zamena slavina', 1500, 'kom', true),
      (2, 'Čišćenje kanalizacije', 'Uklanjanje zapušenja iz cevi', 2000, 'intervencija', true),
      (3, 'Ugradnja prekidača', 'Postavljanje prekidača i utičnica', 800, 'kom', true),
      (3, 'Ugradnja lustera', 'Postavljanje lustera i svetala', 1200, 'kom', true),
      (4, 'Krečenje zidova', 'Farbanje i krečenje unutrašnjih zidova', 300, 'm2', true),
      (4, 'Gletovanje', 'Gletovanje i priprema zidova za farbanje', 250, 'm2', true),
      (5, 'Popravka nameštaja', 'Popravka stolica, stolova, ormara', 1000, 'kom', true),
      (5, 'Ugradnja polica', 'Izrada i ugradnja polica po meri', 1500, 'kom', true),
      (6, 'Ugradnja klime', 'Montaža klima uređaja sa puštanjem u rad', 8000, 'kom', true),
      (6, 'Servis klime', 'Čišćenje i servis postojećih klima uređaja', 3000, 'kom', true)
    `;

    console.log('Dodavanje korisnika...');

    // Korisnici - mušterije
    await prisma.$executeRaw`
      INSERT INTO users (username, email, password, name, phone, role, createdAt, updatedAt) VALUES
      ('marko123', 'marko@test.com', ${hashedPassword}, 'Marko Petrović', '+381 60 123 4567', 'CUSTOMER', NOW(), NOW()),
      ('ana_novak', 'ana@test.com', ${hashedPassword}, 'Ana Novak', '+381 61 234 5678', 'CUSTOMER', NOW(), NOW()),
      ('petar_milic', 'petar@test.com', ${hashedPassword}, 'Petar Milić', '+381 62 345 6789', 'CUSTOMER', NOW(), NOW())
    `;

    // Mušterije
    await prisma.$executeRaw`
      INSERT INTO customers (userId, address, city) VALUES
      (1, 'Kneza Miloša 12', 'Beograd'),
      (2, 'Bulevar oslobođenja 45', 'Novi Sad'),
      (3, 'Cara Lazara 8', 'Niš')
    `;

    // Majstori
    await prisma.$executeRaw`
      INSERT INTO users (username, email, password, name, phone, role, createdAt, updatedAt) VALUES
      ('stefan_keramicar', 'stefan@test.com', ${hashedPassword}, 'Stefan Nikolić', '+381 63 987 6543', 'SERVICE_PROVIDER', NOW(), NOW()),
      ('milan_vodoinstalater', 'milan@test.com', ${hashedPassword}, 'Milan Jovanović', '+381 64 111 2222', 'SERVICE_PROVIDER', NOW(), NOW()),
      ('nikola_elektricar', 'nikola@test.com', ${hashedPassword}, 'Nikola Stojanović', '+381 65 333 4444', 'SERVICE_PROVIDER', NOW(), NOW()),
      ('aleksandar_moler', 'aleksandar@test.com', ${hashedPassword}, 'Aleksandar Mitrović', '+381 66 555 6666', 'SERVICE_PROVIDER', NOW(), NOW()),
      ('vladimir_stolar', 'vladimir@test.com', ${hashedPassword}, 'Vladimir Radić', '+381 67 777 8888', 'SERVICE_PROVIDER', NOW(), NOW())
    `;

    await prisma.$executeRaw`
      INSERT INTO service_providers (userId, bio, experience, rating, totalReviews, isVerified) VALUES
      (4, 'Iskusan keramičar sa 10 godina rada. Specijalizovan za kupatila i kuhinje.', 10, 0, 0, true),
      (5, 'Profesionalni vodoinstalater. Brze intervencije 24/7.', 15, 0, 0, true),
      (6, 'Diplomirani električar sa licencom.', 8, 0, 0, false),
      (7, 'Kreativni moler sa strašću prema savršenstvu.', 12, 0, 0, true),
      (8, 'Majstorski stolar. Radim nameštaj po meri.', 20, 0, 0, true)
    `;

    // Povezivanje majstora sa kategorijama
    await prisma.$executeRaw`
      INSERT INTO service_provider_categories (serviceProviderId, categoryId) VALUES
      (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)
    `;

    // Oblasti rada
    await prisma.$executeRaw`
      INSERT INTO coverage_areas (serviceProviderId, city) VALUES
      (1, 'Beograd'), (1, 'Novi Sad'),
      (2, 'Beograd'), (2, 'Pančevo'), (2, 'Smederevo'),
      (3, 'Beograd'),
      (4, 'Novi Sad'), (4, 'Subotica'),
      (5, 'Beograd'), (5, 'Kragujevac')
    `;

    // Admin korisnik
    await prisma.$executeRaw`
      INSERT INTO users (username, email, password, name, phone, role, createdAt, updatedAt) VALUES
      ('admin', 'admin@homeservices.rs', ${hashedPassword}, 'Sistem Administrator', '+381 11 000 0000', 'ADMIN', NOW(), NOW())
    `;

    await prisma.$executeRaw`
      INSERT INTO admins (userId, permissions) VALUES (9, 'all')
    `;

    console.log('Dodavanje ocena...');

    // Ocene za majstore
    const reviews = [
      [1, 1, 5, "Odličan rad, brzo i kvalitetno urađeno. Preporučujem!", "2025-03-15"],
      [1, 2, 4, "Zadovoljan sam uslugom, stigao je na vreme.", "2025-04-20"],
      [1, 3, 5, "Vrhunski majstor! Sve u dogovorenom roku.", "2025-05-10"],
      [2, 1, 4, "Dobar rad, preporučujem.", "2025-02-28"],
      [2, 2, 5, "Izuzetan pristup i kvalitet rada.", "2025-06-05"],
      [2, 3, 3, "U redu je rad, moglo je malo bolje.", "2025-07-12"],
      [3, 1, 5, "Bez zamerke! Tačan i precizan.", "2025-01-25"],
      [3, 2, 4, "Veoma sam zadovoljan rezultatom.", "2025-08-14"],
      [4, 1, 5, "TOP! Brz, precizan i povoljno.", "2025-03-08"],
      [4, 3, 4, "Jako dobro urađeno, majstor zna posao.", "2025-05-22"],
      [5, 2, 5, "Fenomenalno! Stigao tačno kad je rekao.", "2025-04-18"],
      [5, 1, 4, "Solid majstor, vredan je para.", "2025-06-30"]
    ];

    for (const [providerId, customerId, rating, comment, date] of reviews) {
      await prisma.$executeRaw`
        INSERT INTO reviews (serviceProviderId, customerId, rating, comment, createdAt) VALUES
        (${providerId}, ${customerId}, ${rating}, ${comment}, ${date})
      `;
    }

    // Ažuriranje proseka ocena
    await prisma.$executeRaw`
      UPDATE service_providers sp SET
        rating = (SELECT AVG(r.rating) FROM reviews r WHERE r.serviceProviderId = sp.id),
        totalReviews = (SELECT COUNT(*) FROM reviews r WHERE r.serviceProviderId = sp.id)
      WHERE sp.id IN (1,2,3,4,5)
    `;

    console.log('✅ Svi podaci su uspešno dodani!');
    console.log(`
Kreiran kompletan sistem:
- 5 majstora sa ocenama i prosecima
- 3 mušterije
- 6 kategorija sa uslugama
- 1 admin korisnik
- 12 realističnih ocena

Testni nalozi (šifra: 123456):
Mušterije: marko123, ana_novak, petar_milic
Majstori: stefan_keramicar, milan_vodoinstalater, nikola_elektricar, aleksandar_moler, vladimir_stolar
Admin: admin
    `);

  } catch (error) {
    console.error('Greška pri kreiranju podataka:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });