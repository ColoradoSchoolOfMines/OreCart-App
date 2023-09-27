import * as Location from 'expo-location';

export interface Coordinate {
  lat: number,
  lon: number
}

export async function getUserLocation(): Promise<Coordinate | null> {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    // TODO: Show prompt for locations when not granted.
    return null;
  }

  let location = await Location.getCurrentPositionAsync({});
  return {
    lat: location.coords.latitude,
    lon: location.coords.longitude
  };
}
