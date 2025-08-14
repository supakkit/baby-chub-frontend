import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { useParams } from "react-router-dom";

export function ProductDetail() {
    const { products } = useContext(ProductContext);
    const { productId } = useParams();

    const product = products.find(product => product.id === productId);
    console.log('id',productId)
    if (!product) {

        return <div>Product not found.</div>
    }

    return (
        <div>
            <h2>ProductDetail</h2>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <button>
                Add to cart
            </button>
            <button>
                Checkout
            </button>
        </div>
    );
}