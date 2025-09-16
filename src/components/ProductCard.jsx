import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";
import { addToFavorite } from "../services/favoriteService";
import { addToCart, planOptions } from "../services/cartService";


export function ProductCard({ product }) {
    const navigate = useNavigate();

    const displayPriceRange = (product) => {
        const minPrice = product.prices.oneTime || product.prices.monthly;
        const maxPrice = product.prices.oneTime ? null : product.prices.yearly;

        return <>{minPrice}฿{maxPrice ? ` - ${maxPrice}฿` : null}</>
    }

    const handleViewProducts = productId => {
        navigate(`/products/${productId}`);
    }

    return (
        <Card 
            onClick={() => handleViewProducts(product._id)}
            className="md:max-w-56 flex justify-between h-full gap-0 p-0 rounded-3xl overflow-clip md:hover:scale-105 duration-300 hover:shadow-primary"
        >
            <CardHeader className="p-0 pt-4 gap-0 hover:relative">
                <img
                    src={product.images[0]}
                    alt=""
                    className="overflow-clip aspect-5/4 object-cover border-y border-secondary/50"
                />
                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 transition">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="h-6 stroke-primary stroke-2 fill-none hover:fill-primary cursor-pointer"
                        onClick={(event) => {
                            addToFavorite(product._id);
                            event.stopPropagation();
                        }}
                    >
                        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                    </svg>
                </button>
            </CardHeader>
            <CardContent className="grid gap-2 px-3 pt-2 pb-3 flex-wrap">
                <h3
                    className="text-md font-semibold line-clamp-2 leading-snug"
                >{product.name}</h3>
                <div className="flex justify-between px-1">
                <Badge 
                    variant="outline"
                    className="bg-purple-100 text-purple-700 border-0"
                  >{product.type}</Badge>
                <p className="font-bold text-md">{displayPriceRange(product)}</p>    
                </div>
                <p className="text-xs line-clamp-2 px-1">{product.description}</p>
                <Button
                    onClick={(event) => {
                        addToCart(product._id, product.prices.oneTime ? planOptions.ONETIME : product.prices.monthly ? planOptions.MONTHLY : planOptions.YEARLY);
                        event.stopPropagation();
                    }}
                    variant="default"
                    className="cursor-pointer w-full rounded-xl mt-1"
                >
                    Add to Cart
                </Button>    
            </CardContent>
        </Card>
    );
}
