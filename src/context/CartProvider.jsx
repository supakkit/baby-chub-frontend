import { useState, useEffect, useContext } from "react";
import { CartContext } from "./CartContext";
import { toast } from "sonner";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getItemFromLocalStorage());

  const addToCart = (item, selectPlan) => {
    selectPlan = selectPlan
      ? selectPlan
      : item.prices.oneTime
      ? { oneTime: item.prices.oneTime }
      : { monthly: item.prices.monthly };

    const indexOfItem = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (indexOfItem === -1) {
      setCartItems([
        ...cartItems,
        {
          id: item.id,
          name: item.name,
          description: item.description,
          type: item.type,
          image: item.image,
          prices: item.prices,
          selectPlan: selectPlan,
        },
      ]);
      toast.success("Added product to cart");
    } else {
      toast.success("Already in cart");
    }
  };

  const selectPlanInCart = (item, selectPlan) => {
    const indexOfItem = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (indexOfItem !== -1) {
      cartItems[indexOfItem] = {
        ...cartItems[indexOfItem],
        selectPlan: selectPlan,
      };
      setCartItems([...cartItems]);
    }
  };

  const removeFromCart = (item) => {
    const indexOfItem = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    if (indexOfItem !== -1) {
      setCartItems(cartItems.toSpliced(indexOfItem, 1));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Object.values(item.selectPlan)[0],
      0
    );
  };

  function getItemFromLocalStorage() {
    return localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
  }

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        selectPlanInCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// custom hook
export function useCart() {
  return useContext(CartContext);
}
