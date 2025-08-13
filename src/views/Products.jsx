import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

export function Products() {
    const { products, loading } = useContext(ProductContext);
    const navigate = useNavigate();

    const handleViewProducts = productId => {
        navigate(`/products/${productId}`);
    }

    return (
        <div>
            <div>Products</div>
            { loading ? <div>Loading...</div> :
                products.map(product => (
                    <div key={product.id}>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>{product.id}</p>
                        <button
                            onClick={() => handleViewProducts(product.id)}
                        >View Details</button>
                    </div>
                ))}
        </div>
    );
}