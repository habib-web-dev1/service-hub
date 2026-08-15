import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/client.js";
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
  console.log("🌱 Starting database seed...\n");

  // ==================================================
  // 1. HASH PASSWORD
  // ==================================================

  const password = await bcrypt.hash("Password123!", 12);

  // ==================================================
  // 2. CREATE USERS
  // ==================================================

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

  const providerThree = await prisma.user.upsert({
    where: {
      email: "provider3@servicehub.com",
    },
    update: {},
    create: {
      name: "Michael Provider",
      email: "provider3@servicehub.com",
      password,
      phone: "+8801700000006",
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

  const customerThree = await prisma.user.upsert({
    where: {
      email: "customer3@servicehub.com",
    },
    update: {},
    create: {
      name: "Daniel Customer",
      email: "customer3@servicehub.com",
      password,
      phone: "+8801700000007",
      role: "CUSTOMER",
    },
  });

  console.log("✅ Users created");

  // ==================================================
  // 3. CREATE CATEGORIES
  // ==================================================

  const plumbing = await prisma.category.upsert({
    where: {
      slug: "plumbing",
    },
    update: {},
    create: {
      name: "Plumbing",
      slug: "plumbing",
      description:
        "Professional plumbing services for homes, apartments, and businesses.",
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
      description: "Reliable home, office, and commercial cleaning services.",
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
      description:
        "Professional electrical installation, maintenance, and repair services.",
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
        "Professional photography services for events, weddings, and special occasions.",
    },
  });

  const homeMaintenance = await prisma.category.upsert({
    where: {
      slug: "home-maintenance",
    },
    update: {},
    create: {
      name: "Home Maintenance",
      slug: "home-maintenance",
      description:
        "Professional maintenance and repair services for your home.",
    },
  });

  console.log("✅ Categories created");

  // ==================================================
  // 4. CREATE SERVICES
  // ==================================================

  const services = [
    // ------------------------------------------------
    // PLUMBING
    // ------------------------------------------------

    {
      id: "seed-plumbing-service",
      title: "Home Plumbing Repair",
      description:
        "Professional plumbing repair for leaks, pipes, faucets, and other household plumbing problems.",
      imageUrl:
        "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80",
      price: 1500,
      duration: 120,
      categoryId: plumbing.id,
      providerId: provider.id,
    },

    {
      id: "seed-bathroom-plumbing",
      title: "Bathroom Pipe Installation",
      description:
        "Professional installation and replacement of bathroom water supply and drainage pipes.",
      imageUrl:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      price: 2200,
      duration: 150,
      categoryId: plumbing.id,
      providerId: provider.id,
    },

    {
      id: "seed-water-tap-repair",
      title: "Faucet & Tap Repair",
      description:
        "Repair and replacement of leaking faucets, taps, valves, and related plumbing fixtures.",
      imageUrl:
        "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=80",
      price: 1000,
      duration: 90,
      categoryId: plumbing.id,
      providerId: providerThree.id,
    },

    {
      id: "seed-drain-cleaning",
      title: "Drain Cleaning",
      description:
        "Professional drain cleaning service to remove blockages and restore proper water flow.",
      imageUrl:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      price: 1300,
      duration: 90,
      categoryId: plumbing.id,
      providerId: providerThree.id,
    },

    // ------------------------------------------------
    // CLEANING
    // ------------------------------------------------

    {
      id: "seed-cleaning-service",
      title: "Deep Home Cleaning",
      description: "Complete deep cleaning service for apartments and houses.",
      imageUrl:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
      price: 2500,
      duration: 180,
      categoryId: cleaning.id,
      providerId: provider.id,
    },

    {
      id: "seed-office-cleaning",
      title: "Office Cleaning",
      description:
        "Professional cleaning service for offices, workspaces, and commercial properties.",
      imageUrl:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      price: 3000,
      duration: 180,
      categoryId: cleaning.id,
      providerId: providerTwo.id,
    },

    {
      id: "seed-kitchen-cleaning",
      title: "Kitchen Cleaning",
      description:
        "Detailed kitchen cleaning including countertops, cabinets, appliances, and floors.",
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80",
      price: 1800,
      duration: 120,
      categoryId: cleaning.id,
      providerId: providerTwo.id,
    },

    {
      id: "seed-window-cleaning",
      title: "Window Cleaning",
      description:
        "Professional interior and exterior window cleaning for homes and offices.",
      imageUrl:
        "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80",
      price: 1500,
      duration: 120,
      categoryId: cleaning.id,
      providerId: providerThree.id,
    },

    // ------------------------------------------------
    // ELECTRICAL
    // ------------------------------------------------

    {
      id: "seed-electrical-service",
      title: "Electrical Repair",
      description:
        "Electrical troubleshooting, repair, wiring, switches, and socket installation.",
      imageUrl:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
      price: 1800,
      duration: 120,
      categoryId: electrical.id,
      providerId: providerTwo.id,
    },

    {
      id: "seed-fan-installation",
      title: "Ceiling Fan Installation",
      description:
        "Safe and professional ceiling fan installation and electrical connection.",
      imageUrl:
        "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1200&q=80",
      price: 1200,
      duration: 90,
      categoryId: electrical.id,
      providerId: provider.id,
    },

    {
      id: "seed-light-installation",
      title: "Light Fixture Installation",
      description:
        "Installation of ceiling lights, wall lights, LED fixtures, and decorative lighting.",
      imageUrl:
        "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1200&q=80",
      price: 1400,
      duration: 90,
      categoryId: electrical.id,
      providerId: providerThree.id,
    },

    {
      id: "seed-wiring-service",
      title: "Home Wiring Service",
      description:
        "Professional electrical wiring installation and troubleshooting for residential properties.",
      imageUrl:
        "https://images.unsplash.com/photo-1555963966-b7ae5401b6b3?auto=format&fit=crop&w=1200&q=80",
      price: 3500,
      duration: 240,
      categoryId: electrical.id,
      providerId: providerTwo.id,
    },

    // ------------------------------------------------
    // PHOTOGRAPHY
    // ------------------------------------------------

    {
      id: "seed-photography-service",
      title: "Event Photography",
      description:
        "Professional photography coverage for birthdays, corporate events, and private parties.",
      imageUrl:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      price: 8000,
      duration: 240,
      categoryId: photography.id,
      providerId: providerTwo.id,
    },

    {
      id: "seed-wedding-photography",
      title: "Wedding Photography",
      description:
        "Professional wedding photography capturing important moments throughout your special day.",
      imageUrl:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      price: 15000,
      duration: 360,
      categoryId: photography.id,
      providerId: providerTwo.id,
    },

    {
      id: "seed-portrait-photography",
      title: "Portrait Photography",
      description:
        "Professional portrait photography for personal branding, profiles, and special occasions.",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      price: 4000,
      duration: 120,
      categoryId: photography.id,
      providerId: providerThree.id,
    },

    {
      id: "seed-product-photography",
      title: "Product Photography",
      description:
        "High-quality product photography for online stores, catalogs, advertisements, and businesses.",
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      price: 5000,
      duration: 180,
      categoryId: photography.id,
      providerId: provider.id,
    },

    // ------------------------------------------------
    // HOME MAINTENANCE
    // ------------------------------------------------

    {
      id: "seed-furniture-assembly",
      title: "Furniture Assembly",
      description:
        "Professional assembly of beds, tables, chairs, cabinets, shelves, and other furniture.",
      imageUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      price: 1800,
      duration: 120,
      categoryId: homeMaintenance.id,
      providerId: provider.id,
    },

    {
      id: "seed-wall-painting",
      title: "Interior Wall Painting",
      description:
        "Professional interior wall painting service with clean preparation and finishing.",
      imageUrl:
        "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80",
      price: 5000,
      duration: 300,
      categoryId: homeMaintenance.id,
      providerId: providerTwo.id,
    },

    {
      id: "seed-ac-installation",
      title: "Air Conditioner Installation",
      description:
        "Professional split AC installation, setup, and basic testing for residential properties.",
      imageUrl:
        "https://images.unsplash.com/photo-1631545806609-0b4e8e5b4f3f?auto=format&fit=crop&w=1200&q=80",
      price: 3500,
      duration: 180,
      categoryId: homeMaintenance.id,
      providerId: providerThree.id,
    },

    {
      id: "seed-home-repair",
      title: "General Home Repair",
      description:
        "General household repair service for minor fixtures, fittings, shelves, doors, and other maintenance tasks.",
      imageUrl:
        "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=80",
      price: 2000,
      duration: 150,
      categoryId: homeMaintenance.id,
      providerId: provider.id,
    },
  ];

  // ==================================================
  // INSERT SERVICES
  // ==================================================

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        id: service.id,
      },

      update: {
        title: service.title,
        description: service.description,
        imageUrl: service.imageUrl,
        price: service.price,
        duration: service.duration,
        categoryId: service.categoryId,
        providerId: service.providerId,
        isActive: true,
        isDeleted: false,
        deletedAt: null,
      },

      create: {
        id: service.id,
        title: service.title,
        description: service.description,
        imageUrl: service.imageUrl,
        price: service.price,
        duration: service.duration,
        categoryId: service.categoryId,
        providerId: service.providerId,
      },
    });
  }

  console.log(`✅ ${services.length} services created`);

  // ==================================================
  // 5. SUMMARY
  // ==================================================

  console.log("");
  console.log("==============================================");
  console.log("🌱 DATABASE SEED COMPLETED SUCCESSFULLY");
  console.log("==============================================");
  console.log("");

  console.log("👤 Admin:");
  console.log(`   ${admin.email}`);

  console.log("");
  console.log("👨‍🔧 Providers:");
  console.log(`   ${provider.email}`);
  console.log(`   ${providerTwo.email}`);
  console.log(`   ${providerThree.email}`);

  console.log("");
  console.log("👥 Customers:");
  console.log(`   ${customer.email}`);
  console.log(`   ${customerTwo.email}`);
  console.log(`   ${customerThree.email}`);

  console.log("");
  console.log("📦 Categories: 5");
  console.log(`🛠️ Services: ${services.length}`);

  console.log("");
  console.log("🔑 Password for all seed accounts:");
  console.log("   Password123!");

  console.log("");
  console.log("==============================================");
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
