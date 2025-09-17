import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ProductSummaryCard } from "../components/ProductSummaryCard";
import { clearFavorite, getProductsInFavorite, removeFromFavorite } from "../services/favoriteService.js";


export function Favorite() {
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState("");
    const hasFetched = useRef(false);

    const fetchProductFromFavorite = useCallback(
        async () => {
            if (hasFetched.current) return;

            setLoadingProducts(true);
            try {
                hasFetched.current = true;
                const data = await getProductsInFavorite();
                setFavoriteItems(data?.products || []);
                setError("");
            } catch {
                setError("Failed to load products from your favorite")
            } finally {
                setLoadingProducts(false);
            }
        },[]
    );

    const handleRemoveFromFavorite = async (productId) => {
        try {
            await removeFromFavorite(productId);
            setFavoriteItems(prevItems => 
                prevItems.filter(item => item._id !== productId)
            );
        } catch (error) {
            console.error("Failed to remove product:", error);
            setError("Failed to remove product");
        }
    };

    const handleClearFavorite = async () => {
        try {
            await clearFavorite();
            setFavoriteItems([]);
        } catch (error) {
            console.error("Failed to clear favorite:", error);
            setError("Failed to clear favorite");
        }
    };

    useEffect(() => {
        fetchProductFromFavorite();
    }, [fetchProductFromFavorite]);

    if (error)
        return <div className="min-h-screen text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="layout py-8 min-h-screen">
            <div
                className="text-4xl font-bold text-center text-primary pb-4"
            >Favorite</div>
            {loadingProducts
                ? <div className="text-center mt-10 text-xl text-primary">Loading products...</div>
                : favoriteItems?.length > 0
                ? <div className="w-full lg:max-w-5xl flex flex-col gap-4 mx-auto">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium text-lg text-primary">Your Favorites List</h3>
                        <Button variant="link" onClick={handleClearFavorite}>Remove All</Button>
                    </div>
                    {
                        favoriteItems.map(product => (
                            <ProductSummaryCard 
                                key={product._id} 
                                isEdit={true} 
                                product={product} 
                                isFavorite={true} 
                                handleRemoveFromFavorite={handleRemoveFromFavorite}
                            />
                        )) 
                    }
                    <div className="grid md:justify-end pt-4 pb-8 bg-white sticky bottom-0 mt-8">
                        <Button asChild variant="default" className="w-full md:w-xs text-lg">
                            <Link to="/cart">Cart</Link>
                        </Button>
                    </div>
                </div>
                : <div className="flex flex-col items-center gap-6">
                <div
                    className="text-2xl font-semibold text-center text-primary/80 pt-24"
                >There are no products in your favorites list.</div>
                <Button asChild variant="default" className="w-xs text-lg rounded-4xl">
                    <Link to="/products">Products</Link>
                </Button>
                </div>
            }
        </div>
    );
}