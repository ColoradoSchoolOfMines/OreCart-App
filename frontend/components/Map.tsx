import MapView from 'react-native-maps';
import { Marker, Region, LatLng } from 'react-native-maps';
import { StyleSheet, ViewStyle } from 'react-native';
import { Coordinate } from '../services/location'

// Used by default when location is unavailable.
const MAPLE_PLAZA: Coordinate = {
  lat: 39.7512546,
  lon: -105.2195490
}

export function Map(props: MapProps) {
  return (
    <MapView style={styles.map}
      initialRegion={getNearbyRegion(MAPLE_PLAZA)}
      region={getNearbyRegion(props.currentLocation ? props.currentLocation : MAPLE_PLAZA)}>
      {props.currentLocation && <Marker coordinate={asLatLng(props.currentLocation)} />}
    </MapView>
  )
}

export interface MapProps {
  style: ViewStyle,
  currentLocation: Coordinate | null
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  }
})

function getNearbyRegion(coord: Coordinate): Region {
  return {
    latitude: coord.lat,
    longitude: coord.lon,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  }
}

function asLatLng(coord: Coordinate): LatLng {
  return {
    latitude: coord.lat,
    longitude: coord.lon
  }
}
