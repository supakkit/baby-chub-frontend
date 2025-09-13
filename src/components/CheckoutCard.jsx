import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
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
import { CheckoutContext } from "../context/CheckoutContext"
import { useCallback } from "react"

function isValidLuhn(cardNumber) {
  if (!cardNumber || /[^\d]/.test(cardNumber) || cardNumber.length < 13 || cardNumber.length > 19) {
    return false;
  }
  let sum = 0;
  let isSecondDigit = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);
    if (isSecondDigit) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isSecondDigit = !isSecondDigit;
  }
  return (sum % 10) === 0;
}

function isValidExpirationDate(expirationDate) {
  if (!expirationDate) return false;
  const [year, month] = expirationDate.split('/').map(Number);
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  if (year < currentYear) {
    return false;
  }
  if (year === currentYear && month < currentMonth) {
    return false;
  }
  return true;
}

export function CheckoutCard() {
  const [selectedValue, setSelectedValue] = useState('credit_card');
  const { checkoutItems, handlePayNow } = useContext(CheckoutContext);

  const handlePay = useCallback(
    () => {
      handlePayNow(selectedValue);
    }, [handlePayNow, selectedValue]
  );

  return (
    <Card className="gap-4 min-w-sm">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <RadioGroup 
            defaultValue={selectedValue}
            className="grid gap-2"
            onValueChange={setSelectedValue}
        >
            <Label
                htmlFor="credit_card"
                className="flex justify-between items-center gap-3 p-3 border-1 border-accent rounded-sm hover:bg-primary/10"
            >
                Credit Card
                <RadioGroupItem value="credit_card" id="credit_card" />
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
        {selectedValue === 'credit_card' ? <CreditCardForm /> : <RedirectMessageBox paymentMethod={selectedValue} />}
      </CardContent>
      <CardContent>
        <hr className="border-secondary border-0.5"></hr>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <TotalPriceCard products={checkoutItems}>
          <Link to='/pending-payment' onclick={handlePay}>Pay now</Link>
        </TotalPriceCard>
      </CardFooter>
    </Card>
  )
}

function CreditCardForm() {
  const defaultCreditCardForm = {cardHolderName: '', cardNumber: '', expirationDate: '', CVV: '', checkedSaveCard: false};
  const [creditCardForm, setCreditCardForm] = useState(defaultCreditCardForm);
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreditCardFormChange = useCallback(
    (event) => {
      const { name, value, type, checked } = event.target;
      setCreditCardForm(prevForm => ({
        ...prevForm,
        [name]: type === 'checkbox' ? checked : value
      }));
    }, []
  );

  const handleCreditCardFormSubmit = useCallback((event) => {
    event.preventDefault();
    const errors = {};
    if (!isValidLuhn(creditCardForm.cardNumber)) {
        errors.cardNumber = "Invalid card number.";
    }
    if (!isValidExpirationDate(creditCardForm.expirationDate)) {
        errors.expirationDate = "Expiration date is invalid.";
    }
    if (creditCardForm.CVV.length < 3) {
        errors.CVV = "CVV must be 3-4 digits.";
    }

    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
        // Here you would typically send the data to your backend
        console.log('Form submitted successfully:', creditCardForm);
        setCreditCardForm(defaultCreditCardForm);
    }
  }, [creditCardForm]);

  const handleCreditCardFormCancel = useCallback(() => {
    setCreditCardForm(defaultCreditCardForm);
    setValidationErrors({});
  }, []);

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
            pattern="[0-9]{13,19}"
            maxLength="19"
            required
            value={creditCardForm.cardNumber}
            onChange={handleCreditCardFormChange}
            className={validationErrors.cardNumber ? "border-red-500" : ""}
          />
          {validationErrors.cardNumber && <p className="text-red-500 text-sm">{validationErrors.cardNumber}</p>}
        </div>
        <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
                <Label htmlFor="cardExpiration">Expiration Date</Label>
                <Input
                  name="expirationDate"
                  id="expirationDate"
                  type="month"
                  placeholder="MM/YYYY"
                  required
                  value={creditCardForm.expirationDate}
                  onChange={handleCreditCardFormChange}
                  className={validationErrors.expirationDate ? "border-red-500" : ""}
                />
                {validationErrors.expirationDate && <p className="text-red-500 text-sm">{validationErrors.expirationDate}</p>}
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
                  className={validationErrors.CVV ? "border-red-500" : ""}
                />
                {validationErrors.CVV && <p className="text-red-500 text-sm">{validationErrors.CVV}</p>}
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Checkbox 
              id="saveCard" 
              name="checkedSaveCard" 
              checked={creditCardForm.checkedSaveCard} 
              onCheckedChange={(checked) => handleCreditCardFormChange({ target: { name: 'checkedSaveCard', type: 'checkbox', checked } })} 
            />
            <Label htmlFor="saveCard">Save card securely for future payments</Label>
        </div>
        <CardAction className="w-full flex justify-end gap-3">
            <Button type="submit" onClick={handleCreditCardFormCancel} variant="outline" className="">
                Cancel
            </Button>
            <Button type="submit">
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