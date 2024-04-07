package com.driver.dastgyr;

import android.app.ActivityManager;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.bridge.ReactMethod;

import java.util.Iterator;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class MainActivity extends ReactActivity {


  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    IntentFilter filter = new IntentFilter();
    filter.addAction(LocationManager.PROVIDERS_CHANGED_ACTION);
    filter.addAction(Intent.ACTION_BOOT_COMPLETED);
    filter.addAction(Intent.ACTION_SCREEN_OFF);
    filter.addAction(Intent.ACTION_SCREEN_ON);
// Add other actions as needed

    MyReceiver receiver = new MyReceiver();
    registerReceiver(receiver, filter);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */



  @Override
  protected String getMainComponentName() {
    return "DriverApp";
  }

  @Override
  public void applyOverrideConfiguration(Configuration overrideConfiguration) {
    if (Build.VERSION.SDK_INT >= 21 && Build.VERSION.SDK_INT <= 25) {
      return;
    }
    super.applyOverrideConfiguration(overrideConfiguration);
  }

  
  public boolean isServiceRunning(){
    boolean serviceRunning = false;
    ActivityManager am = (ActivityManager) getSystemService(ACTIVITY_SERVICE);
    List<ActivityManager.RunningServiceInfo> l = am.getRunningServices(50);
    Iterator<ActivityManager.RunningServiceInfo> i = l.iterator();
    while (i.hasNext()) {
      ActivityManager.RunningServiceInfo runningServiceInfo = i
              .next();

      if(runningServiceInfo.service.getClassName().equals("com.driver.dastgyr.LocationService")){
        serviceRunning = true;

        if(runningServiceInfo.foreground){
          //service run in foreground
        }
      }
    }
    return serviceRunning;
  }

}
