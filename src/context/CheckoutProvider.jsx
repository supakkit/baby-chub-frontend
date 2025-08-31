import { useContext, useEffect, useState } from "react";
import { CheckoutContext } from "./CheckoutContext";
import { ApplyDiscountContext } from "./ApplyDiscountContext";
import { CartContext } from "./CartContext";


export function CheckoutProvider({ children }) {
    const [checkoutItems, setCheckoutItems] = useState(getCheckoutItemsFromLocalStorage());
    const [purchaseOrder, setPurchaseOrder] = useState({});

    const { promotionForm, discount, subTotalPrice, totalPrice } = useContext(ApplyDiscountContext);
    const { cartItems, setCartItems } = useContext(CartContext);


    const addToCheckout = (items, selectPlan = null) => {
        setCheckoutItems(Array.isArray(items) ? [...items] : [{...items, selectPlan: {[selectPlan]: items.prices[selectPlan]}}]);
    };

    const clearCheckout = () => {
        setCheckoutItems([]);
    }

    function getCheckoutItemsFromLocalStorage() {
        return localStorage.getItem("checkoutItems") ? 
            JSON.parse(localStorage.getItem("checkoutItems")) : [];
    }

    /* ------ Handle Checkout Form ------- */

    const handlePayNow = () => {
        setPurchaseOrder({
            items: checkoutItems,
            promotion: promotionForm,
            discount: discount,
            subTotalPrice: subTotalPrice,
            totalPrice: totalPrice,
        });

        const purchaseProductIdList = checkoutItems.map(item => item.id);
        setCartItems(cartItems.filter(cartItem => !purchaseProductIdList.includes(cartItem.id)));
    };

    /* -- End of checkout form handling -- */

    useEffect(() => {
        localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
    }, [checkoutItems])

    return (
        <CheckoutContext.Provider
            value={{
                checkoutItems, 
                addToCheckout, 
                setCheckoutItems, 
                clearCheckout,
                handlePayNow,
                purchaseOrder,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}