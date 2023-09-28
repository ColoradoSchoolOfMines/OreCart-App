import * as Location from 'expo-location';

/**
 * Implemenetation of latitude/longitude-based coordinates independent from any particular
 * mapping library.
 */
export interface Coordinate {
  lat: number,
  lon: number
}

/**
 * Callback for use with {@function subscribeUserLocation} that will update subscribers with
 * a user location value ever time it updated.
 */
export type LocationCallback = (location: Coordinate | null) => void

/**
 * Subscribe to the user's location over time, as {@interface Coordinate}
 * @param cb The {@type LocationCallback} that will recieve location updates.
 * @returns The {@interface Location.LocationSubscription} object that must be freed with 
 * {@function Location.LocationSubscription.remove} when the subscribing component is unmounted.
 */
export async function subscribeUserLocation(cb: LocationCallback): Promise<Location.LocationSubscription> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    // Permission was not granted, we can't do anything.
    // TODO: Show prompt for locations when not granted.
    cb(null);
  }

  // Component need the ability to remove their location subscription once unmounted, which requires access
  // to the handle object Expo returns, hence why we return it.
  return await Location.watchPositionAsync(
    { accuracy: ACCURACY },
    newLocation => cb(locationToCoordinate(newLocation))
  );
}

// This seems to be the only accuracy that's at least somewhat reliable for our purposes. Takes a few seconds
// to initialize and then updates every second or so.
const ACCURACY = Location.Accuracy.BestForNavigation

// --- Conversions ---

function locationToCoordinate(location: Location.LocationObject): Coordinate {
  return {
    lat: location.coords.latitude,
    lon: location.coords.longitude
  }
}