import api from '../services/api.js'

export const getProductsInFavorite = async () => {
    try {
        const response = await api.get("/favorite");
        // console.log(response.data);
        return response.data;

    } catch (error) {
        console.error(error);
    }
}