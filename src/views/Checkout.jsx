import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ProductSummaryCard } from "../components/ProductSummaryCard";
import { CheckoutCard } from "../components/CheckoutCard";



export function Checkout() {
    const { cartItems } = useContext(CartContext);

    return (
        <div className="">
            <div
                className="text-5xl font-bold text-center text-primary pb-4"
            >Checkout</div>
            {cartItems.length > 0 ? 
                <div className="flex flex-col lg:flex-row h-full gap-12">
                    <div className="lg:w-3/5 flex flex-col gap-4">
                        {
                            cartItems.map(product => (
                                <ProductSummaryCard key={product.id} product={product} />
                            )) 
                        }    
                    </div>
                    <div className="md:w-2/3 md:self-end lg:w-2/5 lg:self-end lg:sticky bottom-8">
                        <CheckoutCard />
                    </div>
                </div> : 
                <div
                    className="text-2xl font-semibold text-center text-primary/80 pt-24"
                >There are no products in your shopping cart.</div>
            }
        </div>
    );
}