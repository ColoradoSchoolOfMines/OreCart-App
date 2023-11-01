import React, { useState, useRef } from 'react'
import { StyleSheet, View, Text, Dimensions, type ViewProps, type LayoutProps } from 'react-native'
import { Map, MapRef } from './components/Map'
import { Sheet } from './components/Sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LocationButton from './components/LocationButton';

/**
 * Controls the percentage of the screen taken up by the bottom sheet in
 * it's collapsed state.
 */
const SHEET_EXTENT = 0.5

/**
 * The main screen containing the map and sheet components.
 */
export function Main(_: ViewProps): React.ReactElement<void> {
  // The bottom sheet extends halfway across the screen, with the map
  // being inset accordingly.
  const screenHeight = Dimensions.get('window').height
  const bottomInset = screenHeight * SHEET_EXTENT;
  const mapInsets = {
    top: 0,
    left: 0,
    // Inset the map so that elements are not obscured by the bottom sheet
    bottom: bottomInset,
    right: 0
  }
  const locationContainerStyle: LayoutProps = {
    ...StyleSheet.absoluteFillObject,
    paddingBottom: bottomInset + 16,
    paddingTop: 16,
    paddingStart: 16,
    paddingEnd: 16,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  }

  const mapRef = useRef<MapRef>(null)

  const [followingLocation, setFollowingLocation] = useState<boolean>(true)

  function handleLocationPress(): void {
    const newState = !followingLocation
    setFollowingLocation(newState)
    if (newState) {
      mapRef.current?.poke()
    }
  }

  return (
    <GestureHandlerRootView>
      <Map style={StyleSheet.absoluteFill} 
        ref={mapRef}
        insets={mapInsets} 
        followingLocation={followingLocation} 
        onDisableFollowing={() => {setFollowingLocation(false)}} />
      <View style={locationContainerStyle}>
        <LocationButton isActive={followingLocation} 
          onPress={() => { handleLocationPress() }} />
      </View>
      <Sheet collapsedExtent={SHEET_EXTENT}>
        <View>
          <Text>Hello World</Text>
        </View>
      </Sheet>
    </GestureHandlerRootView>
  )
}
