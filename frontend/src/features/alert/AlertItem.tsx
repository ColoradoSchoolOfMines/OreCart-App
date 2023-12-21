import {
  View,
  Text,
  StyleSheet,
  type ViewProps,
} from "react-native";

import Color from "../../common/style/color";

import { type Alert } from "./alertSlice";

/**
 * The props for the {@interface AlertItem} component.
 */
interface AlertProps extends ViewProps {
  alert: Alert;
}

/**
 * A component that displays a single alert's text description and
 * end date/time.
 */
const AlertItem: React.FC<AlertProps> = ({ style, alert }) => {
  const now = new Date().getTime() / 1000;

  // If more than a week, use the date
  const endDate = new Date(alert.endDateTime * 1000);
  let endTimestamp;
  if (alert.endDateTime - now > 60 * 60 * 24 * 7) {
    // If more than a week, use the calendar date
    endTimestamp = endDate.toLocaleDateString();
  } else {
    // Otherwise, use the day of the week
    const endDate = new Date(alert.endDateTime * 1000);
    endTimestamp = daysOfWeek[endDate.getDay()];
  }
  // Add time in format of "at 12:00 PM"
  endTimestamp +=
    " at " +
    endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <View style={style}>
      <Text style={styles.alertText}>{alert.text}</Text>
      <Text style={styles.alertSubtext}>
        Ends on <Text>{endTimestamp}</Text>
      </Text>
    </View>
  );
};

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const styles = StyleSheet.create({
  alertText: {
    fontSize: 16,
    color: Color.generic.white,
  },
  alertSubtext: {
    color: Color.generic.white,
    fontStyle: "italic",
  },
});

export default AlertItem;