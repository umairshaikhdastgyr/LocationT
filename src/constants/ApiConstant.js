import { API_URL, PAYMENT_URL, DELIVERY_URL, RETAILER_URL, SENTRY_KEY, ENVIRONMENT } from "../../env.json";

// URLS
export const urls = {
  baseURL: API_URL,
  paymentURL: PAYMENT_URL,
  deliveryURL: DELIVERY_URL,
  retailerURL: RETAILER_URL,
  TRACKER_HOST: 'https://tracker.transistorsoft.com',
  SENTRY_KEY: SENTRY_KEY,
  ENVIRONMENT: ENVIRONMENT
};

// Request Type
export const requestType = {
  POST: "post",
  GET: "get",
  PUT: "put",
  DELETE: "delete",
};

export const encryptKeys = {
  ENCRYPT_KEY: [2, 5, 1, 3, 9, 3, 5, 1, 5, 6, 4, 9, 2, 3, 1, 1], // Production Keys
  appVersion: "1.0.71",
  isForceUpdate: 1,
};