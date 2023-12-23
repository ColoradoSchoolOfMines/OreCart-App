import React from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";

import { useAppDispatch } from "../../common/hooks";
import Color from "../../common/style/color";

import { requestLocationPermissions } from "./locationMiddleware";
import { useLocationStatus } from "./locationSlice";

/**
 * A banner component that requests the user to grant location permissions to
 * the app.
 */
const LocationPermissionPrompt: React.FC = () => {
  const dispatch = useAppDispatch();
  const locationStatus = useLocationStatus();

  const handleGrantButtonPress = (): void => {
    dispatch(requestLocationPermissions());
  };

  if (locationStatus.type !== "not_granted") {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Allow OreCart to access your location to see nearby stops and arrival
        estimates
      </Text>

      <TouchableHighlight
        style={styles.grantButton}
        underlayColor={Color.csm.primary.ext.blaster_blue_highlight}
        onPress={handleGrantButtonPress}
      >
        <Text style={styles.grantButtonText}>Grant</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.csm.primary.pale_blue,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    color: Color.generic.black,
  },
  grantButton: {
    borderRadius: 100,
    backgroundColor: Color.csm.primary.blaster_blue,
    padding: 10,
    alignItems: "center",
  },
  grantButtonText: {
    color: Color.generic.white,
    fontWeight: "500",
  },
});

export default LocationPermissionPrompt;
