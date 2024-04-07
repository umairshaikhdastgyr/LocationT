package com.driver.dastgyr;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import static android.content.Context.ACTIVITY_SERVICE;
import static android.content.Context.POWER_SERVICE;


public class LocationModule extends ReactContextBaseJavaModule implements LocationEventReceiver, JSEventSender {
    private static final String MODULE_NAME = "LocationManager";
    private static final String CONST_JS_LOCATION_EVENT_NAME = "JS_LOCATION_EVENT_NAME";
    private static final String CONST_JS_LOCATION_LAT = "JS_LOCATION_LAT_KEY";
    private static final String CONST_JS_LOCATION_LON = "JS_LOCATION_LON_KEY";
    private static final String CONST_JS_LOCATION_TIME = "JS_LOCATION_TIME_KEY";
    static boolean isSupervisor = false;

    private Context mContext;
    private Intent mForegroundServiceIntent;
    private BroadcastReceiver mEventReceiver;
    private Gson mGson;

    LocationModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        mForegroundServiceIntent = new Intent(mContext, LocationForegroundService.class);
        mGson = new Gson();
        createEventReceiver();
        registerEventReceiver();
        Log.i("TAG-NATIVE", "LocationModule: ");
    }

    @ReactMethod
    public void startBackgroundLocation() {
        if (!isServiceRunning(mContext)){
            SharedPreferences sharedPref = mContext.getSharedPreferences(
                    "MyPrefs", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putBoolean("Is_Service_Started", true);
            editor.apply();
            editor.commit();
            ContextCompat.startForegroundService(mContext, mForegroundServiceIntent);
        }
    }


    @ReactMethod
    public void restartService() {
        if (!isServiceRunning(mContext)){
            Intent intent = new Intent(mContext, LocationForegroundService.class);
            ContextCompat.startForegroundService(mContext, intent);
        }
    }


    @ReactMethod
    public boolean isIgnoringBatteryOptimizations() {
        boolean sIgnoring = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent();
            String packageName = mContext.getPackageName();
            PowerManager pm = (PowerManager) mContext.getSystemService(POWER_SERVICE);
            sIgnoring = pm.isIgnoringBatteryOptimizations(packageName);
        }
        return sIgnoring;
    }

    @ReactMethod
    public void openBatteryOptimizations() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent();
            String packageName = mContext.getPackageName();
            PowerManager pm = (PowerManager) mContext.getSystemService(POWER_SERVICE);
            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + packageName));
                mContext.startActivity(intent);
            }
        }
    }


  @ReactMethod
    public void isServiceKillItSelf(Callback booleanCallback) {
         SharedPreferences sharedPref = mContext.getSharedPreferences(
                "MyPrefs", Context.MODE_PRIVATE);
        if (sharedPref.getBoolean("Is_Service_Started", false) && (!isServiceRunning(mContext))) {
         booleanCallback.invoke(true);
        }else{
         booleanCallback.invoke(false);
        }
    }

    @ReactMethod
    public void stopBackgroundLocation() {
        if (isServiceRunning(mContext)){
            SharedPreferences sharedPref = mContext.getSharedPreferences(
                    "MyPrefs", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putBoolean("Is_Service_Started", false);
            editor.apply();
            editor.commit();
             mContext.stopService(mForegroundServiceIntent);
        }
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(CONST_JS_LOCATION_EVENT_NAME, LocationForegroundService.JS_LOCATION_EVENT_NAME);
        constants.put(CONST_JS_LOCATION_LAT, LocationForegroundService.JS_LOCATION_LAT_KEY);
        constants.put(CONST_JS_LOCATION_LON, LocationForegroundService.JS_LOCATION_LON_KEY);
        constants.put(CONST_JS_LOCATION_TIME, LocationForegroundService.JS_LOCATION_TIME_KEY);
        return constants;
    }

    @ReactMethod
    public static boolean isServiceRunning(Context mContext){
        boolean serviceRunning = false;
        ActivityManager am = (ActivityManager) mContext.getSystemService(ACTIVITY_SERVICE);
        List<ActivityManager.RunningServiceInfo> l = am.getRunningServices(50);
        Iterator<ActivityManager.RunningServiceInfo> i = l.iterator();
        while (i.hasNext()) {
            ActivityManager.RunningServiceInfo runningServiceInfo = i
                    .next();

            if(runningServiceInfo.service.getClassName().equals("com.driver.dastgyr.LocationForegroundService")){
                serviceRunning = true;

                if(runningServiceInfo.foreground){
                    //service run in foreground
                }
            }
        }
        return serviceRunning;
    }



    @Nonnull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @Override
    public void createEventReceiver() {
        mEventReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if(intent.getAction().equals(LocationForegroundService.PROVIDER_EVENT_NAME)){
                    Log.i("TAG-NATIVE  ", "onReceive: "+intent.getBooleanExtra("isGpsEnabled", false));
                    WritableMap eventData = Arguments.createMap();
                    eventData.putInt(
                            LocationForegroundService.JS_LOCATION_EMIT_TYPE,
                            2);
                    eventData.putBoolean("isGpsEnabled", intent.getBooleanExtra("isGpsEnabled", false));
                    sendEventToJS(getReactApplicationContext(),
                            LocationForegroundService.JS_LOCATION_EVENT_NAME, eventData);
                }else {
                    LocationCoordinates locationCoordinates = mGson.fromJson(
                            intent.getStringExtra(LocationForegroundService.LOCATION_EVENT_DATA_NAME), LocationCoordinates.class);
                    WritableMap eventData = Arguments.createMap();
                    eventData.putInt(
                            LocationForegroundService.JS_LOCATION_EMIT_TYPE,
                            1);
                    eventData.putDouble(
                            LocationForegroundService.JS_LOCATION_LAT_KEY,
                            locationCoordinates.getLatitude());
                    eventData.putDouble(
                            LocationForegroundService.JS_LOCATION_LON_KEY,
                            locationCoordinates.getLongitude());
                    eventData.putDouble(
                            LocationForegroundService.JS_LOCATION_TIME_KEY,
                            locationCoordinates.getTimestamp());

                    eventData.putDouble(
                            LocationForegroundService.JS_SPEED_KEY,
                            locationCoordinates.getSpeed());

                    eventData.putDouble(
                            LocationForegroundService.JS_SPEED_PER_SEC_KEY,
                            locationCoordinates.getSpeedAccuracyMetersPerSecond());

                    eventData.putBoolean(
                            LocationForegroundService.JS_IS_MOCK_KEY,
                            locationCoordinates.getMockProvider());
                    // if you actually want to send events to JS side, it needs to be in the "Module"
                    sendEventToJS(getReactApplicationContext(),
                            LocationForegroundService.JS_LOCATION_EVENT_NAME, eventData);
                }
            }
        };
    }




    @Override
    public void registerEventReceiver() {
        IntentFilter eventFilter = new IntentFilter();
        eventFilter.addAction(LocationForegroundService.LOCATION_EVENT_NAME);
        eventFilter.addAction(LocationForegroundService.PROVIDER_EVENT_NAME);
        mContext.registerReceiver(mEventReceiver, eventFilter);
    }

    @Override
    public void sendEventToJS(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        Log.i("TAG-NATIVE", "sendEventToJS: ");
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}