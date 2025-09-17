import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { Link, useParams } from "react-router-dom";
import UserReview from "../components/UserReview";
import RecommendProducts from "../components/RecommendProducts";

import { addToFavorite } from "../services/favoriteService";
import { addToCart } from "../services/cartService";

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
  const { products, getProductById } = useContext(ProductContext);
  const { productId } = useParams();
  const { addToCheckout } = useContext(CheckoutContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectPlan, setSelectPlan] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const existingProduct = products?.find((p) => p._id === productId);
    if (existingProduct) {
      setProduct(existingProduct);
      setLoading(false);
    } else {
      getProductById(productId).then((data) => {
        setProduct(data?.product || null);
        setLoading(false);
      });
    }
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    setMainImage(product.images?.[0] || null);
  }, [product]);

  if (loading) return <div>Loading...</div>;

  if (!product) {
    return <div>Product not found.</div>;
  }

  const thumbnails = product.images || [];

  return (
    <>
      <div className="layout py-8 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8 mb-16 relative">
          {/* Left Column: Images / Carousel */}
          <div className="flex flex-col lg:basis-2/5 p-4">
            <div className="flex flex-col items-center basis-[40%] p-10">
              <div className="pb-10 w-full max-w-full">
                <img
                  src={mainImage}
                  alt=""
                  className="w-full h-auto object-cover rounded-md"
                />
              </div>
              <div className="pb-10 w-full">
                <Carousel>
                  <CarouselContent className="flex gap-2">
                    {thumbnails.map((img, idx) => (
                      <CarouselItem
                        key={idx}
                        className="flex-none w-1/3 h-24 cursor-pointer"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover rounded-md"
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
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col lg:basis-3/5 p-4 text-primary">
            <h1 className="font-bold text-4xl lg:text-5xl pb-4">
              {product.name}
            </h1>
            <p className="text-base lg:text-lg text-justify pb-4">
              {product.description}
            </p>
            <p className="pb-2">Type: {product.type}</p>
            <p className="pb-2">Subject: {product.subjects}</p>

            {/* Tags */}
            <div className="flex items-center gap-2 pb-4 flex-wrap">
              <span className="text-primary">Tags:</span>
              {product.tags?.map((tag) => (
                <Badge key={tag}>
                  <Link to={`/tags/${tag}`}>{tag}</Link>
                </Badge>
              ))}
            </div>

            {/* Plan Selection */}
            <PlanSelectionCard
              product={product}
              onPlanChange={setSelectPlan}
              defaultValue={selectPlan}
            />

            {/* Price */}
            <div className="flex justify-end">
              <p className="h-11 font-semibold text-3xl xl:text-4xl text-right">
                {selectPlan?.value} Baht
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center w-full gap-4 mt-4">
              <div className="flex justify-center gap-4 order-1 sm:order-1 sm:justify-start">
                <img
                  className="h-10 w-10 cursor-pointer"
                  src="/images/heart(2).svg"
                  alt="Add to Favorite"
                  onClick={() => addToFavorite(product._id)}
                />
                <img
                  className="h-10 w-10 cursor-pointer"
                  src="/images/addToCart.svg"
                  alt="Add to Cart"
                  onClick={() => addToCart(product._id, selectPlan?.type)}
                />
              </div>

              <Button
                asChild
                variant="default"
                className="w-full sm:w-auto sm:flex-1 sm:min-w-[250px] text-lg font-semibold py-4 order-2 sm:order-2"
              >
                <Link
                  to="/checkout"
                  onClick={() => addToCheckout(product, selectPlan?.type)}
                  className="w-full block text-center"
                >
                  Checkout
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* User Reviews */}
      <div className="w-full p-4 lg:p-10">
        <UserReview productId={product._id} />
      </div>

      {/* Recommend Products */}
      <div className="w-full p-4 lg:p-10">
        <RecommendProducts />
      </div>
    </>
  );
}
