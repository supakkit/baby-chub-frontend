
import axios from "axios";
import { useEffect, useState } from "react";
import { ProductContext } from "./ProductContext";

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const getProducts = async () => {
        const API_URL = 'https://68996cd3fed141b96b9f74eb.mockapi.io/babychub/products';
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);
            // console.log(response.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        getProducts();
    }, [])

    return (
        <ProductContext.Provider
            value={{products, loading}}
        >
            {children}
        </ProductContext.Provider>
    );
}
