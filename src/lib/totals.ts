// Centralized totals calculations for cart and orders

export const TAX_RATE = 0.18; // 18% GST
export const FREE_SHIPPING_THRESHOLD = 500; // Free shipping above this subtotal
export const SHIPPING_FLAT_RATE = 50; // Flat shipping cost when below threshold

export interface TotalsInput {
  subtotal: number;
  discount?: number; // percentage or absolute? keep absolute for now
}

export function calcSubtotal(items: { unitPrice: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function calcTax(subtotal: number): number {
  return subtotal * TAX_RATE;
}

export function calcShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
}

export function calcTotal({ subtotal, discount = 0 }: TotalsInput): number {
  const tax = calcTax(subtotal);
  const shipping = calcShipping(subtotal);
  return subtotal + tax + shipping - discount;
}

export function formatTotals(items: { unitPrice: number; quantity: number }[], discount: number = 0) {
  const subtotal = calcSubtotal(items);
  const tax = calcTax(subtotal);
  const shipping = calcShipping(subtotal);
  const total = subtotal + tax + shipping - discount;
  return { subtotal, tax, shipping, total };
}