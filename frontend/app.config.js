let httpApiUrl;
let wsApiUrl;

// If set to secure, use wss://
if (process.env.ORECART_API_SECURE === "1") {
  httpApiUrl = `https://${process.env.ORECART_API_DOMAIN}`;
  wsApiUrl = `wss://${process.env.ORECART_API_DOMAIN}`;
} else {
  httpApiUrl = `http://${process.env.ORECART_API_DOMAIN}`;
  wsApiUrl = `ws://${process.env.ORECART_API_DOMAIN}`;
}


module.exports = {
  name: "OreCart",
  slug: "orecart",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "edu.mines.orecart.app",
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS
    }
  },
  android: {
    package: "edu.mines.orecart.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    permissions: [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.FOREGROUND_SERVICE"
    ],
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID
      }
    }
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "Allow OreCart to use your location."
      }
    ]
  ],
  extra: {
    httpApiUrl,
    wsApiUrl,
    eas: {
      projectId: "a3e0fe9f-6732-488e-8a42-be63d20b24f9"
    }
  },
  owner: "orecart"
}