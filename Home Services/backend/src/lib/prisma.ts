import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('✓ Uspešno povezano sa MySQL bazom')
  } catch (error) {
    console.error('✗ Greška pri povezivanju sa bazom:', error)
    throw error
  }
}

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect()
    console.log('✓ Konekcija sa bazom zatvorena')
  } catch (error) {
    console.error('✗ Greška pri zatvaranju konekcije:', error)
  }
}