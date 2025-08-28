import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom";

export function TotalPriceCard() {
    const { cartItems, getCartTotal } = useContext(CartContext);

    return (
        <div className="grid gap-8 text-primary">
            <div className="flex justify-between w-full items-center gap-2">
                <Input type="text" placeholder="Input promotion code" className="w-3/5" />
                <Button type="submit" variant="outline" className="w-1/5">
                    Apply
                </Button>    
            </div>
            <div className="flex justify-between items-center h-11 ">
                <p>Subtotal</p>
                <p>{getCartTotal()} THB</p>   
            </div>
            <div className="flex justify-between items-center h-11 border-t-2">
                <p>DIscount</p>
                <p>- {0} THB</p>    
            </div>
            <div className="flex justify-between h-11 font-semibold text-xl xl:text-2xl">
                <p>{cartItems.length} Items</p>
                <p>Total {getCartTotal()} THB</p>    
            </div>
            <Button asChild variant="default" className="w-xs justify-self-end">
                <Link to='/checkout'>Checkout</Link>
            </Button>
        </div>
    );
}