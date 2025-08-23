import { useContext, useState } from "react";
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

export function ProductSummaryCard({ product }) {
  const [selectedOption, setSelectedOption] = useState('monthly');
  const { selectPlanInCart, removeFromCart } = useContext(CartContext);

  const handlePlan = (value) => {
    setSelectedOption(value);
    selectPlanInCart(product, {
      [value]: product.prices[value]
    });
  }

  return (
      <div className="flex gap-6 rounded-lg h-36 hover:bg-neutral-50 relative pr-4">
          <div
            onClick={() => removeFromCart(product)}
            className="text-center absolute top-2 right-2 w-6 h-6 rounded-full hover:transition-opacity duration-500 ease-in-out hover:bg-primary/30 cursor-pointer"
          >
            X
          </div>
          <img
            src={product.image}
            alt=""
            className="rounded-lg max-w-36 object-cover"
          />
          <div className="flex flex-col gap-2 py-2">
              <h3
                className="text-lg md:text-xl font-semibold line-clamp-2"
              >{product.name}</h3>
              <div className="flex items-center gap-2">
                  <Badge 
                    variant="default"
                    className=""
                  >{product.type}</Badge>
                  <div
                    className="border-l-1 h-4"
                  ></div>
                  <p
                    className="text-sm"
                  >
                    {product.selectPlan?.[selectedOption] || product.prices.oneTime || product.prices.monthly} THB
                  </p>
                  <p
                    className="text-sm"
                  >{product.prices.oneTime ? null :
                    <Select defaultValue={selectedOption} onValueChange={handlePlan}>
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
                  }</p>
              </div>
              <p
                className="text-sm line-clamp-2"
              >{product.description}</p>
          </div>
      </div>
  );
}
