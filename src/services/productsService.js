import api from '../services/api.js'

export const getProducts = async ( params ) => {
    try {
        // console.log('params:',params)
        const response = await api.get("/products", { params });
        // console.log(response.data);
        return response.data;

    } catch (error) {
        console.error(error);
    }
}