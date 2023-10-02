import MapView, { type Region } from 'react-native-maps'
import { StyleSheet, type ViewProps, Platform } from 'react-native'
import { type Coordinate } from '../services/location'
import { useRef, useState } from 'react'


const GOLDEN: Region = {
  latitude: 39.749675,
  longitude: -105.222606,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05
}

/**
 * Wraps the expo {@interface MapView} with additional functionality.
 */
export function Map(props: ViewProps): React.ReactElement<ViewProps> {
  const [userRegionChanged, setUserRegionChanged] = useState(false)
  const mapRef = useRef<MapView>(null)

  function followUserLocationAndroid(location: Coordinate | undefined): void {
    // We want to make sure we won't snap back to the user location if they decide to pan around,
    // so check if that's the case before panning.
    if (location !== undefined && mapRef.current != null && !userRegionChanged)  {
      mapRef.current.animateCamera({
        center: location,
        zoom: 17
      })
    }
  }

  return (
    <MapView style={styles.innerMap}
      ref={mapRef}
      initialRegion={GOLDEN}
      showsUserLocation={true}
      onRegionChange={() => { setUserRegionChanged(true) }}
      // Android only.
      showsMyLocationButton={false}
      // followsUserLocation is only available on iOS, so we must reimplement the behavior on Android
      // with onUserLocationChange.
      followsUserLocation={!userRegionChanged}
      onUserLocationChange={Platform.select({ 
        android: event => { followUserLocationAndroid(event.nativeEvent.coordinate) } 
      })} />
  )
}

const styles = StyleSheet.create({
  innerMap: {
    width: '100%',
    height: '100%'
  }
})
