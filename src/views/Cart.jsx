import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export function Cart() {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

    return (
        <div>
            <div>Cart</div>
            {cartItems[0] ? 
                cartItems.map(product => (
                    <div key={product.id}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>{product.price}</p>
                        <button
                            onClick={() => removeFromCart(product)}
                        >remove</button>
                    </div>
                )) : <div>There are no products in your shopping cart.</div>
            }
        </div>
    );
}