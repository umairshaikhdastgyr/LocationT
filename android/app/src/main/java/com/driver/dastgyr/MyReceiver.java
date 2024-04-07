package com.driver.dastgyr;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MyReceiver extends BroadcastReceiver {
    private String TAG = "MyReceiver";

    private int count = 0;

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction() != null && intent.getAction().equals(LocationManager.PROVIDERS_CHANGED_ACTION)) {
            count += 1;
            if(count == 3){
                checkGpsStatus(context);
                callWorker(context);
                count = 0;
            }
        }else {
            callWorker(context);
        }
    }

    private void callWorker(Context context) {
        WorkManager workManager = WorkManager.getInstance(context);
        OneTimeWorkRequest startServiceRequest = new OneTimeWorkRequest.Builder(MyWorker.class)
                .build();
        workManager.enqueue(startServiceRequest);
    }

    private void checkGpsStatus(Context context) {
        LocationManager locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        boolean isGpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        broadcastLocationReceived(context, isGpsEnabled);
    }

    private void broadcastLocationReceived(Context context, Boolean isGpsEnabled) {
        Intent eventIntent = new Intent(LocationForegroundService.PROVIDER_EVENT_NAME);
        eventIntent.putExtra("isGpsEnabled", isGpsEnabled);
        context.sendBroadcast(eventIntent);
    }
}