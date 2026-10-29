import { Card, CardContent } from "@/components/ui/card";

export default function ProductsSkeleton() {
  return (
    <section className="container mx-auto px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mb-6 space-y-2">
        <div className="h-6 w-36 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-56 animate-pulse rounded-full bg-muted" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="gap-0 overflow-hidden py-0">
            <div className="aspect-square animate-pulse bg-muted" />
            <CardContent className="space-y-3 p-4">
              <div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted" />
              <div className="flex items-center justify-between pt-3">
                <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-7 w-16 animate-pulse rounded-full bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
