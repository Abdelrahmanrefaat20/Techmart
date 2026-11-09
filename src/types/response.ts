import { BrandI, CategoryI, ProductI, SubcategoryI } from "@/interfaces/product";

type ResponseT<T> = {
    results: number;
    metadata: {
        currentPage: number;
        numberOfPages: number;
        limit: number;
        nextPage: number;
        prevPage: number;
    };
    data: T[]
}

export type CartResponse = {
    status: string;
    message: string;
    numOfCartItems: number;
    cartId: string;
    data: Cart;
    statusMsg: string;
};
export type Cart = {
    _id: string;
    cartOwner: string;
    products: CartProduct[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    totalCartPrice: number;
};

type CartProduct = {
    count: number;
    _id: string;
    product: Product;
    price: number;
};
export interface Product {
    subcategory: SubcategoryI[];
    _id: string;
    title: string;
    slug: string;
    quantity: number;
    imageCover: string;
    category: CategoryI;
    brand: BrandI;
    ratingsAverage: number;
    id: string;
};

export type CheckoutResponse = {
    "status": string;
    "session": {
        "url": string;
        "success_url": string;
        "cancel_url": string
    }
}

export type SignInResponse = {
    message: string;
    user?: {
        name: string;
        email: string;
        role: string;
    },
    token?: string;
    statusMsg?: string
}


export type AddToWishlistResponse = {
  status: string;
  message: string;
  data: string[];
};
export type ProductsResponse = ResponseT<ProductI>
export type CategoriesResponse = ResponseT<CategoryI>
export type SpecificCategoryResponse = { data: CategoryI }
export type BrandResponse = ResponseT<BrandI>
export type SpecificBrandResponse = { data: BrandI }
export type ProductDetailsResponse = { data: ProductI } 