import api from "./api";
import { toast } from 'sonner';


export const createOrder = async (products = [], promoCode = "", paymentMethod) => {
    try {
        // console.log('products:', products)
        // console.log('promoCode:', promoCode, "paymentMethod:", paymentMethod)
        const response = await api.post("/order", { products, promoCode, paymentMethod });
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
};

export const updateOrder = async (orderId, status) => {
    try {
        const response = await api.patch(`/order/${orderId}`, { status } );
        return response.data;
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
};

export const getUserOrders = async () => {
    try {
        const response = await api.get("/orders");
        return response.data;
        
    } catch (error) {
        console.error(error);
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};