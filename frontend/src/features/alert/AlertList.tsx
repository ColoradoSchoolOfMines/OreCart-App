import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";

import { type Alert, useGetActiveAlertsQuery } from "./alertSlice";

const AlertList: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const alerts = useGetActiveAlertsQuery().data;

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
            alerts.map((alert: Alert) => (
              <View key={alert.id} style={styles.alertContainer}>
                <Text style={styles.alertText}>{alert.text}</Text>
              </View>
            ))
          ) : 
            (alerts.length === 1 ?
              <Text style={styles.alertText}>{alerts[0].text}</Text>
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
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  alertContainer: {
    backgroundColor: "#FF7575",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  alertText: {
    color: "#FFFFFF",
  },
});

export default AlertList;
