import { Alert } from 'react-native';
import { getBaseURl, getLogisticURl, getNetInfo, showToast } from "../utils/Helper";
import { storageConfig } from "../constants/Enums";
import { message } from '../constants/Messages';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import RNRestart from "react-native-restart";

const restartApp = () => {
  Alert.alert(message.tokenExpired, message.loginAgain, [
    {
      text: message.ok,
      onPress: async () => {
        await AsyncStorage.clear();
        RNRestart.Restart();
      },
    },
  ]);
};

const Api = async ({path, params, method, token, imageUpload, dlc, paymentUrl, deliveryUrl, retailerUrl, secretKey}) => {
    const auth_token = await AsyncStorage.getItem(storageConfig.AUTH_TOKEN);
    await AsyncStorage.setItem(storageConfig.SAVE_API, 'true');

    let options;
    options = {
        headers: {
        "Content-Type": imageUpload ? "multipart/form-data" : "application/json",
        ...(auth_token && { 'Authorization': auth_token && `Bearer ${auth_token}` }),
        ...(token === "refresh_token" && { Authorization: auth_token && `Bearer ${auth_token}` }),
        ...(dlc && { dlc: dlc }),
        ...(secretKey && { secretKey: 'ADFKLNADF2332425KNLNLKsrlklnlsdlner' })
        },
        method: method,
        ...(params && { data: imageUpload ? params : JSON.stringify(params) }),
    };

  // console.log('Options: ', options);
  return await apiCall(path, options, paymentUrl, deliveryUrl, retailerUrl);
}

// Api Call
async function apiCall(path, options, paymentUrl, deliveryUrl, retailerUrl) {
  let baseUrl = await getBaseURl();
  let logisticUrl = await getLogisticURl();
  const netInfo = await getNetInfo();
  let url = (paymentUrl ? paymentUrl : deliveryUrl ? logisticUrl : retailerUrl ? retailerUrl : baseUrl) + path;
  if (netInfo) {
    return axios(url, options)
    .then(async(response) => {
      // console.log("Success API: ", response.data);
      await AsyncStorage.setItem(storageConfig.SAVE_API, 'false');
      if (!response.data.status && response?.data?.message) {
        showToast(response?.data?.message);
      }
      return response.data;
    })
    .catch(async (error) => {
      await AsyncStorage.setItem(storageConfig.SAVE_API, 'false');
      const response = error.response;
      // console.log("Failure API: ", response);
      if (response?.status == 401) {
        restartApp();
      }
        return error.response;
    });    
  } else {
    alert(message.checkInternet);
  }
}

export default Api;