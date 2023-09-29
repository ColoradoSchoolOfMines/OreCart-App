import MapView from 'react-native-maps';
import { Marker, Region, LatLng } from 'react-native-maps';
import { StyleSheet, type ViewStyle } from 'react-native';
import { Coordinate } from '../services/location'

/**
 * Maple plaza is the circular area near the student center & brown hall that has
 * the statue. Used by default when the location cannot be obtained yet.
 */
const MAPLE_PLAZA: Coordinate = {
  lat: 39.7512546,
  lon: -105.2195490
}

/**
 * Wraps the expo {@interface MapView} with additional functionality defined
 * in {@interface MapProps}.
 */
export function Map(props: MapProps): any {
  return (
    <MapView style={styles.map}
      initialRegion={getNearbyRegion(MAPLE_PLAZA)}
      region={getNearbyRegion(props.currentLocation ? props.currentLocation : MAPLE_PLAZA)}>
      {props.currentLocation && <Marker coordinate={coordinateToLatLng(props.currentLocation)} />}
    </MapView>
  )
}

export interface MapProps {
  /** The style to apply to the view. */
  style: ViewStyle,
  /** 
   * The current user {@interface Coordinate} to show in the map. 
   * This will both center the region shown to the location, and
   * also place a pin at the location. 
   */
  currentLocation: Coordinate | null
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  }
})

function getNearbyRegion(coord: Coordinate): Region {
  // +/- 0.001 is generally close enough to see nearby roads but not so far out as to show
  // irrelevant information.
  return {
    latitude: coord.lat,
    longitude: coord.lon,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  }
}

function coordinateToLatLng(coord: Coordinate): LatLng {
  return {
    latitude: coord.lat,
    longitude: coord.lon
  }
}
