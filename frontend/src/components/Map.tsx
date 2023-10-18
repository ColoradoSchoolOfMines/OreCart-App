import MapView, { type Region, PROVIDER_GOOGLE, type Details } from 'react-native-maps'
import { StyleSheet, type ViewProps, StatusBar } from 'react-native'
import { type Coordinate } from '../services/location'
import { useRef, useState, useMemo } from 'react'

const GOLDEN: Region = {
  latitude: 39.749675,
  longitude: -105.222606,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005
}

/**
 * Wraps the expo {@interface MapView} with additional functionality.
 */
export function Map(props: ViewProps & MapProps): React.ReactElement<ViewProps> {
  const [userRegionChanged, setUserRegionChanged] = useState(false)
  const mapRef = useRef<MapView>(null)

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

  function handleRegionChange(details: Details): void {
    // If the user is panning around, we don't want to snap back to their location. Note that we
    // make sure to exclude camera pans from this to avoid disabling location following at soon
    // as it changes.
    if (details.isGesture ?? true) {
      setUserRegionChanged(true) 
    }
  }

  const statusBarInset = useMemo(() => StatusBar.currentHeight ?? 0, [])
  const padding = {
    // We always inset by the status bar regardless of the user configuration.
    top: props.insets?.left ?? 0 + statusBarInset,
    left: props.insets?.left ?? 0,
    bottom: props.insets?.bottom ?? 0,
    right: props.insets?.right ?? 0
  }

  return (
    <MapView style={styles.innerMap}
      ref={mapRef}
      // Use Google Maps everywhere.
      provider={PROVIDER_GOOGLE}
      initialRegion={GOLDEN}
      showsUserLocation={true}
      showsMyLocationButton={false}
      mapPadding={padding}
      // followsUserLocation is only available on iOS maps, and isn't very cooperative anyway.
      // Reimplement it ourselves.
      onUserLocationChange={ event => { panToLocation(event.nativeEvent.coordinate) }}      
      onRegionChange={(_region, details) => { handleRegionChange(details) }} />
  )
}

/**
 * The props for the {@interface Map} component.
 */
export interface MapProps {
  /** The {@interface Insets} to apply to the map. */
  insets?: Insets
}

/**
 * The insets to apply to the {@interface Map} component when it will be obscured by
 * other components. This will shift map components like the google logo, and the way
 * that the map camera will pan around. Note that the component will already be insetting
 * by the status bar, so you don't need to include that in your insets.
 */
export interface Insets {
  /** The amount of space to inset from the top of the map. */
  top: number,
  /** The amount of space to inset from the left of the map. */
  left: number,
  /** The amount of space to inset from the bottom of the map. */
  bottom: number,
  /** The amount of space to inset from the right of the map. */
  right: number
}

const styles = StyleSheet.create({
  innerMap: {
    width: '100%',
    height: '100%'
  }
})
