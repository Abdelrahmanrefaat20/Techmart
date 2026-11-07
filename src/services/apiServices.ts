import {
  CartResponse,
  CheckoutResponse,
  ProductDetailsResponse,
  ProductsResponse,
  SignInResponse,
} from "@/types/response";

type ApiHeaders = {
  "content-type": string;
  token?: string;
};

class ApiServices {
  /**
   * Builds the headers for a request. The `token` is the API token stored in
   * the NextAuth session (see `authOptions` callbacks), so it is only sent
   * when the caller is signed in.
   */
  #headers(token?: string): ApiHeaders {
    return {
      "content-type": "application/json",
      ...(token ? { token } : {}),
    };
  }

  async getProducts(page: number = 1): Promise<ProductsResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/products?limit=56&page=${page}`,
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

  async addProductToCart(
    productId: string,
    token?: string,
  ): Promise<CartResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/cart`,
      {
        body: JSON.stringify({
          productId,
        }),
        headers: this.#headers(token),
        method: "post",
      },
    );
    const data = await response.json();
    return data;
  }

  async getUserCart(token?: string): Promise<CartResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/cart`,
      {
        headers: this.#headers(token),
      },
    );
    const data = await response.json();
    return data;
  }

  async removeProductFromCart(
    productId: string,
    token?: string,
  ): Promise<CartResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/cart/" + productId,
      {
        method: "delete",
        headers: this.#headers(token),
        cache: "no-cache",
      },
    );

    const data = await response.json();
    return data;
  }

  async clearCart(token?: string): Promise<CartResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/cart`,
      {
        method: "DELETE",
        headers: this.#headers(token),
      },
    );
    const data = await response.json();
    return data;
  }

  async UpdateCartProductQuantity(
    productId: string,
    count: number,
    token?: string,
  ): Promise<CartResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/cart/" + productId,
      {
        method: "PUT",
        headers: this.#headers(token),
        cache: "no-cache",
        body: JSON.stringify({
          count,
        }),
      },
    );
    const data = await response.json();
    return data;
  }

  async checkoutCart(
    cartId: string,
    shippingAddress: any,
    token?: string,
  ): Promise<CheckoutResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        `/api/v1/orders/checkout-session/${cartId}?url=https://easybuy-olive-nu.vercel.app`,
      {
        method: "POST",
        headers: this.#headers(token),
        body: JSON.stringify({
          shippingAddress,
        }),
      },
    );
    const data = await response.json();
    return data;
  }

  async signin(email: string, password: string): Promise<SignInResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + `/api/v1/auth/signin`,
      {
        method: "POST",
        headers: this.#headers(),
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );
    const data = await response.json();
    return data;
  }

  async signup(
    name: string,
    email: string,
    password: string,
    rePassword: string,
    phone: string,
  ): Promise<SignInResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + `/api/v1/auth/signup`,
      {
        method: "POST",
        headers: this.#headers(),
        body: JSON.stringify({
          name,
          email,
          password,
          rePassword,
          phone,
        }),
      },
    );
    const data = await response.json();
    return data;
  }
}
const apiServices = new ApiServices();
export default apiServices;
