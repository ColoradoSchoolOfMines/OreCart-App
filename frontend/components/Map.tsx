import MapView, { Marker, type Region } from 'react-native-maps'
import { StyleSheet, type ViewStyle } from 'react-native'
import { type Coordinate } from '../services/location'

/**
 * Maple plaza is the circular area near the student center & brown hall that has
 * the statue. Used by default when the location cannot be obtained yet.
 */
const MAPLE_PLAZA: Coordinate = {
  latitude: 39.7512546,
  longitude: -105.2195490
}

/**
 * Wraps the expo {@interface MapView} with additional functionality defined
 * in {@interface MapProps}.
 */
export function Map (props: MapProps): any {
  return (
    <MapView style={styles.map}
      initialRegion={getNearbyRegion(MAPLE_PLAZA, RANGE_NEARBY)}
      region={getNearbyRegion(props.currentLocation ?? MAPLE_PLAZA, RANGE_NEARBY)}>
      {(props.currentLocation !== null) && <Marker coordinate={props.currentLocation} />}
    </MapView>
  )
}

export interface MapProps {
  /** The style to apply to the view. */
  style: ViewStyle
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

// Close enough to see nearby roads and OreCarts.
const RANGE_NEARBY = 0.002

function getNearbyRegion (coord: Coordinate, range: number): Region {
  // +/- 0.001 is generally close enough to see nearby roads but not so far out as to show
  // irrelevant information.
  return {
    latitude: coord.latitude,
    longitude: coord.longitude,
    latitudeDelta: range,
    longitudeDelta: range
  }
}
