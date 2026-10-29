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

export type ProductsResponse = ResponseT<ProductI>
export type ProductDetailsResponse = { data: ProductI } 