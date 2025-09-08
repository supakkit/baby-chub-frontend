import { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { Link, useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import UserReview from "../components/UserReview";
import { RecommendProducts } from "../components/RecommendProducts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlanSelectionCard } from "../components/PlanSelectionCard";
import { Button } from "@/components/ui/button";
import { CheckoutContext } from "../context/CheckoutContext";
import { Badge } from "@/components/ui/badge";

export function ProductDetail() {
  const { products } = useContext(ProductContext);
  const { productId } = useParams();
  const { addToFavorite } = useContext(CartContext);
  const { addToCart } = useContext(CartContext);
  const { addToCheckout } = useContext(CheckoutContext);

  const product = products?.find((product) => product.id === productId);

  const availablePrices = Object.entries(product.prices || {}).filter(
    ([, value]) => value !== null
  );

  const defaultPlan = availablePrices.length
    ? { type: availablePrices[0][0], value: availablePrices[0][1] }
    : null;

  const [selectPlan, setSelectPlan] = useState(defaultPlan);

  const [mainImage, setMainImage] = useState(product.image);

  const thumbnails = [
    product.image,
    "/images/programming-course-animal.png",
    "/images/LearningTime.png",
    "/images/money2.jpg",
  ];

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <>
      <div className="flex pt-20 pl-20 pr-20">
        {/* Product Picture */}
        <div className="flex flex-col items-center basis-[40%] p-10">
          <div className="pb-10 w-full max-w-full">
            <img
              src={mainImage}
              alt=""
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
          <div className="pb-10">
            <Carousel>
              <CarouselContent className="gap-1">
                {thumbnails.map((img, idx) => (
                  <CarouselItem
                    key={idx}
                    className="md:basis-1/2 lg:basis-1/3 cursor-pointer"
                  >
                    <img
                      src={img}
                      alt=""
                      onMouseEnter={() => setMainImage(img)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="cursor-pointer" />
              <CarouselNext className="cursor-pointer" />
            </Carousel>
          </div>
        </div>
        {/* Product Detail */}
        <div className="flex flex-col basis-[60%] text-primary p-10">
          <div className="flex flex-col pr-40">
            <h1 className="font-bold pb-4 text-5xl">{product.name}</h1>
            <p className="text text-justify pb-4">{product.description}</p>
            <p className="pb-4">Type: {product.type}</p>
            <p className="pb-4">Subject: {product.subjects}</p>
            <div className="flex items-center gap-2 pb-4">
              <span className>Tags:</span>
              {product.tags.map((tag) => (
                <Badge key={tag}>
                  <Link to={`/tags/${tag}`}>{tag}</Link>
                </Badge>
              ))}
            </div>
            {/* Select Plan */}
            <PlanSelectionCard
              onPlanChange={setSelectPlan}
              defaultValue={defaultPlan}
            />
            <p className="h-11 font-semibold text-3xl xl:text-4xl ml-auto">
              {selectPlan?.value} Baht
            </p>
          </div>
          <div className="flex gap-12 p-4 justify-end">
            <img
              className="h-10 cursor-pointer"
              src="/images/heart(2).svg"
              alt=""
              onClick={() => {
                addToFavorite(product, selectPlan.type);
              }}
            />
            <img
              className="h-10 cursor-pointer"
              src="/images/addToCart.svg"
              alt=""
              onClick={() => {
                addToCart(product, selectPlan.type);
              }}
            />
            <Button
              asChild
              variant="default"
              className="w-xs justify-self-end cursor-pointer"
            >
              <Link
                to="/checkout"
                onClick={() => addToCheckout(product, selectPlan.type)}
              >
                Checkout
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full p-10">
        <UserReview />
      </div>
      <div className="w-full p-10 px-15">
        <h2 className="flex text-2xl font-bold pb-2">You May Also Like</h2>
        <RecommendProducts
          className="flex"
          tags={product?.tags || []}
          currentProductId={product.id}
        />
      </div>
    </>
  );
}
