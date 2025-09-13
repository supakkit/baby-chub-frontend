import { useCallback, useContext, useEffect, useState } from "react";
import { ProductSummaryCard } from "../components/ProductSummaryCard";
import { TotalPriceCard } from "../components/TotalPriceCard";
import { Link } from "react-router-dom";
import { CheckoutContext } from "../context/CheckoutContext";
import { Button } from "@/components/ui/button";
import { changeProductPlan, clearCart, getProductsInCart, removeFromCart } from "../services/cartService";

export function Cart() {
    const { addToCheckout } = useContext(CheckoutContext);

    const [cartItems, setCartItems] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState("");

    const fetchProductFromCart = useCallback(
        async () => {
            setLoadingProducts(true);
            try {
                const data = await getProductsInCart();
                setCartItems(data.products);
                setError("");
            } catch {
                setError("Failed to load products from your cart")
            } finally {
                setLoadingProducts(false);
            }
        },[]
    );

    const handleChangeProductPlan = async (productId, plan) => {
        try {
            await changeProductPlan(productId, plan);
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item._id === productId ? { ...item, plan } : item
                )
            );
        } catch (error) {
            console.error("Failed to change product plan:", error);
            setError("Failed to change product plan");
        }
    };
    
    const handleRemoveFromCart = async (productId) => {
        try {
            await removeFromCart(productId);
            setCartItems(prevItems =>
                prevItems.filter(item => item._id !== productId)
            );
        } catch (error) {
            console.error("Failed to remove product:", error);
            setError("Failed to remove product");
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
            setCartItems([]);
        } catch (error) {
            console.error("Failed to clear cart:", error);
            setError("Failed to clear cart");
        }
    };

    useEffect(() => {
        fetchProductFromCart();
    }, [fetchProductFromCart]);

    if (error)
        return <div className="min-h-screen text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="layout py-8 min-h-screen">
            <div
                className="text-4xl font-bold text-center text-primary pb-4"
            >Cart</div>
            {cartItems?.length > 0
                ? <div className="flex flex-col lg:flex-row gap-12 min-h-screen">
                    {
                    <div className="w-full flex flex-col gap-4">
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
                    <div className="md:w-1/2 md:self-end lg:w-xl lg:self-end lg:sticky bottom-8">
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

