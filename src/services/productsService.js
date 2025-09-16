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
};

export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const addProduct = async (newProduct) => {
    try {
        // console.log('new product values:', newProduct)
        const response = await api.post("/products", newProduct);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const updateProduct = async (productId, updatedProduct) => {
    try {
        // console.log('update product values:', updatedProduct)
        const response = await api.put(`/products/${productId}`, updatedProduct);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getProductDetail = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};