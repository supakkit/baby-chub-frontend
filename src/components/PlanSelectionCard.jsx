import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";

export function PlanSelectionCard({ product, defaultValue, onPlanChange }) {
  if (!product) {
    return <div className="text-red-500">Product not found.</div>;
  }

  // ดึง plans จาก prices และตัด null
  const plans = Object.entries(product.prices || {})
    .filter(([_, value]) => value !== null)
    .map(([type, value]) => ({ type, value }));

  if (plans.length === 0) {
    return (
      <div className="text-gray-500">No available plans for this product.</div>
    );
  }

  // กำหนด default plan เป็น monthly ถ้ามี
  const defaultPlan =
    defaultValue ||
    plans.find((plan) => plan.type.toLowerCase() === "monthly") ||
    plans[0];

  return (
    <Card className="max-w-xs shadow-sm mb-4">
      <CardHeader>
        <CardTitle>Plan Options</CardTitle>
        <CardDescription>Select your preferred plan</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          defaultValue={JSON.stringify(defaultPlan)}
          onValueChange={(value) => onPlanChange(JSON.parse(value))}
        >
          {plans.map(({ type, value }, idx) => {
            const id = `plan-${idx}`;
            return (
              <div key={idx} className="flex items-center mb-2">
                <RadioGroupItem
                  value={JSON.stringify({ type, value })}
                  id={id}
                />
                <Label
                  htmlFor={id}
                  className="ml-2 flex justify-between w-full"
                >
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
  );
}
