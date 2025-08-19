import { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlanSelectionCard } from "../components/PlanSelectionCard";
import { Button } from "@/components/ui/button";

export function ProductDetail() {
  const { products } = useContext(ProductContext);
  const { productId } = useParams();
  const { addToCart } = useContext(CartContext);

  const product = products.find((product) => product.id === productId);

  const availablePrices = product.prices.filter((p) => p.value !== null);
  const defaultPlan = availablePrices[0]?.value || null;
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="flex p-20">
      <div className="flex flex-col items-center w-4/10 p-10">
        <div className="pb-10">
          <Carousel className="w-full max-w-xs cursor-pointer">
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <img src={product.image} alt="" className="" />
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <img src={product.image} alt="" className="" />
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="cursor-pointer" />
            <CarouselNext className="cursor-pointer" />
          </Carousel>
        </div>
        <div className="">
          <Carousel>
            <CarouselContent className="gap-1">
              <CarouselItem className="md:basis-1/2 lg:basis-1/3 cursor-pointer">
                <img src={product.image} alt="" />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3 cursor-pointer">
                <img src="/images/programming-course-animal.png" alt="" />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3 cursor-pointer">
                <img src="/images/LearningTime.png" alt="" />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3 cursor-pointer">
                <img src="/images/money2.jpg" alt="" />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="cursor-pointer" />
            <CarouselNext className="cursor-pointer" />
          </Carousel>
        </div>
      </div>
      <div className="flex flex-col w-6/10 text-[#543285] p-10">
        <div className="flex flex-col pr-40">
          <h1 className="font-bold pb-4 text-5xl">{product.name}</h1>
          <p className="text text-justify pb-8">{product.description}</p>
          <p className="pb-4">Type: {product.type}</p>
          <p className="pb-4">Subject: {product.subjects}</p>
          <p className="pb-4">Tag: {product.tags.join(", ")}</p>
          {/* Select Plan */}
          <PlanSelectionCard
            onPlanChange={setSelectedPlan}
            defaultValue={defaultPlan}
          />
          <p>{selectedPlan} Baht</p>
        </div>
        <div className="flex gap-12 p-4 justify-end">
          <img
            className="h-10 cursor-pointer"
            src="/images/heart.svg"
            alt=""
            onClick={() => {
              toast.success("Added product to favorite");
            }}
          />
          <img
            className="h-10 cursor-pointer"
            src="/images/addToCart.svg"
            alt=""
            onClick={() => {
              addToCart({...product, selectedPlan});
            }}
          />
          <Button
            variant="default"
            className="w-xs justify-self-end cursor-pointer"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
