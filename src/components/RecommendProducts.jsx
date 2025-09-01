import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

export function RecommendProducts({ tags, currentProductId }) {
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);

  const handleViewProducts = (productId) => {
    navigate(`/products/${productId}`);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.id !== currentProductId &&
      Array.isArray(p.tags) &&
      p.tags.some((tag) => tags.includes(tag))
  );

  const productPrice = (product) => {
    const minPrice = product.prices.oneTime || product.prices.monthly;
    const maxPrice = product.prices.oneTime ? null : product.prices.yearly;

    return (
      <>
        {minPrice}฿{maxPrice ? ` - ${maxPrice}฿` : null}
      </>
    );
  };

  if (!filteredProducts.length) {
    return <p>No related products found.</p>;
  }

  return (
    <Carousel>
      <CarouselContent className="gap-4">
        {filteredProducts.map((product) => (
          <CarouselItem
            key={product.id}
            className="md:basis-1/2 lg:basis-1/3 cursor-pointer flex"
          >
            <Card
              onClick={() => handleViewProducts(product.id)}
              className="flex flex-col h-full"
            >
              <div className="w-full aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="flex flex-col flex-grow p-4">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold line-clamp-2">
                  {product.name}
                </h3>

                <Badge className="mt-2 w-fit">{product.type}</Badge>

                {/* ดันราคาลงล่างสุด */}
                <div className="mt-auto flex justify-between text-sm sm:text-base">
                  <p>{productPrice(product)}</p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="cursor-pointer" />
      <CarouselNext className="cursor-pointer" />
    </Carousel>
  );
}
