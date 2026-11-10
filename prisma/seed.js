require("dotenv").config();
const prisma = require("../src/lib/prisma");

async function main() {
  for (const item of [
    { id: 1, name: "Buku", price: 12000 },
    { id: 2, name: "Pulpen", price: 5000 }
  ]) {
    await prisma.product.upsert({
      where: { id: item.id },
      update: { name: item.name, price: item.price },
      create: item
    });
  }
  console.log("Seed berhasil");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
