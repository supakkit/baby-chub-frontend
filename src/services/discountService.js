import api from "./api";
import { toast } from "sonner";


export const applyDiscount = async (code) => {
    try {
        const response = await api.patch("/discount", { code });
        return response.data;
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
};