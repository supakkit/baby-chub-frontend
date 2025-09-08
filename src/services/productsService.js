import axios from 'axios';
import api from '../services/api.js'

export const getProducts = async ( params ) => {
    // const API_URL = 'https://68996cd3fed141b96b9f74eb.mockapi.io/babychub/products';
    try {
        // const response = await api.get("/products", { params });
        console.log('params:',params)
        const response = await api.get("/products", { params });
        // console.log(response.data);
        return response.data;

    } catch (error) {
        console.error(error);
    }
}