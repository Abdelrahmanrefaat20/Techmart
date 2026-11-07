import ProductsPage from "@/components/layout/Product/ProductsPage";

export default async function ProductsRoute({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string }>;
}) {
  const { category, brand } = await searchParams;

  return <ProductsPage category={category} brand={brand} />;
}
