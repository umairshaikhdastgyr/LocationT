import { Alert, Linking, BackHandler, NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { PERMISSIONS, requestMultiple, request } from "react-native-permissions";
import { message } from '../constants/Messages';
import { currentLocation, environmentType, locationConfig, logsStatus, stopStatus, storageConfig, storeType, timeConfig, routeStatus } from '../constants/Enums';
import { calculateDistance, getNetInfo } from './Helper';
import { sendLocations } from '../services/Location';
import { PermissionsAndroid } from 'react-native';
import Geolocation from "react-native-geolocation-service";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import BackGroundLocation from '../components/atoms/BackGroundLocation'
import notifee from '@notifee/react-native';
import moment from 'moment';
import { showMockDailog } from '../components/molecules/ModalHandler';
import { urls } from '../constants/ApiConstant';
import { validateEmptyObject } from './Validations';

export const enableGpsLocation = async () => {
  return await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
    interval: 10000,
    fastInterval: 5000,
  }).catch((err) => {
  });
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition((data) => {
      if (urls.ENVIRONMENT === environmentType.PRODUCTION && data && data.mocked) {
        showMockDailog(true);
        resolve(false);
      } else {
        showMockDailog(false);
        currentLocation.coords = data.coords;
        resolve(data);
      }
    }, (error) => reject((error) => {

    }), { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
  });
};

export const checkLocationPermission = async () => {
  return await requestMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION]).then(async (status) => {
    if (status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === locationConfig.LOCATION_GRANTED) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
      let result = await enableGpsLocation();
      if (result) {
        return getCurrentLocation();
      } else {
        Alert.alert(message.alert, message.unableTogetLocation, [
          {
            text: message.ok,
            onPress: () => {
              BackHandler.exitApp();
              Linking.openSettings();
            },
          },
        ]);
        return false;
      }
    } else if (status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == locationConfig.LOCATION_BLOCKED || status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == locationConfig.LOCATION_DENIED) {
      Alert.alert(message.alert, message.enablePermission, [
        {
          text: message.ok,
          onPress: () => {
            BackHandler.exitApp();
            Linking.openSettings();
          },
        },
      ]);
      return locationConfig.LOCATION_BLOCKED;
    } else {
      return request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
  }).catch(() => {
    return false;
  });
};

export const getNearestStop = async (location) => {
  try {
    let routeStops = await AsyncStorage.getItem(storageConfig.STOPS_DATA);
    routeStops = routeStops ? JSON.parse(routeStops) : {};

    let appSetting = await AsyncStorage.getItem(storageConfig.SETTINGS_DATA);
    appSetting = appSetting ? JSON.parse(appSetting) : {};

    let allStops = routeStops?.routes?.upcoming_stops.concat(routeStops?.routes?.next_stop, routeStops?.routes?.incomplete_stops);

    let findStop = allStops?.length && allStops.map((stop) => {
      let stopLocation = {
        latitude: stop?.latlng?.lat,
        longitude: stop?.latlng?.lng
      }

      let stopDistance = calculateDistance(location?.coords, stopLocation);
      if (stopDistance <= appSetting?.key_value?.location_listner_threshold) {
        return {
          is_arrival: true,
          stop_id: stop?.stop_id
        }
      }
    }).filter(Boolean);

    findStop = findStop?.length && findStop.find((stop) => stop?.is_arrival);
    findStop?.stop_id && await AsyncStorage.setItem(storageConfig.STOP_ID, JSON.stringify(findStop?.stop_id));

    const findPickupStop = allStops?.length && allStops.filter((x) => (x.stop_type === storeType.PICKUP) && (x.stop_status === stopStatus.OUT_FOR_PICKUP));
    return {
      findStop,
      findPickupStop
    }
  } catch (error) {
    return {
      findStop: {},
      findPickupStop: {}
    }
  }
}

let lastLocation = null;
let locationData = [];
let uploading = false;

export const validateAndSyncLocation = async (location, routeInfo, userData) => {
  if (routeInfo?.sub_status === routeStatus.ROUTE_PAUSED) {
    return;
  }
  const nearestStop = await getNearestStop(location);
  if (locationData.length == 0) {
    let backdata = await AsyncStorage.getItem(storageConfig.SAVE_LOCATION);
    locationData = backdata ? JSON.parse(backdata) : [];
  }

  let newLocation = {
    latitude: location?.coords?.latitude,
    longitude: location?.coords?.longitude,
    timestamp: location?.timestamp,
    mock: location?.mock ? location?.mock : false,
    speed: location?.speed,
    is_arrival: nearestStop?.is_arrival ? nearestStop?.is_arrival : false
  }

  lastLocation = await AsyncStorage.getItem(storageConfig.LASTLOCATION);
  lastLocation = lastLocation ? JSON.parse(lastLocation) : null

  if (lastLocation) {
    const distance = calculateDistance(lastLocation, newLocation);
    const newTime = Math.round((new Date(newLocation.timestamp)).getTime() / 1000);
    const oldTime = Math.round((new Date(lastLocation.timestamp)).getTime() / 1000);
    const time_diff = newTime - oldTime

    // for avoid inaccurate latlng
    if (newLocation.speed <= 1 || distance <= 15 || (time_diff <= 2 && distance > 100) || distance == 0) {
      return
    }
  }

  await AsyncStorage.setItem(storageConfig.LASTLOCATION, JSON.stringify(newLocation));

  if (locationData.length >= 2) {
    const firstDis = calculateDistance(locationData[locationData.length - 2], locationData[locationData.length - 1]);
    const SecDis = calculateDistance(locationData[locationData.length - 2], newLocation);
    if (firstDis > SecDis) {
      locationData.splice(locationData.length - 1, 1);
    }
  }

  locationData.push(newLocation);

  await AsyncStorage.setItem(storageConfig.SAVE_LOCATION, JSON.stringify(locationData));
  const data = await AsyncStorage.getItem(storageConfig.SAVE_LOCATION);
  const newData = data ? JSON.parse(data) : [];
  const is_api = await AsyncStorage.getItem(storageConfig.SAVE_API);
  const netInfo = await getNetInfo();
  if (uploading || is_api == 'true' || !netInfo || newData.length < 8) {
    return;
  }

  const validateRoute = validateEmptyObject(routeInfo);
  if (validateRoute) {
    return;
  }
  const batteryLevel = (await DeviceInfo.getBatteryLevel()) * 100;
  const locationParams = {
    driver_status: 1,
    stop_id: nearestStop?.findStop?.stop_id ? nearestStop?.findStop?.stop_id : null,
    route_id: routeInfo.id,
    warehouse_in: true,
    battery_percentage: parseInt(batteryLevel),
    location: newData,
    event: null,
    type: nearestStop?.findStop?.type ? nearestStop?.findStop?.type : null,
    user_id: nearestStop?.findStop?.user_id ? nearestStop?.findStop?.user_id : null,
    dest_location: nearestStop?.findStop?.dest_location ? nearestStop?.findStop?.dest_location : null,
    pickups: nearestStop?.findPickupStop ?? null
  };
  uploading = true;
  const response = await sendLocations(userData?.user_id, locationParams);
  uploading = false;
  if (response?.status) {
    AsyncStorage.removeItem(storageConfig.SAVE_LOCATION);
    locationData = [];
  }
};

let eventEmitterLsitner = null;
let isGpsEnabled = null;
// Location Subscribing
export const subscribeLocation = async () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
  eventEmitterLsitner != null ? eventEmitterLsitner.remove() : null;
  const eventEmitter = new NativeEventEmitter(NativeModules.LocationManager);
  eventEmitter.removeAllListeners('location_received');
  eventEmitterLsitner = eventEmitter.addListener(
    "location_received",
    (location) => {
      if (location.JS_LOCATION_EMIT_TYPE == 2) {
        if (isGpsEnabled != location.isGpsEnabled) {
          // IS GPS IS ON OR NOT
        }
      } else {
        const modifiedLocation = {
          coords: {
            latitude: location?.latitude,
            longitude: location?.longitude,
          },
          timestamp: moment(location?.timestamp).utc(),
          mock: location?.isMockLocation,
          speed: location?.speed
        }

        console.log("loaction tracking =>", modifiedLocation);

      }
    }
  );
}




export const startBackgroundLocation = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      const grantedCOARSE = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );
      if (grantedCOARSE === PermissionsAndroid.RESULTS.GRANTED) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED || Platform.Version < 29) {
          let result = await enableGpsLocation();
          if (result) {
            const batteryOptimizationEnabled = await notifee.isBatteryOptimizationEnabled();
            if (batteryOptimizationEnabled) {
              // 2. ask your users to disable the feature
              Alert.alert(
                'Restrictions Detected',
                'Please disable battery optimization for the app.',
                [
                  // 3. launch intent to navigate the user to the appropriate screen
                  {
                    text: 'OK, open settings',
                    onPress: async () => BackGroundLocation.openBatteryOptimizations(),
                  },
                  {
                    text: "Cancel",
                    onPress: () => {
                      Alert.alert(message.alert, message.enablePermission, [
                        {
                          text: message.ok,
                          onPress: () => {
                            BackHandler.exitApp();
                            Linking.openSettings();
                          },
                        },
                      ]);
                    },
                    style: "cancel"
                  },
                ],
                { cancelable: false }
              );
              reject();
            } else {
              BackGroundLocation.startBackgroundLocation();
              AsyncStorage.removeItem(storageConfig.LASTLOCATION);
              resolve();
            };
          } else {
            Alert.alert(message.alert, message.enablePermission, [
              {
                text: message.ok,
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ]);
            reject();
          }
        } else {
          Alert.alert(message.alert, message.enablePermission, [
            {
              text: message.ok,
              onPress: () => {
                BackHandler.exitApp();
                Linking.openSettings();
              },
            },
          ]);
          reject();
        }
      } else {
        Alert.alert(message.alert, message.enablePermission, [
          {
            text: message.ok,
            onPress: () => {
              BackHandler.exitApp();
              Linking.openSettings();
            },
          },
        ]);
        reject();
      }

    } catch (err) {
      console.warn(err);
      reject();
    }
  })
}

export const stopBackgroundLocation = () => {
  BackGroundLocation.stopBackgroundLocation()
}


let isSubmitted = false;
export const isServiceKillItSelf = () => {
  BackGroundLocation.isServiceKillItSelf((_isServiceKillItSelf) => {
    if (_isServiceKillItSelf && !isSubmitted) {
      isSubmitted = true;
    }
  });
}
