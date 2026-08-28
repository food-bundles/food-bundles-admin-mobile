export interface OrderItem {
  productId: string;
  name: string;
  imageUri: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

export function orderItem(productId: string, name: string, imageUri: string, qty: number, unitPrice: number): OrderItem {
  return { productId, name, imageUri, qty, unitPrice, totalPrice: qty * unitPrice };
}
