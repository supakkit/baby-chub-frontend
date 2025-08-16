import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"


export function ProductSummaryCard({ product, removeFromCart }) {


  return (
      <div className="flex gap-6 rounded-lg h-36 hover:bg-neutral-50">
          <img
            src={product.image}
            alt=""
            className="rounded-lg max-w-36 object-cover"
          />
          <div className="flex flex-col gap-2 py-2">
              <h3
                className="text-xl font-semibold"
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
                  >{product.prices[0].value} THB</p>
              </div>
              <p
                className="text-sm line-clamp-2"
              >{product.description}</p>
              <div>
                  <Button
                      onClick={() => removeFromCart(product)}
                      variant="link"
                      className="p-0"
                  >
                      remove
                  </Button>
              </div>
          </div>
      </div>
  );
}

function PriceSelection() {
  return (
    <Select>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          <SelectLabel></SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}