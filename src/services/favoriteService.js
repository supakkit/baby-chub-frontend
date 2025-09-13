import { toast } from 'sonner';
import api from '../services/api.js'

export const getProductsInFavorite = async () => {
    try {
        const response = await api.get("/favorite");
        const data = response.data;
        let products = [];
        
        if (data?.favorite?.products) {
            products = data.favorite.products.map(item => {
                if (item.productId) {
                    return {
                        ...item.productId
                    };
                }
                return null;
            }).filter(item => item !== null);
        }
        
        return {
            error: data.error,
            products,
            message: data.message
        };

    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
}

export const addToFavorite = async (productId) => {
    try {
        // console.log('productId:', productId)
        const response = await api.post("/favorite", { productId });
        toast.success(response.data.message);
        
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
};

export const removeFromFavorite = async (productId) => {
    try {
        // console.log('productId:', productId)
        const response = await api.delete(`/favorite/${productId}`);
        toast.success(response.data.message);

    } catch (error) {
        console.error(error);
        toast.error(error.message)
    }
};

export const clearFavorite = async () => {
    try {
        const response = await api.delete("/favorite/");
        toast.success(response.data.message);
    } catch (error) {
        console.error(error);
        toast.error(error.message)
    }
};