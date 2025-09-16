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

export const getOrders = async (params) => {
    try {
        const response = await api.get("/admin/orders", { params });
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

export const patchOrderStatus = async (orderId, status) => {
    try {
        const response = await api.patch(`/admin/order/${orderId}`, { status });
        return response.status === 200;
    } catch (error) {
        console.error(error);
    }
};

export const deleteOrder = async (orderId) => {
    try {
        const response = await api.delete(`/admin/order/${orderId}`);
        return response.status === 200;
    } catch (error) {
        console.error(error);
    }
};