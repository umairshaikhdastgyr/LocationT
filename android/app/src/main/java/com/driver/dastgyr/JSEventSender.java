package com.driver.dastgyr;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;

import javax.annotation.Nullable;

public interface JSEventSender {
    void sendEventToJS(ReactContext reactContext, String eventName, @Nullable WritableMap params);
}
