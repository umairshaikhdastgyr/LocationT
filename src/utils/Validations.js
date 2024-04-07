import { dateConfig, userConfig } from '../constants/Enums';
import { showToast } from './Helper';
import { message } from '../constants/Messages';
import { colors } from '../theme/Colors';
import moment from "moment";

// Validate numeric value
export const validateNumeric = (number) => {
    const response = /^[0-9]+$|^$/;
    const validateNumber = response.test(number);
    if (validateNumber) {
        return validateNumber;        
    } else {
        showToast(message.validNumber);
    }
};

// Validate textinput value
export const validateTextInput = (number) => {
    const response = /^\d*\.?\d*$/;
    const validateNumber = response.test(number);
    if (validateNumber) {
        return validateNumber;
    } else {
        showToast(message.validNumber);
    }
};

// Remove spaces
export const removeSpace = (text) => {
    if (text){
        const response = text.replace(/\./g, "");
        return response;
    }
};

// Validation of route on start and end route
export const routeProcessValidation = (driverInfo, radius, distance, fm1RouteDistance, appSettingData) => {    
    switch (true) {
        case (driverInfo.entity_id !== userConfig.DASTGYR_LOGISTIC):
            return true;
        case (driverInfo.entity_id === userConfig.DASTGYR_LOGISTIC && distance <= radius):
            return true;
        case (fm1RouteDistance <= appSettingData?.radius):
            return true;
        default:
            return false;
    }
}

// Validation of pickup arrival
export const pickupProcessValidation = (radius, distance) => {
    switch (true) {
        case (distance <= radius):
            return true;
        default:
            return false;
    }
}

// Validation of stop on marking arrived
export const stopProcessValidation = (driverInfo, appSettingData, distance) => {    
    switch (true) {
        case (driverInfo.entity_id !== userConfig.DASTGYR_LOGISTIC):
            return true;
        case (driverInfo.entity_id === userConfig.DASTGYR_LOGISTIC && distance <= appSettingData?.stopRadius):
            return true;
        default:
            return false;
    }
}

// Matching same dates
export const validateSameDate = (startDate, endDate) => {
    const date = moment(startDate).format(dateConfig.DATE_FORMAT_YEAR_FIRST) == moment(endDate).format(dateConfig.DATE_FORMAT_YEAR_FIRST);
    return date;
};

// Validate background color
export const validateBackgroundColor = (condition) => {
    if (condition) {
        return colors.orange;
    } else {
        return colors.light_grayish_blue;
    }
};

// Validate disable property
export const validateDisable = (condition) => {
    if (condition) {
        return false;
    } else {
        return true;
    }
};

// Setting default phone no. according to country 
export const countryWisePlaceholder = (country) => {
    switch (country) {
        case 1:
            return message.pakDefaultNumber;
        case 2:
            return message.uaeDefaultNumber;
        case 3:
            return message.ukDefaultNumber;
    }
}

// Validate empty object
export const validateEmptyObject = (value) => {
    const response = JSON.stringify(value) === '{}';
    return response;
};

// Validate Return Reason
export const validateReturnReason = (data) => {
    let selectReturn = false;
    data.forEach((item) => {
      if ((item.picked_qty != item.qty) && !item.reason_id) {
        selectReturn = true;
      }
    });
    return selectReturn;
};