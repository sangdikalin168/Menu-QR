// scripts/insertProducts.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, '../products.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw);
  const products = json.data;

  for (const prod of products) {
    await prisma.product.create({
      data: {
        name: prod.name,
        price: parseFloat(prod.price),
      },
    });
    console.log(`Inserted: ${prod.name}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
