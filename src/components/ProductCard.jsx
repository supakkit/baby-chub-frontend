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



export function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleViewProducts = productId => {
        navigate(`/products/${productId}`);
    }

    function productPrice(product) {
        let price;
        let unit;

        if (product.prices[0].value) {
            price = product.prices[0].value;
            unit = 'bath/month';
        } else {
            price = product.prices[2].value;
            unit = 'bath';
        }

        return (
            <>
                <p>{price}</p>
                <p>{unit}</p>
            </>
        );
    }

    return (
        <Card 
            onClick={() => handleViewProducts(product.id)}
            className="justify-between"
        >
            <CardContent className="">
                <img
                    src={product.image}
                    alt=""
                    className="rounded-lg"
                />
                <h3>{product.name}</h3>
                <p>{product.type}</p>
                <p
                    className="line-clamp-3"
                >{product.description}</p>
            </CardContent>
            <CardContent className="flex justify-between">
                <div>
                    {productPrice(product)}
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

