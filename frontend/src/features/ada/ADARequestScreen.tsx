import { MaterialIcons } from "@expo/vector-icons";
import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import CheckBox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";

import ErrorMessage from "../../common/components/ErrorMessage";
import { type OuterParamList } from "../../common/navTypes";
import Color from "../../common/style/color";

import {
  useGetPickupSpotsQuery,
  usePostADARequestMutation,
  type PickupSpot,
} from "./adaSlice";
import PickupSpotList from "./PickupSpotList";

export interface ADARequestScreenProps {
  navigation: StackNavigationProp<OuterParamList, "ADARequest">;
  route: RouteProp<OuterParamList, "ADARequest">;
}

/**
 * A screen that allows the user to submit an ADA request.
 */
export const ADARequestScreen = ({
  route,
  navigation,
}: ADARequestScreenProps): React.JSX.Element => {
  const { data: pickupSpots, isError, refetch } = useGetPickupSpotsQuery();
  const [currentSpot, setCurrentSpot] = useState<PickupSpot | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [minDate, setMinDate] = useState(new Date());
  const [wheelchair, setWheelchair] = useState(false);
  const [submitRequest, result] = usePostADARequestMutation();

  const retry = (): void => {
    refetch().catch(console.error);
  };

  useEffect(() => {
    const handle = setTimeout(() => {
      // Keep up with the current time when handling the minimum date
      // This reduces the likelihood that a user will submit a request
      // with a time in the past. This is not perfect though.
      setMinDate(new Date());
    }, 1000);
    return () => {
      clearTimeout(handle);
    };
  }, [date]);

  const showDatePicker = (): void => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = (): void => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date): void => {
    setDate(date);
    hideDatePicker();
  };

  const formValid: () => boolean = () => {
    // Spots exist, a spot is selected and a valid date is selected
    // The first case is for a scenario where the spots refresh while
    // the user is on the screen. This is unlikely but possible.
    return (
      pickupSpots !== undefined &&
      currentSpot !== null &&
      date !== null &&
      date.getTime() > minDate.getTime()
    );
  };

  const submitIfValid: () => void = () => {
    if (currentSpot !== null && date !== null) {
      submitRequest({
        pickup_spot_id: currentSpot.id,
        pickup_time: date.getTime() / 1000,
        wheelchair,
      })
        .then((result) => {
          // For some reason the result it returns is the actual response
          // and not the current state of the mutation. Handle it regardless.
          const response = result as { error: string };
          if (response.error === undefined) {
            navigation.navigate("Home");
            Toast.show({
              type: "success",
              text1: "ADA request submitted",
              text2: "Please arrive to the pickup spot at the scheduled time",
            });
          }
        })
        .catch(() => {
          // Never called
        });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Pickup spot</Text>
      {/* Pickup spot picker. These are dynamically fetched. */}
      {isError ? (
        <ErrorMessage
          style={styles.content}
          message="We couldn't fetch the pickup spots right now. Try again later."
          retry={() => {
            retry();
          }}
        />
      ) : (
        <PickupSpotList
          style={styles.content}
          spots={pickupSpots}
          onSpotSelected={(spot) => {
            setCurrentSpot(spot);
          }}
        />
      )}
      {/* Pickup time picker */}
      <Text style={styles.header}>Pickup time</Text>
      <View style={styles.content}>
        <Text style={styles.body}>
          {date === null ? "No time selected" : date.toLocaleString()}
        </Text>
        {date !== null && date.getTime() < minDate.getTime() ? (
          <Text style={[styles.body, styles.error]}>
            Pickup time must be in the future
          </Text>
        ) : null}
        <TouchableHighlight
          onPress={showDatePicker}
          style={[styles.button, styles.secondaryButton]}
          underlayColor={Color.csm.primary.ext.light_blue_highlight}
        >
          <Text style={styles.buttonText}>Select time</Text>
        </TouchableHighlight>
      </View>
      {/* Accomodations menu (currenly theres just a wheelchair value) */}
      <Text style={styles.header}>Accomodations</Text>
      <TouchableOpacity
        style={[styles.row, styles.content]}
        onPress={() => {
          setWheelchair((prev) => !prev);
        }}
        activeOpacity={1.0}
      >
        <CheckBox value={wheelchair} color={Color.csm.primary.blaster_blue} />
        <Text>Wheelchair required</Text>
      </TouchableOpacity>
      <TouchableHighlight
        onPress={submitIfValid}
        style={[
          styles.button,
          formValid() ? styles.primaryButton : styles.disabledButton,
        ]}
        underlayColor={
          // Don't really know how to disable the touchable highlight, instead
          // just make the underlay color the same as the button color
          formValid()
            ? Color.csm.primary.ext.blaster_blue_highlight
            : Color.generic.selection
        }
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableHighlight>
      {/* Response error indicator */}
      {result.error !== undefined ? (
        <View style={styles.row}>
          <MaterialIcons
            name="error"
            size={24}
            color={Color.generic.alert.primary}
          />
          <Text style={[styles.body, styles.error, styles.content]}>
            An error occurred while submitting the request. {"\n"}Please try
            again.
          </Text>
        </View>
      ) : null}
      {/* Modal (should be on top of everything else) */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        minimumDate={minDate}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    borderRadius: 100,
    padding: 10,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: Color.csm.primary.blaster_blue,
  },
  secondaryButton: {
    backgroundColor: Color.csm.primary.light_blue,
  },
  disabledButton: {
    backgroundColor: Color.generic.selection,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
  body: {
    marginBottom: 16,
    fontSize: 14,
  },
  error: {
    color: Color.generic.alert.primary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
