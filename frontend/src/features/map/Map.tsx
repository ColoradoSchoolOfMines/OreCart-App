import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FloatingButton from "../../common/components/FloatingButton";
import Color from "../../common/style/color";
import LayoutStyle from "../../common/style/layout";
import SpacingStyle, { type Insets } from "../../common/style/spacing";
import { type Coordinate } from "../location/locationSlice";
import { type Route, useGetRoutesQuery } from "../routes/routesSlice";
import { useGetStopsQuery } from "../stops/stopsSlice";
import { useGetVansQuery } from "../vans/vansSlice";

/**
 * The props for the {@interface Map} component.
 */
interface MapProps extends ViewProps {
  /**
   * The {@interface Insets} to pad map information with. Useful if map information will be
   * obscured. Note that status bar insets will already be applied, so don't include those.
   */
  insets?: Insets;
}

/**
 * A wrapper around react native {@class MapView} that provides a simplified interface for the purposes of this app.
 */
const Map: React.FC<MapProps> = ({ insets }) => {
  const mapRef = useRef<MapView>(null);
  const [followingLocation, setFollowingLocation] = useState<boolean>(true);
  const [lastLocation, setLastLocation] = React.useState<
    Coordinate | undefined
  >(undefined);

  function panToLocation(location: Coordinate | undefined): void {
    if (location !== undefined && mapRef.current != null) {
      mapRef.current.animateCamera({
        center: location,
        zoom: 17,
      });
    }
  }

  function updateLocation(location: Coordinate | undefined): void {
    // Required if we need to re-toggle location following later, which requires
    // us to pan the camera to whatever location we were last given. Always track
    // this regardless of if following is currently on.
    setLastLocation(location);
    if (followingLocation) {
      panToLocation(location);
    }
  }

  function flipFollowingLocation(): void {
    setFollowingLocation((followingLocation) => {
      // There will be some delay between the next location update and when the
      // location button was toggled, so we need to immediately pan now with the
      // last location we got.
      if (!followingLocation) {
        panToLocation(lastLocation);
      }
      return !followingLocation;
    });
  }

  // Combine given insets with the status bar height to ensure that the map
  // is fully in-bounds.
  const safeAreaInsets = useSafeAreaInsets();
  const padding = {
    top: (insets?.top ?? 0) + safeAreaInsets.top,
    left: insets?.left ?? 0 + safeAreaInsets.left,
    bottom: insets?.bottom ?? 0 + safeAreaInsets.bottom,
    right: insets?.right ?? 0 + safeAreaInsets.right,
  };

  const { data: vans } = useGetVansQuery();
  const { data: routes } = useGetRoutesQuery();
  const { data: stops } = useGetStopsQuery();

  const routesById: Record<string, Route> = {};
  routes?.forEach((route) => {
    routesById[route.id] = route;
  });

  return (
    <View>
      <MapView
        style={LayoutStyle.fill}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        mapPadding={padding}
        toolbarEnabled={false}
        scrollEnabled={true}
        onPanDrag={() => {
          setFollowingLocation(false);
        }}
        onUserLocationChange={(event) => {
          updateLocation(event.nativeEvent.coordinate);
        }}
      >
        {vans?.map((van, index) =>
          van.location !== undefined ? (
            <Marker
              key={index}
              coordinate={van.location}
              tracksViewChanges={false}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View
                style={[
                  styles.marker,
                  {
                    backgroundColor: Color.orecart.get(
                      routesById[van.routeId].name,
                    ),
                  },
                ]}
              >
                <MaterialIcons
                  name="directions-bus"
                  size={20}
                  color={Color.generic.white}
                />
              </View>
            </Marker>
          ) : null,
        )}
        {routes?.map((route, index) => (
          <Polyline
            key={index}
            coordinates={route.waypoints}
            strokeColor={Color.orecart.get(route.name)}
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        ))}
        {stops?.map((stop, index) => (
          <Marker
            key={vans?.length ?? 0 + index}
            coordinate={stop}
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View
              style={[
                styles.marker,
                {
                  backgroundColor: Color.orecart.get(
                    routesById[stop.routeIds[0]].name,
                  ),
                },
              ]}
            >
              <MaterialIcons
                name="hail"
                size={20}
                color={Color.generic.white}
              />
            </View>
          </Marker>
        ))}
      </MapView>
      {/* Layer the location button on the map instead of displacing it. */}
      <View
        style={[
          LayoutStyle.overlay,
          SpacingStyle.pad(padding, 16),
          styles.locationButtonContainer,
        ]}
      >
        <FloatingButton
          onPress={() => {
            flipFollowingLocation();
          }}
        >
          {followingLocation ? (
            <MaterialIcons
              name="my-location"
              size={24}
              color={Color.generic.location}
            />
          ) : (
            <MaterialIcons
              name="location-searching"
              size={24}
              color={Color.generic.black}
            />
          )}
        </FloatingButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationButtonContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  marker: {
    backgroundColor: Color.orecart.tungsten,
    borderRadius: 100,
    padding: 4,
  },
});

export default Map;
