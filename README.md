# geotracker

Job tracking geolocation app.
=============================================

## Description


# Compatibility

Cli packages
=============================================

| Name                       | Version |
|----------------------------|---------|
| @ionic/cli-utils           | 1.19.2  |
| ionic (Ionic CLI)          | 3.20.0  |


Global packages
=============================================

| Name                       | Version |
|----------------------------|---------|
| cordova (Cordova CLI)      | 8.0.0   |


Local packages
=============================================

| Name                       | Version |
|----------------------------|---------|
| ionic/app-scripts          | 3.1.8   |
| Cordova Platform Android   | 7.0.0   |
| Cordova Platform iOS       | 4.5.4   |
| Ionic Framework Angular    | 3.9.2   |


System
=============================================

| Name                       | Version |
|----------------------------|---------|
| Android SDK Tools          | 26.1.1  |
| ios-deploy                 | 1.9.2   | 
| ios-sim                    | 5.0.11  | 
| Node                       | 8.9.4   |
| npm                        | 5.6.0   | 

## How to build

Build app

```
npm install
ionic serve -c --no-open (http://localhost:8001);

```

App will be built into `www` folder.


Replace platform with one of supported platforms: android, ios. In this example we will build for Android.

```
cordova platform add android
cordova platform add ios
cordova build android
```

There is *after_platform_add* hook in config.xml which runs script that install all required plugins.

## Build for device

### iOS
You will need to install ios-deploy package.

```
npm -g install ios-deploy
```

```
ionic cordova build ios
```

### Android
```
ionic cordova run android --device
```

## Run on device

### iOS
You will need to install ios-deploy package.

```
npm -g install ios-deploy
```

```
cordova run ios --device
```

### Android
```
cordova run android --device
```

## Run in simulator

### iOS
You will need to install ios-sim package first
```
npm -g install ios-sim
```

Run in default emulator
```
cordova emulate ios
```

You can use cordova run ios --list to see all available targets and cordova run ios --target=target_name to run application on a specific device or emulator (for example, cordova run ios --target="iPhone-6").


### Android
To deploy the app on a default Android emulator.

```
cordova emulate android
```

You can use cordova run android --list to see all available targets and cordova run android --target=target_name to run application on a specific device or emulator (for example, cordova run android --target="Nexus4_emulator").