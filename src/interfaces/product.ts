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