export interface Category {
  id: string;
  name: string;
  productCount: number;
  imageUri: string;
}

/** 5 categories, matching the restaurant app's categories exactly. */
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-001',
    name: 'Roots & Tubers',
    productCount: 5,
    imageUri: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
  },
  {
    id: 'cat-002',
    name: 'Fresh Vegetables',
    productCount: 8,
    imageUri: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
  },
  {
    id: 'cat-003',
    name: 'Fresh Fruits',
    productCount: 6,
    imageUri: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
  },
  {
    id: 'cat-004',
    name: 'Animal Products',
    productCount: 3,
    imageUri: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400',
  },
  {
    id: 'cat-005',
    name: 'Others',
    productCount: 2,
    imageUri: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400',
  },
];
