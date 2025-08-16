import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { ProductCard } from "../components/ProductCard";


export function Products() {
    const { products, loading } = useContext(ProductContext);
    

    return (
        <div>
            <div>Products</div>
            <div className="grid sm:grid-cols-3 gap-4">
                { loading ? <div>Loading...</div> :
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                }
            </div>
            
        </div>
    );
}