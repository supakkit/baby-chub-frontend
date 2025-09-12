import { useEffect, useState } from "react";
import { FavoriteContext } from "./FavoriteContext";
import { toast } from "sonner";
import { getProductsInFavorite } from "../services/favoriteService.js";


export function FavoriteProvider({ children }) {
    // const [favoriteItems, setFavoriteItems] = useState([]);
    // const [loadingProducts, setLoadingProducts] = useState(true);
    // const [error, setError] = useState("");

    // const fetchProductFromFavorite = async () => {
    //     try {
    //         const data = await getProductsInFavorite();
    //     } catch (err) {
            
    //     }
    // };

    const addToFavorite = async (item) => {

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
        <FavoriteContext.Provider
            value={{
                
            }}
        >
            {children}
        </FavoriteContext.Provider>
    );
}
