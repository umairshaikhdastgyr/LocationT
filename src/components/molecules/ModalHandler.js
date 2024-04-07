import React, { useEffect } from 'react';
import { ConfirmationAlert } from './modals/ConfirmationAlert';
import { ReactAlert } from './modals/ReactAlert';
import MockProvider from './MockProvider';
import AppStateChange from '../atoms/AppStateChange';
import { getCurrentLocation, isServiceKillItSelf } from '../../utils/Location';
import { addEventListener } from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dateConfig, logsStatus, storageConfig } from '../../constants/Enums';
import moment from 'moment';
import { PermissionsAndroid } from 'react-native';

let confirmationDialog = null;
let alertDailog = null;
let mockProvider = null;

export default ModalHandler = React.forwardRef((props, ref) => {

    AppStateChange((isForeground) => {
        if (isForeground) {
            getCurrentLocation();
            checkPermisiion();
            isServiceKillItSelf();
        }
    })


    useEffect(() => {
        checkPermisiion();
        isServiceKillItSelf();
        const unsubscribe = addEventListener(state => {
            wifiAction(state)
        });

        return () => {
            unsubscribe();
        }
    }, [])

    const checkPermisiion = async () => {
        const locationStatus = await AsyncStorage.getItem(storageConfig.LOCATION_PERMISIIONS_STATUS)
        const fineLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        const coarseLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        const backgroundLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
        if (fineLocation && coarseLocation) {
            if (backgroundLocation) {
                if (locationStatus != "2") {
                    AsyncStorage.setItem(storageConfig.LOCATION_PERMISIIONS_STATUS, "2")
                }
            } else {
                if (locationStatus != "1") {
                    AsyncStorage.setItem(storageConfig.LOCATION_PERMISIIONS_STATUS, "1")

                }
            }
        } else {
            if (locationStatus != "1") {
                AsyncStorage.setItem(storageConfig.LOCATION_PERMISIIONS_STATUS, "1")
            }
        }
    }


    let avoidMultiHit = null
    const wifiAction = (state) => {
        avoidMultiHit ? clearTimeout(avoidMultiHit) : null;
        avoidMultiHit = setTimeout(async () => {
            const wifiInfo = await AsyncStorage.getItem(storageConfig.WIFI_TOGGLE_INFO);
            if (state.type == "wifi" || state.type == "cellular") {
                if (wifiInfo) {
                    AsyncStorage.removeItem(storageConfig.WIFI_TOGGLE_INFO);

                }
            } else {
                if (!wifiInfo) {
                    AsyncStorage.setItem(storageConfig.WIFI_TOGGLE_INFO, JSON.stringify({
                        isOn: false,
                        time: moment().format(dateConfig.DATE_TIME)
                    }));
                }
            }
        }, 500);
    }

    return (
        <>
            <ConfirmationAlert
                ref={(ref) => {
                    confirmationDialog = ref;
                }}
            />
            <ReactAlert
                ref={(ref) => {
                    alertDailog = ref;
                }}
            />

            <MockProvider
                ref={(ref) => {
                    mockProvider = ref;
                }}
            />

        </>
    );
});

export const showConfirmationDialog = (data) => {
    confirmationDialog?.isVisible(data);
};

export const hideConfirmationDialog = () => {
    confirmationDialog?.isClose();
};

export const showAlertDialog = (data) => {
    alertDailog?.isVisible(data);
};

export const hideAlertDialog = () => {
    alertDailog?.isClose();
};

export const showMockDailog = (isVisible) => {
    mockProvider?.isVisible(isVisible);
};