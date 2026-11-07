export interface SubcategoryI {
    _id: string;
    name: string;
    slug: string;
    category: string;
}

export interface CategoryI {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface BrandI {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface ProductI {
    sold: number;
    images: string[];
    subcategory: SubcategoryI[];
    ratingsQuantity: number;
    _id: string;
    title: string;
    slug: string;
    description: string;
    quantity: number;
    price: number;
    imageCover: string;
    category: CategoryI;
    brand: BrandI;
    ratingsAverage: number;
    createdAt: string;
    updatedAt: string;
    id: string;
}

export interface ProductsPageProps {
  searchParams: Promise<{
    page?: number;
  }>;
}


export interface CreateCashOrderResponse {
  status: string;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  pricing: {
    cartPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalOrderPrice: number;
  };
  data: {
    shippingAddress: {
      details: string;
      phone: string;
      city: string;
      postalCode: string;
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
    cartItems: {
      count: number;
      _id: string;
      product: ProductI;
      price: number;
    }[];
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
  };
}