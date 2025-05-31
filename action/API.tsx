const BASE_URL = "http://192.168.19.200:8000";
const BASE_API_URL = BASE_URL + "/api";

const ENDPOINTS = {
    list_banners: BASE_API_URL + "/banners",
    list_home_products: BASE_API_URL + "/products/home-products",
    list_product_details: BASE_API_URL + "/products",
};

export { ENDPOINTS };
