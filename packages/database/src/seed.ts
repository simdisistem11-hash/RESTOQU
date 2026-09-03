import { PrismaClient, SystemRole, SubscriptionPlanTier, ServicePointStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting RestoQu database seed...');

  // 1. Seed SaaS Plans
  const starterPlan = await prisma.plan.upsert({
    where: { id: 'plan-starter' },
    update: {},
    create: {
      id: 'plan-starter',
      name: 'Starter Plan',
      tier: SubscriptionPlanTier.STARTER,
      monthlyPrice: 199000,
      maxOutlets: 1,
      maxServicePoints: 15,
      maxUsers: 5,
      maxMenuProducts: 50,
      features: { qrMenu: true, kds: true, cashier: true, inventory: false }
    }
  });

  const proPlan = await prisma.plan.upsert({
    where: { id: 'plan-pro' },
    update: {},
    create: {
      id: 'plan-pro',
      name: 'Professional Plan',
      tier: SubscriptionPlanTier.PROFESSIONAL,
      monthlyPrice: 399000,
      maxOutlets: 3,
      maxServicePoints: 50,
      maxUsers: 15,
      maxMenuProducts: 200,
      features: { qrMenu: true, kds: true, cashier: true, inventory: true, calling: true }
    }
  });

  // 2. Seed Super Admin User
  const adminPassword = 'admin123';
  await prisma.user.upsert({
    where: { email: 'admin@restoqu.app' },
    update: { passwordHash: adminPassword },
    create: {
      name: 'Super Admin RestoQu',
      email: 'admin@restoqu.app',
      passwordHash: adminPassword,
      role: SystemRole.SUPER_ADMIN,
      isActive: true
    }
  });

  // 3. Seed Demo Tenant: Bismillah Resto
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'bismillah-resto' },
    update: {},
    create: {
      name: 'Bismillah Resto',
      slug: 'bismillah-resto',
      primaryColor: '#10b981',
      secondaryColor: '#1e293b',
      logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&auto=format&fit=crop&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      settings: {
        create: {
          currency: 'IDR',
          timezone: 'Asia/Jakarta',
          taxPercentage: 10.0,
          servicePercentage: 5.0,
          callingVoiceGender: 'FEMALE',
          receiptHeader: 'Bismillah Resto - Sumenep\nJl. Trunojoyo No. 45',
          receiptFooter: 'Terima kasih atas kunjungan Anda!\nFollow Instagram: @bismillahresto'
        }
      }
    }
  });

  // Create Subscription
  const existingSub = await prisma.subscription.findFirst({
    where: { tenantId: tenant.id }
  });

  if (!existingSub) {
    await prisma.subscription.create({
      data: {
        tenantId: tenant.id,
        planId: proPlan.id,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    });
  }

  // 4. Seed Outlet
  const outlet = await prisma.outlet.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: 'SUM01' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Outlet Sumenep',
      code: 'SUM01',
      address: 'Jl. Trunojoyo No. 45, Sumenep, Madura',
      phone: '081234567890'
    }
  });

  // 5. Seed Staff Users for Tenant with EXPLICIT PLAINTEXT PASSWORDS
  const staffUsers = [
    { name: 'Ahmad Owner', email: 'owner@bismillah.com', role: SystemRole.RESTAURANT_OWNER, password: 'owner123' },
    { name: 'Siti Manager', email: 'manager@bismillah.com', role: SystemRole.MANAGER, password: 'manager123' },
    { name: 'Budi Kasir', email: 'cashier@bismillah.com', role: SystemRole.CASHIER, password: 'cashier123' },
    { name: 'Chef Joko', email: 'kitchen@bismillah.com', role: SystemRole.KITCHEN, password: 'kitchen123' },
    { name: 'Rudi Waiter', email: 'waiter@bismillah.com', role: SystemRole.WAITER, password: 'waiter123' },
    { name: 'Dewi Inventory', email: 'inventory@bismillah.com', role: SystemRole.INVENTORY_STAFF, password: 'inventory123' }
  ];

  for (const s of staffUsers) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: { passwordHash: s.password },
      create: {
        tenantId: tenant.id,
        outletId: outlet.id,
        name: s.name,
        email: s.email,
        passwordHash: s.password,
        role: s.role,
        isActive: true
      }
    });
  }

  // 6. Seed Service Point Types & Service Points
  const mejaType = await prisma.servicePointType.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: 'MEJA' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Meja', code: 'MEJA' }
  });

  const vipType = await prisma.servicePointType.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: 'VIP' } },
    update: {},
    create: { tenantId: tenant.id, name: 'VIP Room', code: 'VIP' }
  });

  // Create Service Points with predictable QR Secret Keys
  const servicePointsData = [
    { internalCode: 'M01', displayName: 'Meja 01', typeId: mejaType.id, capacity: 4, area: 'Indoor Utama', qrSecretKey: 'qr-bismillah-m01' },
    { internalCode: 'M02', displayName: 'Meja 02', typeId: mejaType.id, capacity: 4, area: 'Indoor Utama', qrSecretKey: 'qr-bismillah-m02' },
    { internalCode: 'M03', displayName: 'Meja 03', typeId: mejaType.id, capacity: 6, area: 'Outdoor Terrace', qrSecretKey: 'qr-bismillah-m03' },
    { internalCode: 'VIP01', displayName: 'VIP Keluarga', typeId: vipType.id, capacity: 10, area: 'Lantai 2 VIP', qrSecretKey: 'qr-bismillah-vip01' }
  ];

  for (const sp of servicePointsData) {
    await prisma.servicePoint.upsert({
      where: { tenantId_outletId_internalCode: { tenantId: tenant.id, outletId: outlet.id, internalCode: sp.internalCode } },
      update: {},
      create: {
        tenantId: tenant.id,
        outletId: outlet.id,
        typeId: sp.typeId,
        internalCode: sp.internalCode,
        displayName: sp.displayName,
        capacity: sp.capacity,
        area: sp.area,
        qrSecretKey: sp.qrSecretKey,
        status: ServicePointStatus.AVAILABLE
      }
    });
  }

  // 7. Seed Categories
  const catMakanan = await prisma.category.create({
    data: { tenantId: tenant.id, name: 'Makanan Utama', sortOrder: 1 }
  });

  const catMinuman = await prisma.category.create({
    data: { tenantId: tenant.id, name: 'Minuman Segar', sortOrder: 2 }
  });

  const catDessert = await prisma.category.create({
    data: { tenantId: tenant.id, name: 'Camilan & Dessert', sortOrder: 3 }
  });

  // 8. Seed Modifier Groups
  const modPedas = await prisma.modifierGroup.create({
    data: {
      tenantId: tenant.id,
      name: 'Level Pedas',
      isRequired: true,
      minSelect: 1,
      maxSelect: 1,
      modifiers: {
        create: [
          { name: 'Tidak Pedas', price: 0 },
          { name: 'Sedang', price: 0 },
          { name: 'Pedas', price: 0 },
          { name: 'Extra Pedas 🔥', price: 2000 }
        ]
      }
    }
  });

  const modTopping = await prisma.modifierGroup.create({
    data: {
      tenantId: tenant.id,
      name: 'Extra Topping',
      isRequired: false,
      minSelect: 0,
      maxSelect: 3,
      modifiers: {
        create: [
          { name: 'Telur Ceplok', price: 5000 },
          { name: 'Ayam Suwir', price: 8000 },
          { name: 'Keju Mozzarella', price: 6000 }
        ]
      }
    }
  });

  // 9. Seed Products
  const prodNasiGoreng = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      categoryId: catMakanan.id,
      name: 'Nasi Goreng Spesial RestoQu',
      description: 'Nasi goreng bumbu rempah khas dengan daging ayam pilihan, udang segar, dan acra asam manis.',
      price: 28000,
      sku: 'F001',
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
      modifierGroups: {
        create: [
          { modifierGroupId: modPedas.id },
          { modifierGroupId: modTopping.id }
        ]
      }
    }
  });

  const prodAyamBakar = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      categoryId: catMakanan.id,
      name: 'Ayam Bakar Madura Spesial',
      description: 'Ayam kampung bakar bumbu kecap pedas gurih disajikan dengan nasi hangat dan sambal terasi.',
      price: 32000,
      sku: 'F002',
      imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
      modifierGroups: {
        create: [
          { modifierGroupId: modPedas.id }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      tenantId: tenant.id,
      categoryId: catMinuman.id,
      name: 'Es Teh Manis Jumbo',
      description: 'Es teh segar daun pilihan dengan rasa manis yang pas.',
      price: 8000,
      sku: 'D001',
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80'
    }
  });

  await prisma.product.create({
    data: {
      tenantId: tenant.id,
      categoryId: catMinuman.id,
      name: 'Kopi Gula Aren Senja',
      description: 'Espresso blend Arabika & Robusta dengan susu segar dan gula aren murni.',
      price: 18000,
      sku: 'D002',
      imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80'
    }
  });

  await prisma.product.create({
    data: {
      tenantId: tenant.id,
      categoryId: catDessert.id,
      name: 'Pisang Goreng Keju Cokelat',
      description: 'Pisang raja renyah bertabur keju parut melimpah dan lelehan cokelat.',
      price: 16000,
      sku: 'S001',
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80'
    }
  });

  console.log('✅ Database seed completed successfully!');
  console.log('🔑 Staff Login Credentials (Explicit Passwords):');
  console.log('   Super Admin: admin@restoqu.app / admin123');
  console.log('   Owner: owner@bismillah.com / owner123');
  console.log('   Manager: manager@bismillah.com / manager123');
  console.log('   Cashier: cashier@bismillah.com / cashier123');
  console.log('   Kitchen: kitchen@bismillah.com / kitchen123');
  console.log('   Waiter: waiter@bismillah.com / waiter123');
  console.log('   Inventory: inventory@bismillah.com / inventory123');
  console.log('🔗 QR Secrets created: qr-bismillah-m01, qr-bismillah-m02, qr-bismillah-m03, qr-bismillah-vip01');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
