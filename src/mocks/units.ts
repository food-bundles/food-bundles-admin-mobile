export interface Unit {
  id: string;
  name: string;
  abbreviation: string;
  productCount: number;
}

/** 8 units used across products. */
export const MOCK_UNITS: Unit[] = [
  { id: 'unit-001', name: 'Kilogram', abbreviation: 'kg', productCount: 1 },
  { id: 'unit-002', name: 'Gram', abbreviation: 'g', productCount: 0 },
  { id: 'unit-003', name: 'Litre', abbreviation: 'L', productCount: 2 },
  { id: 'unit-004', name: 'Piece', abbreviation: 'pc', productCount: 4 },
  { id: 'unit-005', name: 'Crate', abbreviation: 'crate', productCount: 6 },
  { id: 'unit-006', name: 'Bag (25kg)', abbreviation: 'bag', productCount: 9 },
  { id: 'unit-007', name: 'Bunch', abbreviation: 'bunch', productCount: 1 },
  { id: 'unit-008', name: 'Dozen', abbreviation: 'dz', productCount: 1 },
];
