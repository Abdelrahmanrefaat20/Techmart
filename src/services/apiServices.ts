import {
  CartResponse,
  CheckoutResponse,
  ProductDetailsResponse,
  ProductsResponse,
  SignInResponse,
} from "@/types/response";
import { json } from "stream/consumers";

class ApiServices {
  #headers = {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZGE1MmIxY2ZlYTNkMDAxM2Y3NjE4ZCIsIm5hbWUiOiJBaG1lZCBBYmQgQWwtTXV0aSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzkyNjkyOTIzLCJleHAiOjE4MDA0Njg5MjN9.qSmQhvs8WeuBsRVaL1wEMyzSfjXLSVHGik_ELLQVzWk",
    "content-type": "application/json",
  };
async getProducts(page: number = 1): Promise<ProductsResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/products?limit=56&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: ProductsResponse = await response.json();

  return data;
}

  async getProductDetails(productId: string): Promise<ProductDetailsResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/products/${productId}`,
    );
    const data = await response.json();
    return data;
  }

  async addProductToCart(productId: string): Promise<CartResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/cart`,
      {
        body: JSON.stringify({
          productId,
        }),
        headers: this.#headers,
        method: "post",
      },
    );
    const data = await response.json();
    return data;
  }

  async getUserCart(): Promise<CartResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/cart`,
      {
        headers: this.#headers,
      },
    );
    const data = await response.json();
    return data;
  }

  async removeProductFromCart(productId: string): Promise<CartResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/cart/" + productId,
      {
        method: "delete",
        headers: this.#headers,
        cache: "no-cache",
      },
    );

    const data = await response.json();
    return data;
  }

  async clearCart(): Promise<CartResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/cart`,
      {
        method: "DELETE",
        headers: this.#headers,
      },
    );
    const data = await response.json();
    return data;
  }

  async UpdateCartProductQuantity(productId: string , count:number): Promise<CartResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/cart/" + productId,
      {
        method: "PUT",
        headers: this.#headers,
        cache: "no-cache",
        body: JSON.stringify({
          count 
        })
      },
    );
    const data = await response.json();
    return data;
  }


  async checkoutCart(cartId: string, shippingAddress: any): Promise<CheckoutResponse> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/v1/orders/checkout-session/${cartId}?url=https://easybuy-olive-nu.vercel.app`, {

        method: "POST",
        headers: this.#headers,
        body: JSON.stringify({
          shippingAddress
        })  
      }
    );
    const data = await response.json();
    return data;
  }

  async signin(email: string , password: string):Promise<SignInResponse>{

    const response= await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/v1/auth/signin`,{
      method:"POST",
       headers: this.#headers,
        body: JSON.stringify({
          email,
          password
        })  
    })
       const data = await response.json();
    return data;

  }
}
const apiServices = new ApiServices();
export default apiServices;
