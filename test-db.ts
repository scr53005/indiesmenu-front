import { PrismaClient } from './app/generated/prisma';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    const dishes = await prisma.dishes.findMany();
    console.log('Dishes:', dishes);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();