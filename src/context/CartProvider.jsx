
import { useState } from "react";
import { CartContext } from "./CartContext";
import { changeProductPlan, clearCart, getProductsInCart, removeFromCart } from "../services/cartService";

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState("");

    const fetchProductFromCart = async () => {
        setLoadingProducts(true);
        try {
            const data = await getProductsInCart();
            setCartItems(data?.products || []);
            setError("");
        } catch {
            setError("Failed to load products from your cart")
        } finally {
            setLoadingProducts(false);
        }
    };

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

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loadingProducts,
                error,
                fetchProductFromCart,
                handleChangeProductPlan,
                handleRemoveFromCart,
                handleClearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
