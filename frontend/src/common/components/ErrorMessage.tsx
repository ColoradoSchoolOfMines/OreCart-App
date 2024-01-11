import React from "react";
import { StyleSheet, Text, View } from "react-native";
import RetryButton from "./RetryButton";

interface ErrorComponentProps {
  message: string;
  retry: () => void;
}

const ErrorMessage: React.FC<ErrorComponentProps> = ({ message, retry }) => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.header}>{message}</Text>
      <RetryButton retry={retry} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ErrorMessage;
