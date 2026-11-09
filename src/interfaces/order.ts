import type { BrandI, CategoryI, SubcategoryI } from "./product";

export interface OrderProductI {
  _id: string;
  id: string;
  title: string;
  imageCover: string;
  category: CategoryI;
  brand: BrandI;
  subcategory: SubcategoryI[];
  ratingsAverage: number;
  ratingsQuantity: number;
}

export interface OrderItemI {
  count: number;
  _id: string;
  product: OrderProductI;
  price: number;
}

export interface OrderI {
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
    postalCode?: string | null;
  };
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  cartItems: OrderItemI[];
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  id: number;
}

export interface VerifyTokenResponse {
  message: string;
  decoded: {
    id: string;
    name: string;
    role: string;
    iat: number;
    exp: number;
  };
}

export interface forgotPasswordResponse {
  statusMsg: string;
  message: string;
}