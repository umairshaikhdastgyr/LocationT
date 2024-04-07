import { Linking, ToastAndroid } from 'react-native';
import { encryptKeys, urls } from '../constants/ApiConstant';
import { dateConfig, itemQtyType, logsStatus, storageConfig } from '../constants/Enums';
import { message } from '../constants/Messages';
import { navigationConfig } from '../navigation/Constants';
import { hideConfirmationDialog, showConfirmationDialog } from '../components/molecules/ModalHandler';
import { stopBackgroundLocation, uploadCasheLocation } from './Location';
import moment from 'moment';
import haversine from "haversine";
import AsyncStorage from '@react-native-async-storage/async-storage';
import aesjs from "aes-js";
import NetInfo from "@react-native-community/netinfo";

// Get Base URL
export const getBaseURl = async () => {
    const baseURL = await AsyncStorage.getItem(storageConfig.BASE_URL);
    const url = baseURL !== "undefined" && baseURL && baseURL != "" ? baseURL + "/driver/" : urls.baseURL;
    return url;
};

// Get Logistic URL
export const getLogisticURl = async () => {
    const baseURL = await AsyncStorage.getItem(storageConfig.LOGISTIC_URL);
    const url = baseURL !== "undefined" && baseURL && baseURL != "" ? baseURL + "/" : urls.deliveryURL;
    return url;
};

// Show toast
export const showToast = (message) => {
    if (message) {
        return ToastAndroid.show(message, ToastAndroid.LONG);
    }
};

// Get Saved data
export const getStorageObject = async (item) => {
    const data = await AsyncStorage.getItem(item);
    const parseData = JSON.parse(data);
    return parseData;
};

// Calculate distance
export const calculateDistance = (locationOne, locationTwo) => {
    const distance = Math.round(haversine(locationOne, locationTwo, { unit: 'meter' }));
    return distance;
};

// Phone Call
export const phoneCall = (number) => {
    Linking.openURL(`tel: ${number}`);
}

// Open URL
export const openURL = (url) => {
    Linking.openURL(url);
}

// Storing unique id for spot
export const spotUniqueId = async (routeInfo) => {
    const currentTime = moment().format("HHmmss");
    const uniqueNumber = routeInfo?.id + currentTime;
    await AsyncStorage.setItem(storageConfig.UNIQUE_SPOT_ID, uniqueNumber);
}

// Open Google Navigations
export const openGoogleNavigation = (latitude, longitude) => {
    if (!latitude || !longitude) {
        showToast(message.locationNotAvailable);
        return;
    }
    Linking.openURL(`google.navigation:q=${latitude}+${longitude}`);
}

// Show Date
export const showDate = (initialDate, format) => {
    const date = moment(initialDate).format(format);
    return date;
};

// Dropdown data format
export const dropdownData = (data) => {
    const newData = [];
    data.map((data, index) => {
        newData.push(
            {
                value: data?.id,
                label: data?.name
            }
        )
    });
    return newData;
};

// Data Format For Image Upload
export const imageData = async (image, routeId, userData) => {
    const imageName = image.path.split('/').pop();
    const data = new FormData();
    data.append('image', { uri: image.path, name: imageName, type: 'image/jpeg' });
    data.append('route_id', routeId);
    data.append('driver_id', userData?.user_id);
    return data;
};

// Confirmation for logout
export const logout = (navigation) => {
    showConfirmationDialog({
        title: message.logoutConfirm,
        onBackdropPress: () => hideConfirmationDialog(),
        cancelButton: message.no,
        confirmButton: message.yes,
        cancelButtonOnpress: () => hideConfirmationDialog(),
        confirmButtonOnpress: () => confirmLogout(navigation)
    });
}

// Logout
export const confirmLogout = async (navigation) => {
    try {
        uploadCasheLocation(async (status) => {
            if (status) {
                const payload = {
                    id: logsStatus.LOG_OUT,
                    time: moment().format(dateConfig.DATE_TIME)
                }
                stopBackgroundLocation();
                await AsyncStorage.clear();
                navigation.navigate(navigationConfig.LOGIN);
            }
        })
    } catch (error) {
        console.log('Error: ', error);
    } finally {
        hideConfirmationDialog();
    }
};

// Calculate distance in KM
export const calculateKMDistance = (location, item) => {
    const distance = calculateDistance(location, { latitude: item?.lat_lng?.Latitude, longitude: item?.lat_lng?.Longitude }) / 1000;
    return distance;
};

// handling for undefined value
export const validateValue = (value) => {
    if (value) {
        return value;
    } else {
        return 0;
    }
};

// Key to send with notification
export const encrypt = (value) => {
    value = JSON.stringify(value);
    var textBytes = aesjs.utils.utf8.toBytes(value);
    var aesCtr = new aesjs.ModeOfOperation.ctr(
        encryptKeys.ENCRYPT_KEY,
        new aesjs.Counter(5)
    );
    var encryptedBytes = aesCtr.encrypt(textBytes);
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
};

// Internet Connection Check
export const getNetInfo = async () => {
    let isConnected = false;
    await NetInfo.fetch().then((state) => {
        isConnected = state.isConnected && state.isInternetReachable;
    });
    return isConnected;
};

// Converts from UTC to Local date format
export const convertToLocal = (utcDate, format) => {
    const localDateTime = moment(utcDate).local();
    const dateTime = localDateTime.format(format);
    return dateTime;
};

// Converts from Local to UTC date format
export const convertToUTC = (localDate, format) => {
    const utcDateTime = moment(localDate).utc();
    const dateTime = utcDateTime.format(format);
    return dateTime;
};

// To fix with rounding off
export const toFixedWithRoundingOff = (number, precision = 3) => {
    const factor = Math.pow(10, precision);
    const truncatedNumber = Math.ceil(number * factor) / factor;
    return Number(truncatedNumber.toFixed(precision));
}

// Allow only one decimal in amount
export const allowOneDecimal = (value) => {
    if (isNaN(value)) {
        value = value.replace(/[^0-9\.]/g, '');
        if (value.split('.').length > 2)
            value = value.replace(/\.+$/, "");
    }
    return value;
}

// Get item qty on the basis of uom id
export const getItemQty = (item) => {
    const qty = !item?.uom_id || item?.uom_id === itemQtyType.PIECE ? itemQtyType.PIECE : itemQtyType.KG;
    return qty;
}

// Get feature flag information
export const getFeatureFlag = (userData) => {

}