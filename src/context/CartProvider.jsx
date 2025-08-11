import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";


export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        const isItemInCart = cartItems.find(cartItem => cartItem.id === item.id);

        if (!isItemInCart) {
            setCartItems([...cartItems, item]);
        } else {
            console.log("this product is already in your cart")
        }
    }

    const removeFromCart = (item) => {
        const isItemInCart = cartItems.find(cartItem => cartItem.id === item.id);

        if (isItemInCart) {
            setCartItems(cartItems.filter(cartItem => cartItem.id !== item.id));
        }
    }

    const clearCart = () => {
        setCartItems([]);
    }

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }
    
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems])

    useEffect(() => {
        const cartItems = localStorage.getItem("cartItems");
        if (cartItems) {
            setCartItems(JSON.parse(cartItems));
        }
    }, [])

    return (
        <CartContext.Provider
            value={{
                cartItems, 
                addToCart,
                removeFromCart,
                clearCart,
                getCartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
