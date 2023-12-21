import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableHighlight, FlatList } from "react-native";

import { type Alert, useGetActiveAlertsQuery } from "./alertSlice";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const AlertList: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const alerts = useGetActiveAlertsQuery().data;
  
  const alertEndDates: Record<number, string> = {};
  const now = new Date().getTime() / 1000
  alerts?.forEach((alert: Alert) => {
    // If more than a week, use the date
    const endDate = new Date(alert.endDateTime * 1000);
    if (alert.endDateTime - now > 60*60*24*7) {
      alertEndDates[alert.id] = endDate.toLocaleDateString();
    } else {
      const endDate = new Date(alert.endDateTime * 1000);
      alertEndDates[alert.id] = daysOfWeek[endDate.getDay()];
    }
    alertEndDates[alert.id] += " at " + endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  });

  if (alerts === undefined || alerts.length === 0) {
    return null;
  }

  return (
    <View style={styles.spacing}>
      <TouchableHighlight
        underlayColor={"#ED4B4B"}
        onPress={() => {
          setExpanded(!expanded);
        }}
        style={styles.container}
      >
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Alert</Text>
            <MaterialIcons name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#FFFFFF" />
          </View>
          {expanded ? (
              <FlatList
              data={alerts}
              style={styles.alertsContainer}
              renderItem={
                ({ item }) => (
                  <View key={item.id} style={styles.alertContainer}>
                    <Text style={styles.alertText}>{item.text}</Text>
                    <Text style={styles.alertSubtext}>Ends on <Text>{alertEndDates[item.id]}</Text></Text>
                  </View>
                )
              }
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <View style={{height: 8}} />} />
          ) : 
            (alerts.length === 1 ?
              
              <View>
                <Text style={styles.alertText}>{alerts[0].text}</Text>
                <Text style={styles.alertSubtext}>Ends on <Text>{alertEndDates[alerts[0].id]}</Text></Text>
              </View>
            : <Text style={styles.alertText}>{`${alerts.length} active alerts`}</Text>)
          }
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  spacing: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  container: {
    padding: 16,
    backgroundColor: "#FF5151",
    borderRadius: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  alertsContainer: {
    marginTop: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  alertContainer: {
    backgroundColor: "#FF7575",
    borderRadius: 8,
    padding: 8,
  },
  alertText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  alertSubtext: {
    color: "#FFFFFF",
    fontStyle: "italic"
  }
});

export default AlertList;
