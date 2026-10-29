export { cn } from "cn"

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
    }).format(price);
};

export const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};