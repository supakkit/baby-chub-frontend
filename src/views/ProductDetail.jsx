import { useContext } from "react";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProductDetail() {
  const { products } = useContext(ProductContext);
  const { productId } = useParams();
  const { addToCart } = useContext(CartContext);

  const product = products.find((product) => product.id === productId);
  console.log("id", productId);
  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="flex p-20">
      <div className="flex flex-col items-center w-4/10 p-10">
        <div className="pb-10">
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <img
                    src="/images/geometry-adventure.png"
                    alt=""
                    className=""
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="">
          <Carousel>
            <CarouselContent>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <img src="/images/money1.jpg" alt="" />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <img src="/images/programming-course-animal.png" alt="" />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <img src="/images/LearningTime.png" alt="" />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
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
          <Card className="max-w-xs shadow-sm">
            <CardHeader>
              <CardTitle>Plan Options</CardTitle>
              <CardDescription>
                Select your preferred subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="standard">
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="flex flex-col">
                    <span className="font-semibold">Free</span>
                    <span className="text-sm text-muted-foreground"></span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex flex-col">
                    <span className="font-semibold">Standard</span>
                    <span className="text-sm text-muted-foreground"></span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium" className="flex flex-col">
                    <span className="font-semibold">Premium</span>
                    <span className="text-sm text-muted-foreground"></span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          {/* Use filter to sort out unavailable price and use .map with => func to return p.price as a new paragraph kub*/}
          <p>
            {product.prices
              .filter((p) => p.value !== null)
              .map((price, index) => {
                return (
                  <p className="pb-4" key={index}>
                    {price.type} plan: {price.value} Baht
                  </p>
                );
              })}
          </p>
        </div>
        <div className="flex gap-12 p-4 justify-end">
          <img
            className="h-10"
            src="/images/heart.svg"
            alt=""
            onClick={() => {
              toast.success("Added product to favorite");
            }}
          />
          <img
            className="h-10"
            src="/images/addToCart.svg"
            alt=""
            onClick={() => {
              addToCart(product);
              toast.success("Added product to cart");
            }}
          />
          <button className="bg-[#543285] rounded-2xl p-2 px-36 text-white">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
