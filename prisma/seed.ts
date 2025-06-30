import { PrismaClient, UserRole, TruckStatus, ShipmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create test users
  const testUsers = [
    {
      email: 'admin@maroctransit.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      phone: '+212600000000',
      isActive: true,
    },
    {
      email: 'driver@maroctransit.com',
      password: hashedPassword,
      firstName: 'Driver',
      lastName: 'User',
      role: UserRole.DRIVER,
      phone: '+212600000001',
      isActive: true,
    },
    {
      email: 'user@maroctransit.com',
      password: hashedPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: UserRole.USER,
      phone: '+212600000002',
      isActive: true,
    },
    {
      email: 'company@maroctransit.com',
      password: hashedPassword,
      firstName: 'Company',
      lastName: 'User',
      role: UserRole.COMPANY,
      phone: '+212600000003',
      isActive: true,
    },
  ];

  for (const userData of testUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: userData
      });
      console.log(`✅ Created user: ${userData.email}`);
    } else {
      console.log(`⏭️  User already exists: ${userData.email}`);
    }
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@maroctransit.ma' },
    update: {},
    create: {
      email: 'admin@maroctransit.ma',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
      profile: {
        create: {
          address: '123 Admin Street',
          city: 'Casablanca',
          postalCode: '20000',
          country: 'Morocco',
        },
      },
    },
  });

  // Create test driver
  const driverPassword = await bcrypt.hash('driver123', 12);
  const driver = await prisma.user.upsert({
    where: { email: 'driver@maroctransit.ma' },
    update: {},
    create: {
      email: 'driver@maroctransit.ma',
      password: driverPassword,
      firstName: 'Ahmed',
      lastName: 'Benali',
      role: UserRole.DRIVER,
      phone: '+212612345678',
      profile: {
        create: {
          address: '456 Driver Lane',
          city: 'Rabat',
          postalCode: '10000',
          country: 'Morocco',
          licenseNumber: 'DL123456789',
        },
      },
    },
  });

  // Create test company
  const company = await prisma.company.create({
    data: {
      name: 'Morocco Logistics Ltd',
      email: 'contact@morocolog.ma',
      phone: '+212522123456',
      address: '789 Business District',
      city: 'Casablanca',
      postalCode: '20100',
      taxId: 'TIN12345678',
      isVerified: true,
      ownerId: admin.id,
    },
  });

  // Create sample trucks
  const truck1 = await prisma.truck.create({
    data: {
      licensePlate: 'A-12345-20',
      model: 'Mercedes Actros',
      make: 'Mercedes-Benz',
      year: 2020,
      capacity: 25.0,
      status: TruckStatus.AVAILABLE,
      currentLocation: 'Casablanca',
      driverId: driver.id,
      companyId: company.id,
    },
  });

  const truck2 = await prisma.truck.create({
    data: {
      licensePlate: 'A-67890-21',
      model: 'Volvo FH16',
      make: 'Volvo',
      year: 2021,
      capacity: 30.0,
      status: TruckStatus.AVAILABLE,
      currentLocation: 'Rabat',
      companyId: company.id,
    },
  });

  // Create test customers
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@example.com',
      password: customerPassword,
      firstName: 'Fatima',
      lastName: 'Zahra',
      role: UserRole.USER,
      phone: '+212661234567',
      profile: {
        create: {
          address: '123 Customer Street',
          city: 'Marrakech',
          postalCode: '40000',
          country: 'Morocco',
        },
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@example.com',
      password: customerPassword,
      firstName: 'Youssef',
      lastName: 'Alami',
      role: UserRole.USER,
      phone: '+212662345678',
      profile: {
        create: {
          address: '456 Business Ave',
          city: 'Tangier',
          postalCode: '90000',
          country: 'Morocco',
        },
      },
    },
  });

  // Create sample shipments
  const shipment1 = await prisma.shipment.create({
    data: {
      trackingNumber: 'MT-2024-001',
      status: ShipmentStatus.IN_TRANSIT,
      pickupAddress: '123 Pickup Street',
      pickupCity: 'Casablanca',
      pickupPostal: '20000',
      pickupContact: 'Mohammed Benali',
      pickupPhone: '+212522111222',
      deliveryAddress: '789 Delivery Road',
      deliveryCity: 'Rabat',
      deliveryPostal: '10000',
      deliveryContact: 'Aicha Fassi',
      deliveryPhone: '+212537333444',
      weight: 1500.0,
      description: 'Electronics and appliances',
      price: 850.0,
      currency: 'MAD',
      senderId: customer1.id,
      receiverId: customer2.id,
      truckId: truck1.id,
      companyId: company.id,
      estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    },
  });

  // Create tracking events for the shipment
  await prisma.trackingEvent.createMany({
    data: [
      {
        shipmentId: shipment1.id,
        event: 'PICKUP_SCHEDULED',
        location: 'Casablanca',
        description: 'Pickup scheduled for tomorrow morning',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        shipmentId: shipment1.id,
        event: 'PICKED_UP',
        location: 'Casablanca',
        description: 'Package picked up successfully',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        shipmentId: shipment1.id,
        event: 'IN_TRANSIT',
        location: 'Highway A1',
        description: 'Package in transit to destination',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
    ],
  });

  // Create sample routes
  await prisma.route.createMany({
    data: [
      {
        name: 'Casablanca - Rabat Express',
        origin: 'Casablanca',
        destination: 'Rabat',
        distance: 95.0,
        estimatedTime: 90,
        tollCost: 15.0,
        fuelCost: 45.0,
      },
      {
        name: 'Rabat - Tangier Highway',
        origin: 'Rabat',
        destination: 'Tangier',
        distance: 320.0,
        estimatedTime: 240,
        tollCost: 35.0,
        fuelCost: 120.0,
      },
      {
        name: 'Casablanca - Marrakech Route',
        origin: 'Casablanca',
        destination: 'Marrakech',
        distance: 240.0,
        estimatedTime: 180,
        tollCost: 25.0,
        fuelCost: 95.0,
      },
    ],
  });

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Test Accounts:');
  console.log('Email: admin@maroctransit.com | Password: password123 | Role: Admin');
  console.log('Email: driver@maroctransit.com | Password: password123 | Role: Driver');
  console.log('Email: user@maroctransit.com | Password: password123 | Role: User');
  console.log('Email: company@maroctransit.com | Password: password123 | Role: Company');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
