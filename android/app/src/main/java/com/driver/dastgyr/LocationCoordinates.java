package com.driver.dastgyr;

public class LocationCoordinates {
    private Double Latitude;
    private Double longitude;
    private Double timestamp;

    private Float speed;

    private Float SpeedAccuracyMetersPerSecond;

    private Boolean MockProvider;

    public Double getLatitude() {
        return Latitude;
    }

    public void setLatitude(Double latitude) {
        Latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Double timestamp) {
        this.timestamp = timestamp;
    }

    public Float getSpeed() {
        return speed;
    }

    public void setSpeed(Float speed) {
        this.speed = speed;
    }

    public Float getSpeedAccuracyMetersPerSecond() {
        return SpeedAccuracyMetersPerSecond;
    }

    public void setSpeedAccuracyMetersPerSecond(Float speedAccuracyMetersPerSecond) {
        SpeedAccuracyMetersPerSecond = speedAccuracyMetersPerSecond;
    }

    public Boolean getMockProvider() {
        return MockProvider;
    }

    public void setMockProvider(Boolean mockProvider) {
        MockProvider = mockProvider;
    }
}
