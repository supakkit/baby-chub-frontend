import { toast } from 'sonner';
import api from '../services/api.js';

const ONETIME = 'oneTime';
const MONTHLY = 'monthly';
const YEARLY = 'yearly';

export const planOptions = { ONETIME, MONTHLY, YEARLY };

export const getProductsInCart = async () => {
    try {
        const response = await api.get("/cart");
        const data = response.data;
        // console.log('data:', data)
        let products = [];
        
        if (data?.cart?.products) {
            products = data.cart.products.map(item => {
                if (item.productId) {
                    return {
                        ...item.productId,
                        plan: item.plan
                    };
                }
                return null;
            }).filter(item => item !== null);
        }
        
        return {
            error: data?.error,
            products,
            message: data?.message
        };

    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
};

export const addToCart = async (productId, plan) => {
    try {
        // console.log('productId:', productId, 'plan:', plan)
        const response = await api.post("/cart", { productId, plan });
        toast.success(response.data?.message);
        
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
};

export const changeProductPlan = async (productId, plan) => {
    try {
        const response = await api.patch(`/cart/${productId}`, { plan });
        toast.success(response.data?.message);

    } catch (error) {
        console.error(error);
        toast.error(error?.message);
    }
};

export const removeFromCart = async (productId) => {
    try {
        // console.log('productId:', productId)
        const response = await api.delete(`/cart/${productId}`);
        toast.success(response.data?.message);

    } catch (error) {
        console.error(error);
        toast.error(error?.message)
    }
};

export const clearCart = async () => {
    try {
        await api.delete("/cart/");
    } catch (error) {
        console.error(error);
        toast.error(error.message)
    }
};
