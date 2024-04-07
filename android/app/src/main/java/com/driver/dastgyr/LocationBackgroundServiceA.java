package com.driver.dastgyr;

import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.IntentService;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.Nullable;

public class LocationBackgroundServiceA extends IntentService {
    public LocationBackgroundServiceA() {
        super(LocationForegroundService.class.getName());

    }

    @SuppressLint("MissingPermission")
    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        SharedPreferences sharedPref = getApplicationContext().getSharedPreferences(
                "MyPrefs", Context.MODE_PRIVATE);
        if (sharedPref.getBoolean("Is_Service_Started", false)) {
            Intent i2 = new Intent(getApplicationContext(), LocationBackgroundServiceA.class);
            AlarmManager mAlarmManager2 = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
            mAlarmManager2.setExact(
                    AlarmManager.RTC,
                    System.currentTimeMillis()+3000,
                    PendingIntent.getService(getApplicationContext(), 2, i2, PendingIntent.FLAG_IMMUTABLE)
            );
        }
        Log.i("TAG-NATIVE", "onHandleIntent: 2 ");
        Intent broadcastIntent = new Intent(this, MyReceiver.class);
        sendBroadcast(broadcastIntent);
    }
}