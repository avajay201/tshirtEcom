import axios from 'axios';
import { ENDPOINTS } from './API';


const authToken = ()=>{
  const isLocal = !localStorage.getItem('name') && !localStorage.getItem('email') && !localStorage.getItem('access_token');
  if (isLocal){
    return ''
  }

  return localStorage.getItem('access_token')
}

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

export const listProducts = async (url: string, searchQuery: string) => {
  try {
    const finalUrl = searchQuery
      ? `${url ? url : ENDPOINTS.list_product_details}?search=${searchQuery}`
      : url ? url : ENDPOINTS.list_product_details;

    const response = await axios.get(finalUrl, {
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

export const listProductDetails = async (id: number, query: string) => {
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

export const registerUser = async (data: object) => {
  try {
    const response = await axios.post(ENDPOINTS.register_user, data);
    return [response.status, response.data];
  } catch (e) {
    console.log("Banner fetching error:", e);
    if (e.response) {
      return [e.response.status, e.response.data.error];
    }
    return [500, { detail: "An unexpected error occurred." }];
  }
};

export const loginUser = async (data: object) => {
  try {
    const response = await axios.post(ENDPOINTS.login_user, data);
    return [response.status, response.data];
  } catch (e) {
    console.log("Banner fetching error:", e);
    if (e.response) {
      return [e.response.status, e.response.data.error];
    }
    return [500, { detail: "An unexpected error occurred." }];
  }
};

export const cartItems = async () => {
  try {
    const token = authToken();
    const response = await axios.get(ENDPOINTS.user_cart, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    console.log("Banner fetching error:", e);
  }
};

export const cartItemAdd = async (data: object) => {
  try {
    const token = authToken();
    const response = await axios.post(ENDPOINTS.user_cart, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    console.log("Banner fetching error:", e);

  }
};

export const cartItemUpdate = async (data: object) => {
  try {
    const token = authToken();
    const response = await axios.patch(ENDPOINTS.user_cart, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    console.log("Banner fetching error:", e);
  }
};

export const cartItemRemove = async (data: object) => {
  try {
    const token = authToken();
    const response = await axios.delete(ENDPOINTS.user_cart, {
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return [response.status, response.data];
  } catch (e) {
    console.log("Banner fetching error:", e);
    if (e.response) {
      return [e.response.status, e.response.data.error];
    }
    return [500, { detail: "An unexpected error occurred." }];
  }
};

export const productReviewSubmit = async (data: object) => {
  try {
    const token = authToken();
    const response = await axios.post(ENDPOINTS.product_review_submit, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return [response.status, response.data];
  } catch (e) {
    console.log("Banner fetching error:", e);
    if (e.response) {
      return [e.response.status, e.response.data.error];
    }
    return [500, { detail: "An unexpected error occurred." }];
  }
};

export const contactSubmit = async (data: object) => {
  try {
    const token = authToken();
    const response = await axios.post(ENDPOINTS.contact_submit, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return [response.status, response.data];
  } catch (e) {
    console.log("Banner fetching error:", e);
    if (e.response) {
      return [e.response.status, e.response.data.error];
    }
    return [500, { detail: "An unexpected error occurred." }];
  }
};
