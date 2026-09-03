/**
 * Exact per-product thumbnail URLs specified for the farmer-submissions list row (40x40), distinct
 * from qualityPhotosFor()'s detail-screen photo set (different size/crop convention: w=80 flat,
 * no h/fit params, matching the brief's exact spec for this list).
 */
const SUBMISSION_ROW_PHOTO: Record<string, string> = {
  'Irish Potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80',
  'Fresh Tomatoes': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80',
  Avocados: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80',
  Cassava: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=80',
  Eggs: 'https://images.unsplash.com/photo-1518569656558-1f25e69d2fd4?w=80',
  'Red Onions': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=80',
  Bananas: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=80',
  Rice: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9c80a?w=80',
  'Green Beans': 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=80',
};

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=80';

/** 40x40 thumbnail for a farmer-submission row, matched by product name with a general fallback. */
export function submissionRowPhoto(productName: string): string {
  return SUBMISSION_ROW_PHOTO[productName] ?? DEFAULT_PHOTO;
}
