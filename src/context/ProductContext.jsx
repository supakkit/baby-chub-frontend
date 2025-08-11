import { ProductContext } from "./ProductProvider";
import axios from "axios";
import { useEffect, useState } from "react";


export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        const API_URL = 'https://68996cd3fed141b96b9f74eb.mockapi.io/babychub/products';
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);
            // console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getProducts();
    }, [])

    return (
        <ProductContext.Provider
            value={{products}}
        >
            {children}
        </ProductContext.Provider>
    );
}
