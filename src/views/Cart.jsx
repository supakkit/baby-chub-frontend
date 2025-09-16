import { useContext, useEffect } from "react";
import { ProductSummaryCard } from "../components/ProductSummaryCard";
import { TotalPriceCard } from "../components/TotalPriceCard";
import { Link } from "react-router-dom";
import { CheckoutContext } from "../context/CheckoutContext";
import { Button } from "@/components/ui/button";
import { CartContext } from "../context/CartContext";

export function Cart() {
    const { addToCheckout } = useContext(CheckoutContext);
    const {
        cartItems,
        loadingProducts,
        error,
        fetchProductFromCart,
        handleChangeProductPlan,
        handleRemoveFromCart,
        handleClearCart,
    } = useContext(CartContext);

    useEffect(() => {
        fetchProductFromCart();
    }, []);

    if (error)
        return <div className="min-h-screen text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="layout py-8 min-h-screen">
            <div
                className="text-4xl font-bold text-center text-primary pb-4"
            >Cart</div>
            {cartItems?.length > 0
                ? <div className="flex flex-col gap-12 lg:max-w-5xl mx-auto">
                    {
                    <div className="w-full flex flex-col gap-4 mb-8">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-lg text-primary">Your Shopping Cart</h3>
                            <Button variant="link" onClick={handleClearCart}>Remove All</Button>
                        </div>
                        {loadingProducts
                            ? <div className="text-center mt-10 text-xl text-primary">Loading products...</div>
                            : cartItems.map(product => (
                                <ProductSummaryCard 
                                    key={product._id} 
                                    isEdit={true} 
                                    product={product} 
                                    handleRemoveFromCart={handleRemoveFromCart}
                                    handleChangeProductPlan={handleChangeProductPlan}
                                />
                                ))
                        }    
                    </div>
                    }
                    <div className="md:w-1/2 lg:w-lg md:self-end bottom-16 bg-gray-50 p-6 rounded-3xl">
                        <TotalPriceCard products={cartItems}>
                            <Link to='/checkout' onClick={() => addToCheckout(cartItems)}>Checkout</Link>
                        </TotalPriceCard>
                    </div>
                </div>
                : <div className="flex flex-col items-center gap-6">
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

