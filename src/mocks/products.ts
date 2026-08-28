import { PRODUCTS_FRUITS_OTHER } from './productsFruitsOther';

export type ProductStatus = 'ACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  unit: string;
  unitId: string;
  price: number;
  stock: number;
  imageUri: string;
  status: ProductStatus;
  description: string;
}

function unsplash(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?w=400&h=400&fit=crop&q=80`;
}

const PRODUCTS_ROOTS_VEGETABLES: Product[] = [
  {
    id: 'prod-001',
    categoryId: 'cat-002',
    name: 'Irish Potatoes',
    unit: '10 kg bag',
    unitId: 'unit-006',
    price: 12500,
    stock: 340,
    imageUri: unsplash('photo-1590165482129-1b8b27698780'),
    status: 'ACTIVE',
    description: 'Farm-fresh Irish potatoes, sourced from Musanze cooperatives.',
  },
  {
    id: 'prod-002',
    categoryId: 'cat-002',
    name: 'Fresh Tomatoes',
    unit: '5 kg crate',
    unitId: 'unit-005',
    price: 8200,
    stock: 210,
    imageUri: unsplash('photo-1582284540020-8acbe03f4924'),
    status: 'ACTIVE',
    description: 'Vine-ripened tomatoes, ideal for sauces and salads.',
  },
  {
    id: 'prod-003',
    categoryId: 'cat-002',
    name: 'Red Onions',
    unit: '10 kg bag',
    unitId: 'unit-006',
    price: 9600,
    stock: 180,
    imageUri: unsplash('photo-1618512496248-a07fe83aa8cb'),
    status: 'ACTIVE',
    description: 'Firm red onions with a long shelf life.',
  },
  {
    id: 'prod-004',
    categoryId: 'cat-002',
    name: 'Cabbage',
    unit: 'each',
    unitId: 'unit-004',
    price: 3800,
    stock: 96,
    imageUri: unsplash('photo-1594282486552-05b4d80fbb9f'),
    status: 'ACTIVE',
    description: 'Whole cabbage heads, average 1.5 kg each.',
  },
  {
    id: 'prod-005',
    categoryId: 'cat-002',
    name: 'Carrots',
    unit: '5 kg bag',
    unitId: 'unit-006',
    price: 5400,
    stock: 150,
    imageUri: unsplash('photo-1598170845058-32b9d6a5da37'),
    status: 'ACTIVE',
    description: 'Sweet, crunchy carrots from Nyabihu.',
  },
  {
    id: 'prod-006',
    categoryId: 'cat-002',
    name: 'Spinach',
    unit: 'bunch',
    unitId: 'unit-007',
    price: 3900,
    stock: 60,
    imageUri: unsplash('photo-1580910365203-91ea9115a319'),
    status: 'ACTIVE',
    description: 'Freshly cut spinach, harvested daily.',
  },
  {
    id: 'prod-007',
    categoryId: 'cat-002',
    name: 'Green Beans',
    unit: '5 kg crate',
    unitId: 'unit-005',
    price: 6800,
    stock: 74,
    imageUri: unsplash('photo-1574963835594-61eede2070dc'),
    status: 'ACTIVE',
    description: 'Tender green beans, sorted and cleaned.',
  },
  {
    id: 'prod-008',
    categoryId: 'cat-002',
    name: 'Green Peppers',
    unit: '5 kg crate',
    unitId: 'unit-005',
    price: 7200,
    stock: 40,
    imageUri: unsplash('photo-1560717845-968823efbee1'),
    status: 'OUT_OF_STOCK',
    description: 'Bell peppers, crisp and vibrant green.',
  },
  {
    id: 'prod-009',
    categoryId: 'cat-001',
    name: 'Sweet Potatoes',
    unit: '10 kg bag',
    unitId: 'unit-006',
    price: 8600,
    stock: 120,
    imageUri: unsplash('photo-1596097635121-14b63b7a0c19'),
    status: 'ACTIVE',
    description: 'Orange-fleshed sweet potatoes.',
  },
  {
    id: 'prod-010',
    categoryId: 'cat-001',
    name: 'Cassava',
    unit: '10 kg bag',
    unitId: 'unit-006',
    price: 6200,
    stock: 88,
    imageUri: unsplash('photo-1621263764928-df1444c5e859'),
    status: 'ACTIVE',
    description: 'Peeled and cleaned cassava roots.',
  },
  {
    id: 'prod-011',
    categoryId: 'cat-001',
    name: 'Yams',
    unit: '5 kg bag',
    unitId: 'unit-006',
    price: 7100,
    stock: 54,
    imageUri: unsplash('photo-1633352615508-3d6cdae64d5a'),
    status: 'ACTIVE',
    description: 'Locally grown yams, medium size.',
  },
  {
    id: 'prod-012',
    categoryId: 'cat-001',
    name: 'Taro (Amateke)',
    unit: '5 kg bag',
    unitId: 'unit-006',
    price: 5800,
    stock: 45,
    imageUri: unsplash('photo-1615486511262-c7c8a0a06934'),
    status: 'ACTIVE',
    description: 'Fresh taro corms.',
  },
  {
    id: 'prod-013',
    categoryId: 'cat-001',
    name: 'Purple Sweet Potatoes',
    unit: '10 kg bag',
    unitId: 'unit-006',
    price: 9100,
    stock: 30,
    imageUri: unsplash('photo-1594282486747-6d0b48d20a37'),
    status: 'DISCONTINUED',
    description: 'Purple-skinned sweet potatoes, seasonal.',
  },
];

/**
 * 24 products across 5 categories. Prices match food-bundles-mobile-restaurant's
 * mock exactly. Split into two source files to stay under the 200-line cap —
 * roots/vegetables here, fruits/animal-products/others in productsFruitsOther.ts.
 */
export const MOCK_PRODUCTS: Product[] = [...PRODUCTS_ROOTS_VEGETABLES, ...PRODUCTS_FRUITS_OTHER];
