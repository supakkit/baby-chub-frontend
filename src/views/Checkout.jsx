import { useContext } from "react";
import { ProductSummaryCard } from "../components/ProductSummaryCard";
import { CheckoutCard } from "../components/CheckoutCard";
import { CheckoutContext } from "../context/CheckoutContext";


export function Checkout() {
    const { checkoutItems } = useContext(CheckoutContext);

    return (
        <div className="min-h-screen">
            <div
                className="text-5xl font-bold text-center text-primary pb-4"
            >Checkout</div>
            {checkoutItems.length > 0 ? 
                <div className="flex flex-col items-center lg:flex-row lg:items-start gap-12">
                    <div className="flex flex-col gap-4">
                        {checkoutItems.map(product => (
                            <ProductSummaryCard key={product._id} isEdit={false} product={product} />
                        ))}
                    </div>
                    <div className="md:w-1/2 md:self-end lg:w-xl lg:self-end lg:sticky bottom-8">
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