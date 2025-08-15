import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export function ProductDetail() {
  const { products } = useContext(ProductContext);
  const { productId } = useParams();
  const { addToCart } = useContext(CartContext);

  const product = products.find((product) => product.id === productId);
  console.log("id", productId);
  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="flex">
      <div className="flex w-1/2">
        <img src="" alt="" />
      </div>
      <div className="flex flex-col w-1/2 p-4">
        <h1 className="flex justify-center p-4">{product.name}</h1>
        <p className="flex text-justify">&nbsp;{product.description}</p>
        <p>Type: {product.type}</p>
        <p>Subject: {product.subjects}</p>
        <p>Tag: {product.tags.join(", ")}</p>

        {/* Use filter to sort out unavailable price and use .map with => func to return p.price as a new paragraph kub*/}
        <p>
          {product.prices
            .filter((p) => p.value !== null)
            .map((price, index) => {
              return (
                <p key={index}>
                  {price.type} plan: {price.value} Baht
                </p>
              );
            })}
        </p>

        <div className="flex gap-3 p-2 justify-center">
          <button
            className="bg-purple-300 rounded-2xl p-2"
            onClick={() => addToCart(product)}
          >
            Add to cart
          </button>
          <button className="bg-red-300 rounded-2xl p-2">Checkout</button>
        </div>
      </div>
    </div>
  );
}
