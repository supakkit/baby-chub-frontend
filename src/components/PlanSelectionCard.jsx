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
import { Label } from "@radix-ui/react-label";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";

export function PlanSelectionCard({ onPlanChange, defaultValue }) {
  const { products } = useContext(ProductContext);
  const { productId } = useParams();

  const product = products.find((product) => product.id === productId);
  if (!product) {
    return <div>Product not found.</div>;
  }
  // First version when "prices" data uses an array of objects kub (keep it for learning code reason)
  // const availablePrices = product.prices.filter((p) => p.value !== null);

  //use entries method to
  const availablePrices = Object.entries(product.prices || {}).filter(
    ([, value]) => value !== null
  );

  return (
    <div className="pb-4">
      <Card className="max-w-xs shadow-sm">
        <CardHeader>
          <CardTitle>Plan Options</CardTitle>
          <CardDescription>Select your preferred plan</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue={defaultValue ? JSON.stringify(defaultValue) : ""}
            onValueChange={(value) => onPlanChange(JSON.parse(value))}
          >
            {availablePrices.map(([type, value], index) => {
              const id = `price-${index}`;
              return (
                <div className="flex items-center space-x-2 mb-4" key={index}>
                  <RadioGroupItem
                    value={JSON.stringify({ type, value })}
                    id={id}
                  />
                  <Label htmlFor={id} className="flex flex-col">
                    <span className="font-semibold">{type} plan</span>
                    <span className="text-sm text-muted-foreground">
                      {value} Baht
                    </span>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
