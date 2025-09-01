import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ProductSummaryCard } from "../components/ProductSummaryCard";
import { TotalPriceCard } from "../components/TotalPriceCard";
import { Link } from "react-router-dom";
import { CheckoutContext } from "../context/CheckoutContext";
import { Button } from "@/components/ui/button";

export function Cart() {
    const { cartItems, clearCart } = useContext(CartContext);
    const { addToCheckout } = useContext(CheckoutContext);

    return (
        <div className="min-h-screen">
            <div
                className="text-5xl font-bold text-center text-primary pb-4"
            >Cart</div>
            {cartItems.length > 0 ? 
                <div className="flex flex-col lg:flex-row gap-12 min-h-screen">
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-lg text-primary">Your Shopping Cart</h3>
                            <Button variant="link" onClick={clearCart}>Remove All</Button>
                        </div>
                        {
                            cartItems.map(product => (
                                <ProductSummaryCard key={product.id} isEdit={true} product={product} />
                            )) 
                        }    
                    </div>
                    <div className="md:w-1/2 md:self-end lg:w-xl lg:self-end lg:sticky bottom-8">
                        <TotalPriceCard products={cartItems}>
                            <Link to='/checkout' onClick={() => addToCheckout(cartItems)}>Checkout</Link>
                        </TotalPriceCard>
                    </div>
                </div> : 
                <div className="flex flex-col items-center gap-6">
                    <div
                        className="text-2xl font-semibold text-center text-primary/80 pt-24"
                    >There are no products in your shopping cart.</div>
                    <Button asChild variant="default" className="w-xs text-lg rounded-4xl">
                        <Link to="/products">Products</Link>
                    </Button>    
                </div>
                
            }
        </div>
    );
}

