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
import { Link } from "react-router-dom"
import { useContext, useState } from "react"
import { CartContext } from "../context/CartContext"
import { CheckoutContext } from "../context/CheckoutContext"
import { ApplyDiscountContext } from "../context/ApplyDiscountContext"



export function CheckoutCard() {
  const [selectedValue, setSelectedValue] = useState('creditCard');

  const { checkoutItems, handlePayNow } = useContext(CheckoutContext);

  return (
    <Card className="w-md gap-4">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <RadioGroup 
            defaultValue={selectedValue}
            className="grid gap-2"
            onValueChange={setSelectedValue}
        >
            <Label
                htmlFor="creditCard"
                className="flex justify-between items-center gap-3 p-3 border-1 border-accent rounded-sm hover:bg-primary/10"
            >
                Credit Card
                <RadioGroupItem value="creditCard" id="creditCard" />
            </Label>
            <Label
                htmlFor="payPal"
                className="flex justify-between items-center gap-3 p-3 border-1 border-accent rounded-sm hover:bg-primary/10"
            >
                PayPal
                <RadioGroupItem value="payPal" id="payPal" />
            </Label>
            <Label
                htmlFor="shopeePay"
                className="flex justify-between items-center gap-3 p-3 border-1 border-accent rounded-sm hover:bg-primary/10"
            >
                ShopeePay
                <RadioGroupItem value="shopeePay" id="shopeePay" />
            </Label>
        </RadioGroup>
      </CardHeader>
      <CardContent>
        <hr className="border-secondary border-0.5"></hr>
      </CardContent>
      <CardContent>
        {selectedValue === 'creditCard' ? <CreditCardForm /> : <RedirectMessageBox paymentMethod={selectedValue} />}
      </CardContent>
      <CardContent>
        <hr className="border-secondary border-0.5"></hr>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <TotalPriceCard products={checkoutItems}>
          <Link to='/pending-payment' onClick={handlePayNow}>Pay now</Link>
        </TotalPriceCard>
      </CardFooter>
    </Card>
  )
}


function CreditCardForm() {
  const defaultCreditCardForm = {cardHolderName: '', cardNumber: '', expirationDate: '', CVV: '', checkedSaveCard: false};
  const [creditCardForm, setCreditCardForm] = useState(defaultCreditCardForm);

  const handleCreditCardFormChange = (event) => {
    setCreditCardForm({
      ...creditCardForm,
      [event.target.name]: String(event.target.value)
    });
  };

  const handleCheckedSaveCard = () => {
    setCreditCardForm({
      ...creditCardForm,
      checkedSaveCard: creditCardForm.checkedSaveCard ? false : true
    });
  };

  const handleCreditCardFormSubmit = (event) => {
    event.preventDefault();
    console.log('submit form:', creditCardForm);
  };

  const handleCreditCardFormCancel = () => {
    setCreditCardForm(defaultCreditCardForm);
  };

  return (
    <form onSubmit={handleCreditCardFormSubmit}>
      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cardHolderName">Card Holder Name</Label>
          <Input
            name="cardHolderName"
            id="cardHolderName"
            type="text"
            placeholder="Enter name here"
            required
            value={creditCardForm.cardHolderName}
            onChange={handleCreditCardFormChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            name="cardNumber"
            id="cardNumber"
            type="tel"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            pattern="[0-9]{16}"
            maxLength="16"
            required
            value={creditCardForm.cardNumber}
            onChange={handleCreditCardFormChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
                <Label htmlFor="cardExpiration">Expiration Date</Label>
                <Input
                  name="expirationDate"
                  id="expirationDate"
                  type="date"
                  placeholder="--/--"
                  required
                  value={creditCardForm.expirationDate}
                  onChange={handleCreditCardFormChange}
                />      
            </div>
              <div className="grid gap-2">
                <Label htmlFor="cardCVV">CVV</Label>
                <Input
                  name="CVV"
                  id="CVV"
                  type="tel"
                  placeholder="•••"
                  maxLength="4"
                  required
                  value={creditCardForm.CVV}
                  onChange={handleCreditCardFormChange}
                />      
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Checkbox id="saveCard" onCheckedChange={handleCheckedSaveCard} />
            <Label htmlFor="saveCard" className="">Save card securely for future payments</Label>
        </div>
        <CardAction className="w-full flex justify-end gap-3">
            <Button type="submit" onClick={handleCreditCardFormCancel} variant="outline" className="">
                Cancel
            </Button>
            <Button type="submit" className="">
                Add Card
            </Button>    
        </CardAction>
      </div>
    </form>
  );
}

function RedirectMessageBox({ paymentMethod }) {
  return (
    <div className="text-sm text-center text-pretty mx-2 p-4 border-1 border-accent rounded-2xl bg-secondary/30">
      After clicking "Pay with {paymentMethod}", you will be redirected to {paymentMethod} to complete your purchase securely.
    </div>
  );
}