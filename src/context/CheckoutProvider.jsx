import { useContext, useState } from "react";
import { CheckoutContext } from "./CheckoutContext";
import { createOrder } from "../services/orderService";
import { CartContext } from "./CartContext";


export function CheckoutProvider({ children }) {
    const [checkoutItems, setCheckoutItems] = useState();
    const { cartItems, handleClearCart } = useContext(CartContext);

    const addToCheckout = (items, plan) => {
        setCheckoutItems(Array.isArray(items) ? [...items] : [{ ...items, plan }]);
    };

    const clearCheckout = () => {
        setCheckoutItems([]);
    }

    const handlePay = async (checkoutItems, promotionForm, selectedPaymentMethod) => {

        const products = checkoutItems.map(item =>  {
            return { productId: item._id, plan: item.plan };
        });

        try {
            await createOrder(products, promotionForm, selectedPaymentMethod);
            
            const isCheckoutFromCart = products.every(checkoutProduct => {
                return !!cartItems.find(cartProduct => cartProduct._id === checkoutProduct.productId)
            });

            if (isCheckoutFromCart) {
                await handleClearCart();
            }

        } catch (error) {
            console.error("Failed to checkout", error)
        }
    };

    return (
        <CheckoutContext.Provider
            value={{
                checkoutItems, 
                addToCheckout, 
                clearCheckout,
                handlePay,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}