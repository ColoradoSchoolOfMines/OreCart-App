# Ore Cart App Frontend

The Ore Cart App's frontend is using react native and typescript.

# Setup

## Requirements
- Node 18.15.0 
- npm or yarn

## Install Dependencies
- cd into the frontend directory `cd frontend`
- `npm install` or `yarn install`

# Quickly running the app

## Configuring networking
For the app to fully function, it must contact the backend server. For the purposes of development, it's recommended
to start a local server and then configure the app to access it.

1. Obtain your LAN IP address (Not your real one!).
  - On Windows:
    1. Open the Command Line or PowerShell
    2. Type `ipconfig` and press enter.
    3. Look for the "IPv4 Address" under the "Ethernet adapter" or "Wireless LAN adapter" section. The number next to
    it is your IP address on the local network.
2. Start the backend server. You can find instructions for that in th `/backend/` README.
3. Create a `.env` file, if you haven't already. This contains information required for the app to build properly.
4. Add the following line: `ORECART_API_DOMAIN=<Your IP from Step 1>:8000.` ***NEVER COMMIT THIS!*** Your IP is
private information and cannot be used by anyone else!

## Starting the expo server
- `npm start` or `yarn start`
- This will start the expo server and show a QR code

## Opening the app
- download Expo Go on your mobile device
- scan the QR code shown by the server earlier. this will open the app

# Building

This project uses EAS locally to produce builds. Two types of builds have been configured:
- Preview builds, which are APKs/IPAs that can be easily tested
- Production builds, which are AABs/IPAs that can only be submitted to the Googe Play store

## Requirements
- Android SDK (Android builds only)
- Java 11 explicitly pointed to by JAVA_HOME (Android builds only)
- Xcode (iOS builds only)

## Configure eas.json

In eas.json, you must add Google Maps API keys for the embedded map to function. These are set with
the `GOOGLE_MAPS_API_KEY_ANDROID` and `GOOGLE_MAPS_API_KEY_IOS` entry in the `env` section of `eas.json`.
- Preview builds can use a simple unrestricted API key
- Production builds should use restricted API keys that differ between iOS and Android

You can read more about api key config in the [MapView Documentation](https://docs.expo.dev/versions/latest/sdk/map-view/)

## Building on Android

You can then create a preview build with this:

```
npx eas build -p android --local -e preview --output builds/OreCart_Preview.apk
```

You can then create a production build with this:

```
npx eas build -p android --local -e production --output builds/OreCart_Production.apk
```

## Building on iOS

Run the following command:

```
npx eas build -p ios --local
```

Note: You may need Xcode simulator runtimes if the build terminates on the "run fastlane" step; see [this article](https://developer.apple.com/documentation/xcode/installing-additional-simulator-runtimes) for more information.

# Development Overview

The Ore Cart Frontend will be used by students of Mines and residents of Golden to better utilize the Ore Cart. 

For more details checkout the google drive.

# Development Standards

More details to come here. This section will eventually outline expectations for code being committed to the frontend.
