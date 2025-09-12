
import { useContext, useState } from "react";
import { ProductContext } from "./ProductContext";
import { getProducts } from "../services/productsService.js";

export function ProductProvider({ children }) {
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState("");
    const pageSize = 4;

    const getProductsByQuery = async ({ age = [], price = [], type = [], subject = [], page = 1, limit = pageSize, q = '' } = {}) => {
        setLoadingProducts(true);
        const paramsObj = {
            page: String(page),
            limit: String(limit),
        };

        if (age.length > 0) paramsObj.age = JSON.stringify(age);
        if (price.length > 0) paramsObj.price = JSON.stringify(price);
        if (type.length > 0) paramsObj.type = JSON.stringify(type);
        if (subject.length > 0) paramsObj.subject = JSON.stringify(subject);
        if (q.trim().length > 0) paramsObj.q = String(q).trim();

        try {
            // console.log('paramsObj:', paramsObj);
            const data = await getProducts( paramsObj );
            // console.log('data:', data)
            return data;
            
        } catch (err) {
            console.error(err);
            setError("Failed to load products.");
        } finally {
            setLoadingProducts(false);
        }
    };

    return (
        <ProductContext.Provider
            value={{
                pageSize,
                loadingProducts,
                error,
                getProductsByQuery,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export const useProduct = () => useContext(ProductContext);