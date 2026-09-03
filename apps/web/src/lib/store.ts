// Central in-memory store for demo and fallback data across Next.js API routes

// 1. Shift Data
export let currentActiveShift: any = null;
export function setCurrentActiveShift(shift: any) {
  currentActiveShift = shift;
}

export let shiftHistory: any[] = [
  {
    id: 'shift-1',
    cashierName: 'Ahmad (Kasir Pagi)',
    startTime: new Date(Date.now() - 3600000 * 9).toISOString(),
    endTime: new Date(Date.now() - 3600000 * 1).toISOString(),
    status: 'CLOSED',
    startingCash: 200000,
    expectedCash: 850000,
    actualEndingCash: 850000,
    differenceAmount: 0,
    differenceStatus: 'PAS',
    totalCashSales: 650000,
    totalNonCashSales: 420000,
    totalSales: 1070000,
    totalOrdersCount: 14,
    notes: 'Shift Pagi Uang Pas.'
  },
  {
    id: 'shift-2',
    cashierName: 'Siti (Kasir Siang)',
    startTime: new Date(Date.now() - 3600000 * 17).toISOString(),
    endTime: new Date(Date.now() - 3600000 * 9).toISOString(),
    status: 'CLOSED',
    startingCash: 200000,
    expectedCash: 1120000,
    actualEndingCash: 1115000,
    differenceAmount: -5000,
    differenceStatus: 'MINUS',
    totalCashSales: 920000,
    totalNonCashSales: 750000,
    totalSales: 1670000,
    totalOrdersCount: 22,
    notes: 'Kurang Rp 5.000 (kembalian lebih).'
  }
];

// 2. Menu Data
export let initialCategories = [
  { id: 'cat-1', name: 'Makanan Utama' },
  { id: 'cat-2', name: 'Minuman Kopi' },
  { id: 'cat-3', name: 'Minuman Segar' },
  { id: 'cat-4', name: 'Camilan & Side' }
];

export interface ProductStoreItem {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  price: number;
  costPrice?: number;
  status: string;
  description: string;
  imageUrl: string;
  variants?: any[];
}

export let initialProducts: ProductStoreItem[] = [
  {
    id: 'p1',
    name: 'Nasi Goreng Spesial RestoQu',
    category: 'Makanan Utama',
    categoryId: 'cat-1',
    price: 28000,
    costPrice: 14000,
    status: 'AVAILABLE',
    description: 'Nasi goreng bumbu rempah nusantara dengan telur, ayam suwir, dan kerupuk.',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80',
    variants: []
  },
  {
    id: 'p2',
    name: 'Ayam Bakar Madura Sambal Bawang',
    category: 'Makanan Utama',
    categoryId: 'cat-1',
    price: 32000,
    costPrice: 17000,
    status: 'AVAILABLE',
    description: 'Ayam bakar dengan bumbu kecap gurih khas Madura dilengkapi sambal bawang pedas.',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80',
    variants: []
  },
  {
    id: 'p3',
    name: 'Kopi Gula Aren Special',
    category: 'Minuman Kopi',
    categoryId: 'cat-2',
    price: 18000,
    costPrice: 8000,
    status: 'AVAILABLE',
    description: 'Espresso double shot dipadukan dengan susu segar creamy dan gula aren murni.',
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80',
    variants: []
  },
  {
    id: 'p4',
    name: 'Es Teh Manis Jumbo',
    category: 'Minuman Segar',
    categoryId: 'cat-3',
    price: 8000,
    costPrice: 3000,
    status: 'AVAILABLE',
    description: 'Teh melati seduh segar dingin dengan ukuran gelas jumbo.',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
    variants: []
  },
  {
    id: 'p5',
    name: 'Cireng Rujak Pedas Gurih',
    category: 'Camilan & Side',
    categoryId: 'cat-4',
    price: 15000,
    costPrice: 6000,
    status: 'AVAILABLE',
    description: 'Cireng kenyal renyah disajikan dengan saus bumbu rujak pedas manis.',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
    variants: []
  }
];

// 3. Inventory Data
export let initialStockItems = [
  { id: 'inv-1', name: 'Beras Premium', category: 'Bahan Utama', sku: 'RM-BERAS-01', quantity: 50, unit: 'kg', minStock: 15, costPerUnit: 14000 },
  { id: 'inv-2', name: 'Daging Ayam Broiler', category: 'Protein', sku: 'RM-AYAM-01', quantity: 20, unit: 'kg', minStock: 10, costPerUnit: 38000 },
  { id: 'inv-3', name: 'Minyak Goreng', category: 'Bumbu & Minyak', sku: 'RM-MINYAK-01', quantity: 30, unit: 'liter', minStock: 10, costPerUnit: 18000 },
  { id: 'inv-4', name: 'Biji Kopi Arabika', category: 'Minuman', sku: 'RM-KOPI-01', quantity: 8, unit: 'kg', minStock: 3, costPerUnit: 120000 },
  { id: 'inv-5', name: 'Susu UHT Full Cream', category: 'Minuman', sku: 'RM-SUSU-01', quantity: 25, unit: 'liter', minStock: 8, costPerUnit: 18000 },
  { id: 'inv-6', name: 'Gula Aren Cair', category: 'Bumbu & Minyak', sku: 'RM-AREN-01', quantity: 10, unit: 'liter', minStock: 4, costPerUnit: 25000 },
  { id: 'inv-7', name: 'Tepung Tapioka Cireng', category: 'Bahan Utama', sku: 'RM-TEPUNG-01', quantity: 15, unit: 'kg', minStock: 5, costPerUnit: 12000 }
];

export let initialWasteLogs = [
  { id: 'w1', itemName: 'Daging Ayam Broiler', quantity: 1.5, unit: 'kg', reason: 'Kadaluarsa / Rusak Penyimpanan', totalLoss: 57000, date: '28 Aug 2026' },
  { id: 'w2', itemName: 'Susu UHT Full Cream', quantity: 2, unit: 'liter', reason: 'Bocor / Kemasan Kempes', totalLoss: 36000, date: '27 Aug 2026' }
];

export function deductStockForRecipeItem(ingredientName: string, qtyNeeded: number) {
  const item = initialStockItems.find(i => i.name.toLowerCase() === ingredientName.toLowerCase());
  if (item) {
    item.quantity = Math.max(0, Math.round((item.quantity - qtyNeeded) * 1000) / 1000);
    return item;
  }
  return null;
}

// 4. Recipe Data & HPP (COGS)
export let initialRecipes: { [productId: string]: any[] } = {
  p1: [
    { ingredientName: 'Beras Premium', quantityNeeded: 0.2, unit: 'kg' },
    { ingredientName: 'Daging Ayam Broiler', quantityNeeded: 0.05, unit: 'kg' },
    { ingredientName: 'Minyak Goreng', quantityNeeded: 0.02, unit: 'liter' }
  ],
  p2: [
    { ingredientName: 'Daging Ayam Broiler', quantityNeeded: 0.25, unit: 'kg' },
    { ingredientName: 'Beras Premium', quantityNeeded: 0.2, unit: 'kg' },
    { ingredientName: 'Minyak Goreng', quantityNeeded: 0.03, unit: 'liter' }
  ],
  p3: [
    { ingredientName: 'Biji Kopi Arabika', quantityNeeded: 0.018, unit: 'kg' },
    { ingredientName: 'Susu UHT Full Cream', quantityNeeded: 0.12, unit: 'liter' },
    { ingredientName: 'Gula Aren Cair', quantityNeeded: 0.025, unit: 'liter' }
  ],
  p4: [
    { ingredientName: 'Gula Aren Cair', quantityNeeded: 0.02, unit: 'liter' }
  ],
  p5: [
    { ingredientName: 'Tepung Tapioka Cireng', quantityNeeded: 0.15, unit: 'kg' },
    { ingredientName: 'Minyak Goreng', quantityNeeded: 0.05, unit: 'liter' }
  ]
};

export function calculateHppForProduct(productId: string) {
  const recipe = initialRecipes[productId] || [];
  let totalHpp = 0;
  recipe.forEach(item => {
    const inv = initialStockItems.find(i => i.name.toLowerCase() === item.ingredientName.toLowerCase());
    const costPerUnit = inv ? inv.costPerUnit : 15000;
    totalHpp += Math.round(costPerUnit * item.quantityNeeded);
  });
  return totalHpp;
}

// 5. Vouchers, Promos & Tier Membership
export interface VoucherPromo {
  id: string;
  code: string;
  title: string;
  discountType: 'PERCENT' | 'NOMINAL';
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
  usageLimit?: number;
  usedCount: number;
  isHappyHour?: boolean;
  happyHourStart?: string;
  happyHourEnd?: string;
}

export type CustomerTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface TierInfo {
  tier: CustomerTier;
  label: string;
  color: string;
  bgBadge: string;
  discountPercent: number;
  minPoints: number;
  nextTierPoints: number | null;
}

export function getTierByPoints(points: number): TierInfo {
  if (points >= 500) {
    return {
      tier: 'PLATINUM',
      label: 'Platinum Member',
      color: '#7c3aed',
      bgBadge: '#ede9fe',
      discountPercent: 15,
      minPoints: 500,
      nextTierPoints: null
    };
  } else if (points >= 200) {
    return {
      tier: 'GOLD',
      label: 'Gold Member',
      color: '#d97706',
      bgBadge: '#fef3c7',
      discountPercent: 10,
      minPoints: 200,
      nextTierPoints: 500
    };
  } else if (points >= 50) {
    return {
      tier: 'SILVER',
      label: 'Silver Member',
      color: '#0284c7',
      bgBadge: '#e0f2fe',
      discountPercent: 5,
      minPoints: 50,
      nextTierPoints: 200
    };
  } else {
    return {
      tier: 'BRONZE',
      label: 'Bronze Member',
      color: '#b45309',
      bgBadge: '#fef3c7',
      discountPercent: 0,
      minPoints: 0,
      nextTierPoints: 50
    };
  }
}

export let initialVouchers: VoucherPromo[] = [
  {
    id: 'v-1',
    code: 'RESTOQU25K',
    title: 'Potongan Langsung Rp 25.000',
    discountType: 'NOMINAL',
    discountValue: 25000,
    minSpend: 80000,
    expiryDate: '2026-12-31',
    status: 'ACTIVE',
    usageLimit: 100,
    usedCount: 28,
    isHappyHour: false
  },
  {
    id: 'v-2',
    code: 'HAPPYHOUR20',
    title: 'Happy Hour Diskon 20% Sore',
    discountType: 'PERCENT',
    discountValue: 20,
    minSpend: 50000,
    maxDiscount: 30000,
    expiryDate: '2026-12-31',
    status: 'ACTIVE',
    usageLimit: 200,
    usedCount: 45,
    isHappyHour: true,
    happyHourStart: '14:00',
    happyHourEnd: '17:00'
  },
  {
    id: 'v-3',
    code: 'MEMBERBARU10',
    title: 'Diskon 10% Spesial Pelanggan',
    discountType: 'PERCENT',
    discountValue: 10,
    minSpend: 40000,
    maxDiscount: 20000,
    expiryDate: '2026-11-30',
    status: 'ACTIVE',
    usageLimit: 500,
    usedCount: 112,
    isHappyHour: false
  }
];

export let initialCustomers: any[] = [
  {
    id: 'cust-1',
    name: 'Andi Pratama',
    phone: '081234567890',
    email: 'andi.pratama@gmail.com',
    visitCount: 12,
    totalSpend: 1450000,
    points: 245,
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString()
  },
  {
    id: 'cust-2',
    name: 'Siti Rahmawati',
    phone: '085712345678',
    email: 'siti.rahma@yahoo.com',
    visitCount: 28,
    totalSpend: 3200000,
    points: 580,
    createdAt: new Date(Date.now() - 3600000 * 24 * 60).toISOString()
  },
  {
    id: 'cust-3',
    name: 'Budi Santoso',
    phone: '081298765432',
    email: 'budi.santoso@gmail.com',
    visitCount: 6,
    totalSpend: 620000,
    points: 85,
    createdAt: new Date(Date.now() - 3600000 * 24 * 14).toISOString()
  },
  {
    id: 'cust-4',
    name: 'Dewi Lestari',
    phone: '085211223344',
    email: 'dewi.lestari@gmail.com',
    visitCount: 2,
    totalSpend: 180000,
    points: 25,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  }
];
