import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ProductSummaryCard } from "../components/ProductSummaryCard";



export function Favorite() {
    const { favoriteItems, clearFavorite } = useContext(CartContext);

    return (
        <div className="min-h-screen">
            <div
                className="text-5xl font-bold text-center text-primary pb-4"
            >Favorite</div>
            {favoriteItems.length > 0 ? 
                <div className="w-full lg:max-w-5xl flex flex-col gap-4 mx-auto">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium text-lg text-primary">Your Favorites List</h3>
                        <Button variant="link" onClick={clearFavorite}>Remove All</Button>
                    </div>
                    {
                        favoriteItems.map(product => (
                            <ProductSummaryCard key={product.id} isEdit={true} product={product} isFavorite={true} />
                        )) 
                    }
                    <div className="grid md:justify-end pt-4 pb-8 bg-white sticky bottom-0">
                        <Button asChild variant="default" className="w-full md:w-xs text-lg">
                            <Link to="/cart">Cart</Link>
                        </Button>
                    </div>
                </div> :
                <div className="flex flex-col items-center gap-6">
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