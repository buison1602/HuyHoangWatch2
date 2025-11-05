// Format số tiền với dấu chấm phân cách hàng nghìn
// Ví dụ: 2500000 -> "2.500.000"
export function formatPrice(price: number): string {
  return price.toLocaleString('de-DE');
}

// Format số tiền với đơn vị ₫
// Ví dụ: 2500000 -> "2.500.000 ₫"
export function formatCurrency(price: number): string {
  return `${formatPrice(price)} ₫`;
}
