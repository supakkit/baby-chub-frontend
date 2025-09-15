import api from "./api";
import { toast } from 'sonner';


export const getUserOrder = async () => {
    // try {
    //     const response = await api.get("/order");
    //     const data = response.data;
        

    // } catch (error) {
    //     console.error(error);
    // }
};

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