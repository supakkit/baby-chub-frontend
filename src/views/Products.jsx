import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { ProductCard } from "../components/ProductCard";


export function Products() {
    const { products, loading } = useContext(ProductContext);
    

    return (
        <div>
            <div
                className="text-5xl font-bold text-center text-primary pb-4"
            >Products</div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="md:basis-1/6 bg-amber-400">
                    sidebar
                </div>
                <div className="md:basis-5/6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    { loading ? <div>Loading...</div> :
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    }
                </div>    
            </div>
            
            
        </div>
    );
}