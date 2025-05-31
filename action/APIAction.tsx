import axios from 'axios';
import { ENDPOINTS } from './API';


export const listBanners = async () => {
  try {
    const response = await axios.get(ENDPOINTS.list_banners, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (e) {
    console.log("Banner fetching error:", e);
  }
};

export const listHomeProducts = async () => {
  try {
    const response = await axios.get(ENDPOINTS.list_home_products, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (e) {
    console.log("Banner fetching error:", e);
  }
};

export const listProductDetails = async (id, query) => {
  try {
    const response = await axios.get(`${ENDPOINTS.list_product_details}/${id}/${query}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (e) {
    console.log("Banner fetching error:", e);
  }
};
