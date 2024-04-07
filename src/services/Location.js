import { requestType } from '../constants/ApiConstant';
import Api from '.';

// Send Locations
export const sendLocations = (userId, payload) => {
    return Api({ path: `route/save-location/${userId}`, method: requestType.POST, params: payload });
};