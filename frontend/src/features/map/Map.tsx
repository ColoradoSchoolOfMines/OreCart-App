import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Image, StyleSheet, View, type ViewProps } from "react-native";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  type Region,
} from "react-native-maps";

import FloatingButton from "../../common/components/FloatingButton";
import Color from "../../common/style/color";
import LayoutStyle from "../../common/style/layout";
import SpacingStyle, { type Insets } from "../../common/style/spacing";
import { useLocation, type Coordinate } from "../location/locationSlice";
import { useGetRoutesQuery, type Route } from "../routes/routesSlice";
import { useGetStopsQuery } from "../stops/stopsSlice";

import { useMapFocus } from "./mapSlice";
import Pie from "./Pie";
import { useVanLocations } from "./vanLocations";

const GOLDEN: Region = {
  latitude: 39.7422630160319,
  latitudeDelta: 0.04125315984375533,
  longitude: -105.21280037239194,
  longitudeDelta: 0.05248378962278366,
};

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
const Map = ({ insets }: MapProps): React.JSX.Element => {
  const mapRef = useRef<MapView>(null);
  const focus = useMapFocus();
  const [followingLocation, setFollowingLocation] = useState<boolean>(true);
  const [lastLocation, setLastLocation] = useState<Coordinate | undefined>(
    undefined
  );
  const [lastRegion, setLastRegion] = useState<Region>(GOLDEN);

  const location = useLocation();
  const { data: routes } = useGetRoutesQuery();
  const { data: stops } = useGetStopsQuery();

  let vanRouteFilter: Route[] = [];
  if (focus.type === "None") {
    vanRouteFilter = routes ?? [];
  } else if (focus.type === "SingleRoute") {
    vanRouteFilter = [focus.route];
  } else if (focus.type === "SingleStop") {
    vanRouteFilter = focus.stop.routes;
  }
  const { data: vans } = useVanLocations(vanRouteFilter);

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
    if (followingLocation && focus.type === "None") {
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

  /**
   * Given a function of waypoints, return a region from the most top-left to the most bottom-right
   * points in the list.
   */
  function routeBounds(route: Route): Region {
    let minLat = route.waypoints[0].latitude;
    let maxLat = route.waypoints[0].latitude;
    let minLon = route.waypoints[0].longitude;
    let maxLon = route.waypoints[0].longitude;
    for (let i = 1; i < route.waypoints.length; i++) {
      const waypoint = route.waypoints[i];
      if (waypoint.latitude < minLat) minLat = waypoint.latitude;
      if (waypoint.latitude > maxLat) maxLat = waypoint.latitude;
      if (waypoint.longitude < minLon) minLon = waypoint.longitude;
      if (waypoint.longitude > maxLon) maxLon = waypoint.longitude;
    }
    return {
      latitude: (minLat + maxLat) / 2,
      latitudeDelta: maxLat - minLat,
      longitude: (minLon + maxLon) / 2,
      longitudeDelta: maxLon - minLon,
    };
  }

  function stopBounds(stop: Stop): Region {
    return {
      latitude: stop.latitude,
      latitudeDelta: 0.01,
      longitude: stop.longitude,
      longitudeDelta: 0.01,
    };
  }

  useEffect(() => {
    if (focus.type === "None") {
      if (followingLocation && location.isSuccess) {
        panToLocation(location.data);
      } else {
        mapRef.current?.animateToRegion(lastRegion);
      }
    } else if (focus.type === "SingleRoute") {
      mapRef.current?.animateToRegion(routeBounds(focus.route));
    } else if (focus.type === "SingleStop") {
      mapRef.current?.animateToRegion(stopBounds(focus.stop));
    }
  }, [focus]);

  function isStopOpaque(stop: Stop): boolean {
    if (focus.type === "SingleRoute") {
      return focus.route.stops.some((other) => other.id === stop.id);
    }
    if (focus.type === "SingleStop") {
      return stop.id === focus.stop.id;
    }
    return true;
  }

  function isRouteOpaque(route: Route): boolean {
    if (focus.type === "SingleRoute") {
      return route.id === focus.route.id;
    }
    if (focus.type === "SingleStop") {
      return focus.stop.routes.some((other) => other.id === route.id);
    }
    return true;
  }

  // Combine given insets with the status bar height to ensure that the map
  // is fully in-bounds.
  const safeAreaInsets = useSafeAreaInsets();
  const padding = {
    top: insets?.top ?? 0,
    right: insets?.right ?? 0,
    bottom: insets?.bottom ?? 0,
    left: insets?.left ?? 0,
  };

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
        region={GOLDEN}
        scrollEnabled={true}
        onPanDrag={() => {
          // Let's say the user accidentally pans a tad before they realize
          // that they haven't granted location permissions. We won't pan
          // back to their location until they re-toggle the location button.
          // That's not very good UX.
          if (!location.isSuccess) {
            setFollowingLocation(false);
          }
        }}
        onUserLocationChange={(event) => {
          updateLocation(event.nativeEvent.coordinate);
        }}
        onRegionChange={(region) => {
          if (focus.type === "None") {
            setLastRegion(region);
          }
        }}
      >
        {vans?.map((van) => (
          <Marker key={van.id} coordinate={van} anchor={{ x: 0.5, y: 0.5 }}>
            <View
              style={[
                styles.marker,
                {
                  borderColor: van.color,
                  padding: 4,
                  borderWidth: 4,
                },
              ]}
            >
              <Image
                style={styles.indicator}
                source={require("../../../assets/van_indicator.png")}
              />
            </View>
          </Marker>
        ))}
        {routes?.map((route) => (
          <Polyline
            key={route.id}
            coordinates={route.waypoints}
            strokeColor={route.color + (isRouteOpaque(route) ? "FF" : "80")}
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        ))}
        {stops?.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={stop}
            tracksViewChanges={false}
            opacity={isStopOpaque(stop) ? 1 : 0.5}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[styles.marker]}>
              {/* 
              Create a similar border to that of the van indicators, but segment it
              such that it shows the colors of all the routes that stop at it. Since
              borders can only be one color, we must draw effectively a pie chart
              on the background and then inset the actual icon on top of it to produce
              a border.
              */}
              <View style={LayoutStyle.overlay}>
                <Pie colors={stop.colors} />
              </View>
              <View style={styles.icon}>
                <MaterialIcons
                  name="hail"
                  size={16}
                  color={Color.generic.black}
                />
              </View>
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
        {location.isSuccess && focus.type !== "None" ? (
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
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationButtonContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  marker: {
    backgroundColor: Color.generic.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 100,
  },
  icon: {
    backgroundColor: "white",
    margin: 4,
    padding: 4,
    borderRadius: 100,
  },
});

export default Map;
