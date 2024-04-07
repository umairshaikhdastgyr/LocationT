package com.driver.dastgyr;

import android.Manifest;
import android.app.ActivityManager;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;
import com.google.gson.Gson;

import java.util.Date;
import java.util.concurrent.TimeUnit;

public class LocationForegroundService extends Service implements LocationEventReceiver{
    public static final String CHANNEL_ID = "ForegroundServiceChannel";
    public static final int NOTIFICATION_ID = 1;
    public static final String LOCATION_EVENT_NAME = "com.driver.dastgyr.LOCATION_INFO";

    public static final String PROVIDER_EVENT_NAME = "com.driver.dastgyr.PROVIDER_INFO";
    public static final String LOCATION_EVENT_DATA_NAME = "LocationData";
    public static final int LOCATION_UPDATE_INTERVAL = 60000;
    public static final String JS_LOCATION_LAT_KEY = "latitude";
    public static final String JS_LOCATION_EMIT_TYPE = "JS_LOCATION_EMIT_TYPE";
    public static final String JS_LOCATION_LON_KEY = "longitude";
    public static final String JS_LOCATION_TIME_KEY = "timestamp";

    public static final String JS_SPEED_KEY = "speed";

    public static final String JS_SPEED_PER_SEC_KEY = "SpeedAccuracyMetersPerSecond";

    public static final String JS_IS_MOCK_KEY = "isMockLocation";
    public static final String JS_LOCATION_EVENT_NAME = "location_received";

    private AlarmManager mAlarmManager;

    private AlarmManager mAlarmManager2;
    private BroadcastReceiver mEventReceiver;
    private PendingIntent mLocationBackgroundServicePendingIntent;
    private PendingIntent mLocationBackgroundServicePendingIntentAlternative;
    private Gson mGson;


    private FusedLocationProviderClient mFusedLocationClient;
    private LocationCallback mLocationCallback = null;


    @Override
    public void onCreate() {
        super.onCreate();
        mAlarmManager = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        mAlarmManager2 = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        mGson = new Gson();
        createEventReceiver();
        registerEventReceiver();
        Log.i("TAG-NATIVE", "onCreate: ");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        createNotificationChannel();
        startForeground(NOTIFICATION_ID, createNotification());
        Log.i("TAG-NATIVE", "onStartCommand: ");

        ActivityManager.RunningAppProcessInfo myProcess = new ActivityManager.RunningAppProcessInfo();
        ActivityManager.getMyMemoryState(myProcess);
        if(myProcess.importance != ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND){
            Intent service = new Intent(getApplicationContext(), MyTaskService.class);
            Bundle bundle = new Bundle();
            
            bundle.putString("foo", "bar");
            service.putExtras(bundle);

            getApplicationContext().startService(service);
        }

        createLocationPendingIntent();
        mAlarmManager.setRepeating(
                AlarmManager.RTC,
                System.currentTimeMillis(),
                LOCATION_UPDATE_INTERVAL,
                mLocationBackgroundServicePendingIntent
        );

        mAlarmManager2.setExact(
                AlarmManager.RTC,
                System.currentTimeMillis()+3000,
                mLocationBackgroundServicePendingIntentAlternative
        );

        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(getApplicationContext());
        requestLocationUpdates();

        return START_STICKY;
    }

    private void requestLocationUpdates() {
        mLocationCallback = createLocationRequestCallback();
        LocationRequest locationRequest = LocationRequest.create()
                .setPriority(Priority.PRIORITY_HIGH_ACCURACY)
                .setInterval(1000)
                .setFastestInterval(1000);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        mFusedLocationClient.requestLocationUpdates(locationRequest, mLocationCallback, getMainLooper());
    }

    private LocationCallback createLocationRequestCallback() {
        return new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                Log.i("TAG-NATIVE", "onLocationResult: 2");
                if (locationResult == null) {
                    return;
                }
                for (Location location : locationResult.getLocations()) {
                    LocationCoordinates locationCoordinates = null;
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                        locationCoordinates = createCoordinates(location.getLatitude(), location.getLongitude(), location.getSpeed(), location.getSpeedAccuracyMetersPerSecond(), location.isFromMockProvider());
                    }else {
                        locationCoordinates = createCoordinates(location.getLatitude(), location.getLongitude(), location.getSpeed(), location.getSpeed(), location.isFromMockProvider());
                    }
                    broadcastLocationReceived(locationCoordinates);
                }
            }
        };
    }

    private LocationCoordinates createCoordinates(double latitude, double longitude, float speed, float SpeedAccuracyMetersPerSecond, boolean MockProvider) {
        LocationCoordinates locationCoordinates = new LocationCoordinates();
        locationCoordinates.setLatitude(latitude);
        locationCoordinates.setLongitude(longitude);
        locationCoordinates.setTimestamp((double) new Date().getTime());
        locationCoordinates.setSpeed(speed);
        locationCoordinates.setSpeedAccuracyMetersPerSecond(SpeedAccuracyMetersPerSecond);
        locationCoordinates.setMockProvider(MockProvider);
        return locationCoordinates;
    }

    @Override
    public void createEventReceiver() {
        mEventReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                LocationCoordinates locationCoordinates = mGson.fromJson(
                        intent.getStringExtra(LOCATION_EVENT_DATA_NAME), LocationCoordinates.class);
                /*
                TODO: do any kind of logic in here with the LocationCoordinates class
                e.g. like a request to an API, etc --> all on the native side
                */
            }
        };
    }

    private void broadcastLocationReceived(LocationCoordinates locationCoordinates) {
        Intent eventIntent = new Intent(LocationForegroundService.LOCATION_EVENT_NAME);
        eventIntent.putExtra(LocationForegroundService.LOCATION_EVENT_DATA_NAME, mGson.toJson(locationCoordinates));
        getApplicationContext().sendBroadcast(eventIntent);
    }

    @Override
    public void registerEventReceiver() {
        IntentFilter eventFilter = new IntentFilter();
        eventFilter.addAction(LOCATION_EVENT_NAME);
        registerReceiver(mEventReceiver, eventFilter);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        Log.i("TAG-NATIVE", "onDestroy:");
        unregisterReceiver(mEventReceiver);
        mAlarmManager.cancel(mLocationBackgroundServicePendingIntent);
        mFusedLocationClient.removeLocationUpdates(mLocationCallback);
        stopSelf();
        super.onDestroy();
    }


    public void startServiceViaWorker() {
        String UNIQUE_WORK_NAME = "StartMyServiceViaWorker";
        WorkManager workManager = WorkManager.getInstance(this);

        // As per Documentation: The minimum repeat interval that can be defined is 15 minutes
        // (same as the JobScheduler API), but in practice 15 doesn't work. Using 16 here
        PeriodicWorkRequest request =
                new PeriodicWorkRequest.Builder(
                        MyWorker.class,
                        16,
                        TimeUnit.MINUTES)
                        .build();

        // to schedule a unique work, no matter how many times app is opened i.e. startServiceViaWorker gets called
        // do check for AutoStart permission
        workManager.enqueueUniquePeriodicWork(UNIQUE_WORK_NAME, ExistingPeriodicWorkPolicy.KEEP, request);

    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Foreground Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );

            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }

    private Notification createNotification() {
        Intent fullScreenIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 1, fullScreenIntent, PendingIntent.FLAG_IMMUTABLE);

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Location Tracking")
                .setContentText("Stay Online for tracking.")
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .build();
        notification.flags = Notification.FLAG_ONGOING_EVENT;
        return notification;
    }


    private void createLocationPendingIntent() {
        Intent i = new Intent(getApplicationContext(), LocationBackgroundService.class);
        mLocationBackgroundServicePendingIntent = PendingIntent.getService(getApplicationContext(), 1, i, PendingIntent.FLAG_IMMUTABLE);
        Intent i2 = new Intent(getApplicationContext(), LocationBackgroundServiceA.class);
        mLocationBackgroundServicePendingIntentAlternative = PendingIntent.getService(getApplicationContext(), 2, i2, PendingIntent.FLAG_IMMUTABLE);
    }

}