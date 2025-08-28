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


export function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleViewProducts = productId => {
        navigate(`/products/${productId}`);
    }

    const productPrice = (product) => {
        const minPrice = product.prices.oneTime || product.prices.monthly;
        const maxPrice = product.prices.oneTime ? null : product.prices.yearly;

        return <>{minPrice}฿{maxPrice ? ` - ${maxPrice}฿` : null}</>
    }

    return (
        <Card 
            onClick={() => handleViewProducts(product.id)}
            className="justify-between h-fit"
        >
            <CardContent className="grid gap-2">
                <img
                    src={product.image}
                    alt=""
                    className="rounded-lg"
                />
                <h3
                    className="text-lg md:text-xl font-semibold line-clamp-2"
                >{product.name}</h3>
                <Badge 
                    variant="default"
                    className=""
                  >{product.type}</Badge>
                <p
                    className="text-sm line-clamp-3"
                >{product.description}</p>
            </CardContent>
            <CardContent className="flex justify-between">
                <div>
                    <p>{productPrice(product)}</p>
                </div>
                <Button
                    onClick={(event) => {
                        addToCart(product);
                        event.stopPropagation();
                    }}
                    variant="link"
                    className=""
                >
                    Add to Cart
                </Button>
            </CardContent>
        </Card>
    );
}

