import api from "./api.js";

export const getReviews = async (productId, params = {}) => {
  try {
    const response = await api.get(`/products/${productId}/reviews`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const addReview = async (productId, newReview) => {
  try {
    const response = await api.post(`/products/${productId}/reviews`, newReview);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteReview = async (productId, reviewId) => {
  try {
    const response = await api.delete(
      `/products/${productId}/reviews/${reviewId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
