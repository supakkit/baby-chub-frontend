import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { toast } from "sonner";

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [favoriteItems, setFavoriteItems] = useState([]);

    const ONETIME = 'oneTime';
    const MONTHLY = 'monthly';
    const YEARLY = 'yearly';
   
   const selectPlanInCart = (item, selectPlan = null) => {
        const plan = selectPlan
            ? { [selectPlan]: item.prices[selectPlan] }
            : item.prices.oneTime
            ? { 'oneTime': item.prices.oneTime }
            : { 'monthly': item.prices.monthly }

        const indexOfItem = cartItems.findIndex(cartItem => cartItem.id === item.id);
        
        if (indexOfItem !== -1) {
            cartItems[indexOfItem] = {
                ...cartItems[indexOfItem],
                selectPlan: plan
            }

            setCartItems([...cartItems]);
        }
    }

    const addToCart = (item, selectPlan = null) => {
        const plan = selectPlan
            ? { [selectPlan]: item.prices[selectPlan] }
            : item.prices.oneTime
            ? { 'oneTime': item.prices.oneTime }
            : { 'monthly': item.prices.monthly }

        const indexOfItem = cartItems.findIndex(cartItem => cartItem.id === item.id);

        if (indexOfItem === -1) {
            setCartItems([...cartItems, {
                id: item.id, 
                name: item.name, 
                description: item.description, 
                type: item.type, 
                images: item.images,
                prices: item.prices,
                selectPlan: plan
            }]);

            toast.success("Added product to cart");
        } else {
            toast.success("Already in cart");
        }
    }

    const removeFromCart = (item) => {
        const indexOfItem = cartItems.findIndex(cartItem => cartItem.id === item.id);
        if (indexOfItem !== -1) {
            setCartItems(cartItems.toSpliced(indexOfItem, 1));
        }
    }

    const clearCart = () => {
        setCartItems([]);
    }

    const addToFavorite = (item, selectPlan = null) => {
        const plan = selectPlan
            ? { [selectPlan]: item.prices[selectPlan] }
            : item.prices.oneTime
            ? { 'oneTime': item.prices.oneTime }
            : { 'monthly': item.prices.monthly }

        const indexOfItem = favoriteItems.findIndex(favoriteItem => favoriteItem.id === item.id);

        if (indexOfItem === -1) {
            setFavoriteItems([...favoriteItems, {
                id: item.id, 
                name: item.name, 
                description: item.description, 
                type: item.type, 
                images: item.images,
                prices: item.prices,
                selectPlan: plan
            }]);

            toast.success("Added product to favorite");
        } else {
            toast.success("Already in favorite");
        }
    }

    const removeFromFavorite = (item) => {
        const indexOfItem = favoriteItems.findIndex(favoriteItem => favoriteItem.id === item.id);
        if (indexOfItem !== -1) {
            setFavoriteItems(favoriteItems.toSpliced(indexOfItem, 1));
        }
    }

    const clearFavorite = () => {
        setFavoriteItems([]);
    }

    // function getCartItemsFromLocalStorage() {
    //     return localStorage.getItem("cartItems") ? 
    //         JSON.parse(localStorage.getItem("cartItems")) : [];
    // }

    // function getFavoriteItemsFromLocalStorage() {
    //     return localStorage.getItem("favoriteItems") ? 
    //         JSON.parse(localStorage.getItem("favoriteItems")) : [];
    // }

    // useEffect(() => {
    //     localStorage.setItem("cartItems", JSON.stringify(cartItems));
    // }, [cartItems])

    // useEffect(() => {
    //     localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));
    // }, [favoriteItems])

    return (
        <CartContext.Provider
            value={{
                ONETIME,
                MONTHLY,
                YEARLY,
                cartItems,
                setCartItems,
                addToCart,
                removeFromCart,
                clearCart,
                selectPlanInCart,
                favoriteItems,
                addToFavorite,
                removeFromFavorite,
                clearFavorite,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
