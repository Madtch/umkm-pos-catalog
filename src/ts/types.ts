// 1. Kontrak untuk Data Produk
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

// 2. Kontrak untuk Item di Keranjang (Product + quantity)
export interface CartItem extends Product {
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  isActive: boolean;
}
