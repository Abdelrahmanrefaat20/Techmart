import CartContents from "@/components/cart/CartContents";
import apiServices from "@/services/apiServices";

export default async function Cart() {
  const response = await apiServices.getUserCart().catch(() => null);

  if (!response?.data?.products) {
    return (
      <CartContents
        cartResponse={null}
        error="We couldn't load your cart. Please try again."
      />
    );
  }

  return <CartContents cartResponse={response} />;
}