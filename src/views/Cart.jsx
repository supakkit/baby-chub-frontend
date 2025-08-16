import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ProductSummaryCard } from "../components/ProductSummaryCard";

export function Cart() {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

    return (
        <div>
            <div>Cart</div>
            <div className="grid gap-4 px-8">
                {cartItems[0] ? 
                    cartItems.map(product => (
                        <ProductSummaryCard key={product.id} product={product} removeFromCart={removeFromCart} />
                    )) : <div>There are no products in your shopping cart.</div>
                }    
            </div>
            
        </div>
    );
}

