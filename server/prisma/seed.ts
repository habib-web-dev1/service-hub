import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const seed = async () => {
  console.log("🌱 Starting database seed...");

  // --------------------------------------------------
  // 1. Hash passwords
  // --------------------------------------------------

  const password = await bcrypt.hash("Password123!", 12);

  // --------------------------------------------------
  // 2. Create users
  // --------------------------------------------------

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@servicehub.com",
    },
    update: {},
    create: {
      name: "ServiceHub Admin",
      email: "admin@servicehub.com",
      password,
      phone: "+8801700000001",
      role: "ADMIN",
    },
  });

  const provider = await prisma.user.upsert({
    where: {
      email: "provider@servicehub.com",
    },
    update: {},
    create: {
      name: "John Provider",
      email: "provider@servicehub.com",
      password,
      phone: "+8801700000002",
      role: "PROVIDER",
    },
  });

  const providerTwo = await prisma.user.upsert({
    where: {
      email: "provider2@servicehub.com",
    },
    update: {},
    create: {
      name: "Sarah Provider",
      email: "provider2@servicehub.com",
      password,
      phone: "+8801700000003",
      role: "PROVIDER",
    },
  });

  const customer = await prisma.user.upsert({
    where: {
      email: "customer@servicehub.com",
    },
    update: {},
    create: {
      name: "Alex Customer",
      email: "customer@servicehub.com",
      password,
      phone: "+8801700000004",
      role: "CUSTOMER",
    },
  });

  const customerTwo = await prisma.user.upsert({
    where: {
      email: "customer2@servicehub.com",
    },
    update: {},
    create: {
      name: "Emma Customer",
      email: "customer2@servicehub.com",
      password,
      phone: "+8801700000005",
      role: "CUSTOMER",
    },
  });

  console.log("✅ Users created");

  // --------------------------------------------------
  // 3. Create categories
  // --------------------------------------------------

  const plumbing = await prisma.category.upsert({
    where: {
      slug: "plumbing",
    },
    update: {},
    create: {
      name: "Plumbing",
      slug: "plumbing",
      description: "Professional residential and commercial plumbing services",
    },
  });

  const cleaning = await prisma.category.upsert({
    where: {
      slug: "cleaning",
    },
    update: {},
    create: {
      name: "Cleaning",
      slug: "cleaning",
      description: "Professional home and office cleaning services",
    },
  });

  const electrical = await prisma.category.upsert({
    where: {
      slug: "electrical",
    },
    update: {},
    create: {
      name: "Electrical",
      slug: "electrical",
      description: "Professional electrical installation and repair services",
    },
  });

  const photography = await prisma.category.upsert({
    where: {
      slug: "photography",
    },
    update: {},
    create: {
      name: "Photography",
      slug: "photography",
      description:
        "Professional photography services for events and special occasions",
    },
  });

  console.log("✅ Categories created");

  // --------------------------------------------------
  // 4. Create services
  // --------------------------------------------------

  await prisma.service.upsert({
    where: {
      id: "seed-plumbing-service",
    },
    update: {},
    create: {
      id: "seed-plumbing-service",
      title: "Home Plumbing Repair",
      description:
        "Professional plumbing repair for leaks, pipes, faucets, and other household plumbing problems.",
      price: 1500,
      duration: 120,
      categoryId: plumbing.id,
      providerId: provider.id,
    },
  });

  await prisma.service.upsert({
    where: {
      id: "seed-cleaning-service",
    },
    update: {},
    create: {
      id: "seed-cleaning-service",
      title: "Deep Home Cleaning",
      description: "Complete deep cleaning service for apartments and houses.",
      price: 2500,
      duration: 180,
      categoryId: cleaning.id,
      providerId: provider.id,
    },
  });

  await prisma.service.upsert({
    where: {
      id: "seed-electrical-service",
    },
    update: {},
    create: {
      id: "seed-electrical-service",
      title: "Electrical Repair",
      description:
        "Electrical troubleshooting, repair, wiring, switches, and socket installation.",
      price: 1800,
      duration: 120,
      categoryId: electrical.id,
      providerId: providerTwo.id,
    },
  });

  await prisma.service.upsert({
    where: {
      id: "seed-photography-service",
    },
    update: {},
    create: {
      id: "seed-photography-service",
      title: "Event Photography",
      description:
        "Professional photography coverage for birthdays, corporate events, and private parties.",
      price: 8000,
      duration: 240,
      categoryId: photography.id,
      providerId: providerTwo.id,
    },
  });

  console.log("✅ Services created");

  // --------------------------------------------------
  // 5. Summary
  // --------------------------------------------------

  console.log("");
  console.log("🌱 Database seed completed successfully!");
  console.log("");
  console.log("Seed accounts:");
  console.log(`Admin:      ${admin.email}`);
  console.log(`Provider:   ${provider.email}`);
  console.log(`Provider 2: ${providerTwo.email}`);
  console.log(`Customer:   ${customer.email}`);
  console.log(`Customer 2:  ${customerTwo.email}`);
  console.log("");
  console.log("Password for all seed accounts: Password123!");
};

seed()
  .catch((error) => {
    console.error("❌ Database seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
