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
