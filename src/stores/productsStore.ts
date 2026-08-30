import { create } from 'zustand';
import { MOCK_PRODUCTS, type Product, type ProductStatus } from '@/mocks/products';

export interface ProductOverride {
  name?: string;
  price?: number;
  stock?: number;
  description?: string;
  imageUris?: string[];
  status?: ProductStatus;
  reorderThreshold?: number;
}

interface ProductsState {
  overrides: Record<string, ProductOverride>;
  setOverride: (id: string, patch: ProductOverride) => void;
  getEffective: (product: Product) => Product & { imageUris: string[]; reorderThreshold: number };
  isLowStock: (product: Product) => boolean;
  duplicateProduct: (product: Product) => Product;
}

const DEFAULT_REORDER_THRESHOLD = 10;

/**
 * Session-only overrides layered on top of the static MOCK_PRODUCTS array — needed for Section 11
 * (multi-image upload, reorder threshold, discontinue, duplicate) since a static array can't be
 * mutated or grown. `isLowStock` is the one real "low-stock flag mechanism" in this codebase (none
 * existed before this pass); Section 12's Stock Movement report reads through this same function
 * rather than re-deriving its own threshold logic.
 */
export const useProductsStore = create<ProductsState>((set, get) => ({
  overrides: {},
  setOverride: (id, patch) =>
    set((state) => ({ overrides: { ...state.overrides, [id]: { ...state.overrides[id], ...patch } } })),
  getEffective: (product) => {
    const override = get().overrides[product.id];
    return {
      ...product,
      ...override,
      imageUris: override?.imageUris ?? [product.imageUri],
      reorderThreshold: override?.reorderThreshold ?? DEFAULT_REORDER_THRESHOLD,
    };
  },
  isLowStock: (product) => {
    const effective = get().getEffective(product);
    return effective.stock < effective.reorderThreshold;
  },
  duplicateProduct: (product) => {
    const copy: Product = { ...product, id: `${product.id}-copy-${Date.now()}`, name: `${product.name} (copy)`, status: 'ACTIVE' };
    return copy;
  },
}));

export function allEffectiveProducts(): (Product & { imageUris: string[]; reorderThreshold: number })[] {
  const { getEffective } = useProductsStore.getState();
  return MOCK_PRODUCTS.map(getEffective);
}
