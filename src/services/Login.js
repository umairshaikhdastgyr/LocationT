import { encryptKeys, requestType, urls } from '../constants/ApiConstant';
import { storageConfig } from '../constants/Enums';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from '.';

// Login
export const login = (payload) => {
    return Api({ path: 'user/login', method: requestType.POST, params: payload });
};

// Get Driver information
export const getDriverInfo = () => {
    return Api({ path: `user/me?key=${encryptKeys.appVersion}`, method: requestType.GET });
};

// Get Driver information
export const sendApplicationLogs = (payload) => {
    return Api({ path: 'route/log', method: requestType.POST, params: payload });
};

// Storing auth and refresh tokens
export const setToken = async (data) => {
    if (data) {
        await AsyncStorage.setItem(storageConfig.REFRESH_TOKEN, data.refreshToken);
        await AsyncStorage.setItem(storageConfig.AUTH_TOKEN, data.token)
    }
};

// Get Current Country
export const getCurrentCountry = (payload) => {
    return Api({ path: 'retailer/city/getCityId', method: requestType.POST, retailerUrl: urls.retailerURL, secretKey: true, params: payload });
};

// Get Country List
export const getCountryList = () => {
    return Api({ path: 'retailer/country', method: requestType.GET, retailerUrl: urls.retailerURL, secretKey: true });
};

// Send Device Info
export const sendDeviceInfo = (payload) => {
    return Api({ path: 'driver-trail/user/device', method: requestType.POST, params: payload, deliveryUrl: urls.deliveryURL });
};