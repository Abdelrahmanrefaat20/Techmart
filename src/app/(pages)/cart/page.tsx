import { getServerSession } from "next-auth";
import CartContents from "@/components/cart/CartContents";
import { authOptions } from "@/lib/authOptions";
import apiServices from "@/services/apiServices";

export default async function Cart() {
  const session = await getServerSession(authOptions);
  const response=await apiServices
    .getUserCart(session?.user?.token)
    .catch(() => null);

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
