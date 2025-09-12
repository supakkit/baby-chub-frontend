import api from '../services/api.js'

export const getProductsInCart = async () => {
    try {
        const response = await api.get("/cart");
        // console.log(response.data);
        return response.data;

    } catch (error) {
        console.error(error);
    }
}