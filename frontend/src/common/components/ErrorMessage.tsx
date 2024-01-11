import React from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import RetryButton from "./RetryButton";

interface ErrorComponentProps extends ViewProps {
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
    padding: 16,
  },
  header: {
    marginBottom: 16,
    alignSelf: "center",
  },
});

export default ErrorMessage;
