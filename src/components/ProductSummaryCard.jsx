import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button";

export function ProductSummaryCard({ product, isEdit, isFavorite = false }) {
  const { ONETIME, MONTHLY, YEARLY, selectPlanInCart, addToCart, removeFromCart, removeFromFavorite } = useContext(CartContext);

  const displayPriceRange = (product) => {
      const minPrice = product.prices.oneTime || product.prices.monthly;
      const maxPrice = product.prices.oneTime ? null : product.prices.yearly;

      return <>{minPrice}฿{maxPrice ? ` - ${maxPrice}฿` : null}</>
  }

  return (
      <div className="flex gap-6 rounded-lg h-36 hover:bg-neutral-50 relative pr-4">
        {!isEdit ? null :
          <div
            onClick={() => isFavorite ? removeFromFavorite(product) : removeFromCart(product)}
            className="group grid items-center justify-center absolute top-2 right-2 w-6 h-6 rounded-full hover:transition-opacity duration-500 ease-in-out hover:bg-primary/30 cursor-pointer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 460.775 460.775"
              strokeLinecap="rounded"
              strokeLinejoin="rounded"
              className="h-3 fill-primary group-hover:fill-primary-foreground"
            >
              <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> 
            </svg>
          </div>
        }
          <img
            src={product.images[0]}
            alt=""
            className="rounded-lg max-w-36 object-cover"
          />
          <div className="flex flex-col gap-2 py-2">
              <h3
                className="text-lg text-primary md:text-xl font-semibold line-clamp-2"
              >{product.name}</h3>
              <div className="flex items-center gap-2">
                  <Badge 
                    variant="default"
                    className=""
                  >{product.type}</Badge>
                  <div
                    className="border-l-1 h-4"
                  ></div>
                  {isFavorite ? <p className="text-primary">{displayPriceRange(product)}</p> :
                    <>
                      <p className="text-sm text-primary">
                        {Object.values(product.selectPlan)[0]} THB 
                        {Object.keys(product.selectPlan)[0] === MONTHLY ? '/MONTH' : 
                        Object.keys(product.selectPlan)[0] === YEARLY ?  '/YEAR' : null}
                      </p>
                      {!isEdit ? null : product.prices.oneTime ? null :
                        <Select onValueChange={(value) => selectPlanInCart(product, value)}>
                          <SelectTrigger className="">
                            <SelectValue placeholder="Select your plan" />
                          </SelectTrigger>
                          <SelectContent >
                            <SelectGroup >
                              <SelectItem value="monthly" selected>Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      }
                    </>
                  }
                  
              </div>
              <div className="flex gap-4">
                <p
                  className="text-sm text-primary line-clamp-2"
                >{product.description}</p>
                {isFavorite ? 
                  <Button 
                    variant="outline" 
                    className="self-end"
                    onClick={() => {addToCart(product); removeFromFavorite(product)}}
                  >Add to cart</Button>
                  : null
                }
              </div>
          </div>
      </div>
  );
}

