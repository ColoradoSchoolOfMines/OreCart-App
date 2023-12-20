# Ore Cart App Frontend

The Ore Cart App's frontend is using react native and typescript.

# Running locally on your machine

## Requirements
- Node 18.15.0 
- npm or yarn

## Install Dependencies
- download Expo Go on your mobile device
- cd into the frontend directory `cd frontend`
- `npm install` or `yarn install`

## Run the app!!
- `npm start` or `yarn start`
- This will start the expo server and show a QR code, you can scan this with your phone to run the app on your phone.

## Get networking!

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
4. Add the following line: `EXPO_PUBLIC_API_DOMAIN=<Your IP from Step 1>:8000.` ***NEVER COMMIT THIS!*** Your IP is
private information and cannot be used by anyone else!

## Development Overview

The Ore Cart Frontend will be used by students of Mines and residents of Golden to better utilize the Ore Cart. 

For more details checkout the google drive.

## Development Standards

More details to come here. This section will eventually outline expectations for code being committed to the frontend.
