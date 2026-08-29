/**
 * Real Unsplash farm/produce photo URLs for the farmer-submissions detail
 * screen's "quality photos" section (Section 6/7 gap: it previously showed
 * 3 empty grey boxes). Same URL pattern as src/mocks/products.ts and the
 * restaurant app's productImages.ts: images.unsplash.com/{photoId}?w=...&fit=crop.
 * Per-product sets where a close match exists; otherwise a general "fresh
 * produce crate market" fallback set so every submission still shows real
 * photos instead of a placeholder.
 */
function unsplash(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?w=400&h=400&fit=crop&q=80`;
}

const PRODUCT_PHOTO_IDS: Record<string, string[]> = {
  'Irish Potatoes': ['photo-1590165482129-1b8b27698780', 'photo-1518977676601-b53f82aba655', 'photo-1518977676601-b53f82aba655'],
  'Fresh Tomatoes': ['photo-1582284540020-8acbe03f4924', 'photo-1546094096-0df4bcaaa337', 'photo-1592841200221-a6898f307baa'],
  'Red Onions': ['photo-1618512496248-a07fe83aa8cb', 'photo-1618512496248-a07fe83aa8cb', 'photo-1508747703725-719777637510'],
  Cassava: ['photo-1621263764928-df1444c5e859', 'photo-1621263764928-df1444c5e859', 'photo-1518977676601-b53f82aba655'],
  Avocados: ['photo-1519162808019-7de1683fa2ad', 'photo-1601039641847-7857b994d704', 'photo-1523049673857-eb18f1d7b578'],
  Eggs: ['photo-1639194335563-d56b83f0060c', 'photo-1598965675045-45c5e72c7d05', 'photo-1506976785307-8732e854ad03'],
  Bananas: ['photo-1587132137056-bfbf0166836e', 'photo-1571771894821-ce9b6c11b08e', 'photo-1543218024-57a70143c369'],
  Rice: ['photo-1586201375761-83865001e31c', 'photo-1516684732162-798a0062be99', 'photo-1586201375761-83865001e31c'],
  'Chicken (whole)': ['photo-1587593810167-a84920ea0781', 'photo-1587593810167-a84920ea0781', 'photo-1587593810167-a84920ea0781'],
  Watermelon: ['photo-1563114773-84221bd62daa', 'photo-1571575173700-afb9492e6a50', 'photo-1563114773-84221bd62daa'],
};

/** Generic "fresh vegetables crate market" fallback for any product with no dedicated set above. */
const FALLBACK_PHOTO_IDS = ['photo-1610348725531-843dff563e2c', 'photo-1610348725531-843dff563e2c', 'photo-1610348725531-843dff563e2c'];

/** Rwanda-farm-produce fallback used when a product name has no specific match. */
export function qualityPhotosFor(productName: string): string[] {
  const ids = PRODUCT_PHOTO_IDS[productName] ?? FALLBACK_PHOTO_IDS;
  return ids.map(unsplash);
}
