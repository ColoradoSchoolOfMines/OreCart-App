import MapView, { type Region } from 'react-native-maps'
import { StyleSheet, type ViewProps, Dimensions, StatusBar } from 'react-native'
import { type Coordinate } from '../services/location'
import { useRef, useState } from 'react'
import { PROVIDER_GOOGLE } from 'react-native-maps'

const GOLDEN: Region = {
  latitude: 39.749675,
  longitude: -105.222606,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005
}

/**
 * Wraps the expo {@interface MapView} with additional functionality.
 */
export function Map(props: ViewProps): React.ReactElement<ViewProps> {
  const [userRegionChanged, setUserRegionChanged] = useState(false)
  const mapRef = useRef<MapView>(null)

  const { height } = Dimensions.get('window')
  const bottomInset = height / 2
  const topInset = StatusBar.currentHeight ?? 0

  function panToLocation(location: Coordinate | undefined): void {
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
      // Use Google Maps everywhere.
      provider={PROVIDER_GOOGLE}
      initialRegion={GOLDEN}
      showsUserLocation={true}
      showsMyLocationButton={false}
      mapPadding={{ top: topInset, left: 0, bottom: bottomInset, right: 0 }}
      // followsUserLocation is only available on iOS maps, and isn't very cooperative anyway.
      // Reimplement it ourselves.
      onUserLocationChange={ event => { panToLocation(event.nativeEvent.coordinate) }}      
      onRegionChange={(_region, details) => {
        // If the user/ is panning around, we don't want to snap back to their location. Note that we
        // make sure to exclude camera pans from this to avoid disabling location following at soon
        // as it changes.
        if (details.isGesture ?? true) {
          setUserRegionChanged(true) 
        }
      }} />
  )
}

const styles = StyleSheet.create({
  innerMap: {
    width: '100%',
    height: '100%'
  }
})
