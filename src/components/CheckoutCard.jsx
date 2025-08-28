import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { TotalPriceCard } from "./TotalPriceCard"



export function CheckoutCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <RadioGroup 
            defaultValue="creditCard"
            className="grid gap-2"
        >
                <Label
                    htmlFor="creditCard"
                    className="flex justify-between items-center gap-3 bg-amber-400"
                >
                    Credit Card
                    <RadioGroupItem value="creditCard" id="creditCard" />
                </Label>
                <Label
                    htmlFor="payPal"
                    className="flex justify-between items-center gap-3"
                >
                    PayPal
                    <RadioGroupItem value="payPal" id="payPal" />
                </Label>
                <Label
                    htmlFor="shopeePay"
                    className="flex justify-between items-center gap-3"
                >
                    ShopeePay
                    <RadioGroupItem value="shopeePay" id="shopeePay" />
                </Label>
        </RadioGroup>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="cardHolderName">Card Holder Name</Label>
              <Input
                id="cardHolderName"
                type="text"
                placeholder="Enter name here"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Holder Name</Label>
              <Input
                id="cardNumber"
                type="tel"
                inputmode="numeric"
                placeholder="0000 0000 0000 0000"
                pattern="[0-9\s]{19}"
                maxlength="19"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                    <Label htmlFor="cardExpiration">Expiration Date</Label>
                    <Input
                        id="cardExpiration"
                        type="date"
                        placeholder="--/--"
                        required
                    />      
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="cardCVV">CVV</Label>
                    <Input
                        id="cardCVV"
                        type="tel"
                        placeholder=""
                        pattern=""
                        maxlength=""
                        required
                    />      
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="saveCard" />
                <Label htmlFor="saveCard" className="">Save card securely for future payments</Label>
            </div>
            <CardAction className="w-full flex justify-end gap-3">
                <Button type="submit" variant="outline" className="">
                    Cancel
                </Button>
                <Button type="submit" className="">
                    Add Card
                </Button>    
            </CardAction>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <TotalPriceCard />
      </CardFooter>
    </Card>
  )
}
