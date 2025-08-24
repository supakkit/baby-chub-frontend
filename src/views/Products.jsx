import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { ProductCard } from "../components/ProductCard";
import { ProductFilter } from "../components/ProductFilter";


export function Products() {
    const { filterProducts, loading } = useContext(ProductContext);
    

    return (
        <div>
            <div
                className="text-5xl font-bold text-center text-primary pb-4"
            >Products</div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="md:basis-1/6 bg-stone-50">
                    <ProductFilter />
                </div>
                <div className="md:basis-5/6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    { loading ? <div>Loading...</div> :
                        filterProducts.length <= 0 ? <div>No Matching Products</div> :
                        filterProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    }
                </div>    
            </div>
            
            
        </div>
    );
}