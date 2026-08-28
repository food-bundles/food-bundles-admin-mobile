export interface Market {
  id: string;
  name: string;
  location: string;
  district: string;
  isOwn: boolean;
}

/** 5 markets. FoodBundles is our own market; the rest are competitor reference markets. */
export const MOCK_MARKETS: Market[] = [
  { id: 'mkt-001', name: 'FoodBundles', location: 'Gikondo Depot', district: 'Kicukiro', isOwn: true },
  { id: 'mkt-002', name: 'Kimironko', location: 'Kimironko Market', district: 'Gasabo', isOwn: false },
  { id: 'mkt-003', name: 'Nyabugogo', location: 'Nyabugogo Market', district: 'Nyarugenge', isOwn: false },
  { id: 'mkt-004', name: 'Musanze', location: 'Musanze Central Market', district: 'Musanze', isOwn: false },
  { id: 'mkt-005', name: 'Kinyinya', location: 'Kinyinya Market', district: 'Gasabo', isOwn: false },
];
