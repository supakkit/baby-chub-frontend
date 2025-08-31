import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useContext } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductContext } from "../context/ProductContext";


export function ProductCard({ product }) {
    const { addToCart, addToFavorite } = useContext(CartContext);
    const { displayPriceRange } = useContext(ProductContext);
    const navigate = useNavigate();

    const handleViewProducts = productId => {
        navigate(`/products/${productId}`);
    }

    return (
        <Card 
            onClick={() => handleViewProducts(product.id)}
            className="justify-between h-fit gap-2 p-0 rounded-lg overflow-clip"
        >
            <CardHeader className="p-0">
                <img
                    src={product.image}
                    alt=""
                    className="overflow-clip aspect-square object-contain"
                />
            </CardHeader>
            <CardContent className="grid gap-2 px-2 pb-2">
                
                <h3
                    className="text-lg md:text-xl font-semibold line-clamp-2"
                >{product.name}</h3>
                <Badge 
                    variant="outline"
                    className=""
                  >{product.type}</Badge>
                <p
                    className="text-sm line-clamp-2"
                >{product.description}</p>
                <div className="flex justify-end">
                    <p className="text-lg font-medium">{displayPriceRange(product)}</p>
                </div>
                <div className="flex justify-between items-center pl-2">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="h-6 stroke-primary stroke-2 fill-none hover:fill-primary cursor-pointer"
                        onClick={(event) => {
                            addToFavorite(product);
                            event.stopPropagation();
                        }}
                    >
                        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                    </svg>
                    <Button
                        onClick={(event) => {
                            addToCart(product);
                            event.stopPropagation();
                        }}
                        variant="default"
                        className="cursor-pointer"
                    >
                        Add to Cart
                    </Button>    
                </div>
            </CardContent>
        </Card>
    );
}

