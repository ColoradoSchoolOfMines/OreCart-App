import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { View, StyleSheet, type ViewProps, StatusBar } from 'react-native'
import { type Coordinate } from '../services/location'
import LocationButton from './LocationButton'
import React, { useRef, useMemo, useState } from 'react'
import LayoutStyle from '../style/layout'
import SpacingStyle, { type Insets } from '../style/spacing'

interface MapProps extends ViewProps {
  /** 
   * The {@interface Insets} to pad map information with. Useful if map information will be
   * obscured. Note that status bar insets will already be applied, so don't include those.
   */
  insets?: Insets
}

/**
 * A wrapper around react native {@class MapView} that provides a simplified interface for the purposes of this app.
 */
const Map: React.FC<MapProps> = ({ insets }) => {
  const mapRef = useRef<MapView>(null)
  const [followingLocation, setFollowingLocation] = useState<boolean>(true)
  const [lastLocation, setLastLocation] = React.useState<Coordinate | undefined>(undefined)

  function panToLocation(location: Coordinate | undefined): void {
    if (location !== undefined && mapRef.current != null) {
      mapRef.current.animateCamera({
        center: location,
        zoom: 17
      })
    }
  }

  function updateLocation(location: Coordinate | undefined): void {
    // Required if we need to re-toggle location following later, which requires
    // us to pan the camera to whatever location we were last given. Always track
    // this regardless of if following is currently on.
    setLastLocation(location)
    if (followingLocation) {
      panToLocation(location)
    }
  }

  function flipFollowingLocation(): void {
    setFollowingLocation(followingLocation => {
      // There will be some delay between the next location update and when the
      // location button was toggled, so we need to immediately pan now with the
      // last location we got.
      if (!followingLocation) {
        panToLocation(lastLocation)
      }
      return !followingLocation
    })
  }

  // Combine given insets with the status bar height to ensure that the map
  // is fully in-bounds.
  const statusBarInset = useMemo(() => StatusBar.currentHeight ?? 0, [])
  const padding = {
    top: (insets?.top ?? 0) + statusBarInset,
    left: (insets?.left ?? 0),
    bottom: (insets?.bottom ?? 0),
    right: (insets?.right ?? 0)
  }

  return (
    <View>
      <MapView style={LayoutStyle.fill}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        mapPadding={padding}
        onPanDrag={() => { setFollowingLocation(false) }}
        onUserLocationChange={event => { updateLocation(event.nativeEvent.coordinate) }} />
      { /* Layer the location button on the map instead of displacing it. */ }
      <View style={[LayoutStyle.overlay, SpacingStyle.pad(padding, 16), styles.locationButtonContainer]}>
        <LocationButton isActive={followingLocation} 
          onPress={() => { flipFollowingLocation() }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  locationButtonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  }
})

export default Map;