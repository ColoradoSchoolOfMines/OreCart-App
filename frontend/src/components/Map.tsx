import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { View, StyleSheet, type ViewProps, StatusBar, type StyleProp, type ViewStyle } from 'react-native'
import { type Coordinate } from '../services/location'
import { LocationButton } from './LocationButton'
import React, { useRef, useMemo, useState } from 'react'

/**
 * A wrapper around react native {@class MapView} that provides a simplified interface for the purposes of this app.
 */
export function Map(props: MapProps & ViewProps): React.ReactElement<MapProps & ViewProps> {
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
    const newState = !followingLocation
    setFollowingLocation(newState)
    // There will be some delay between the next location update and when the
    // location button was toggled, so we need to immediately pan now with the
    // last location we got.
    if (newState) {
      panToLocation(lastLocation)
    }
  }

  // Combine given insets with the status bar height to ensure that the map
  // is fully in-bounds.
  const statusBarInset = useMemo(() => StatusBar.currentHeight ?? 0, [])
  const padding = {
    top: props.insets?.left ?? 0 + statusBarInset,
    left: props.insets?.left ?? 0,
    bottom: props.insets?.bottom ?? 0,
    right: props.insets?.right ?? 0
  }

  // Insets + 16dp padding & Bottom-end alignment
  const locationButtonContainerStyle: StyleProp<ViewStyle> = {
    ...StyleSheet.absoluteFillObject,
    paddingTop: padding.top + 16,
    paddingBottom: padding.bottom + 16,
    paddingLeft: padding.left + 16,
    paddingRight: padding.right + 16,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  }

  return (
    <View>
      <MapView style={styles.innerMap}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        mapPadding={padding}
        onPanDrag={() => { setFollowingLocation(false) }}
        onUserLocationChange={event => { updateLocation(event.nativeEvent.coordinate) }} />
      { /* Layer the location button on the map instead of displacing it. */ }
      <View style={locationButtonContainerStyle}>
        <LocationButton isActive={followingLocation} 
          onPress={() => { flipFollowingLocation() }} />
      </View>
    </View>
  )
}

/**
 * The props for the {@interface Map} component.
 */
export interface MapProps {
  /** 
   * The {@interface Insets} to pad map information with. Useful if map information will be
   * obscured. Note that status bar insets will already be applied, so don't include those.
   */
  insets?: Insets
}

/**
 * The insets to apply to the {@interface Map} component when it will be obscured by
 * other components. {@see MapProps.insets}
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
