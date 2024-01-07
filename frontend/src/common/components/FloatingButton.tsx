import React from "react";
import {
  StyleSheet,
  TouchableHighlight,
  View,
  type ViewProps,
} from "react-native";

/**
 * The props for the {@function FloatingButton} component.
 */
export interface FloatingButtonProps extends ViewProps {
  /** The child icons of the FloatingButton */
  children: React.ReactNode;
  /** Callback for when the button is pressed by the user. */
  onPress: () => void;
}

/**
 * A general floating button component.
 */
const FloatingButton = ({
  children,
  onPress,
}: FloatingButtonProps): React.JSX.Element => {
  return (
    <TouchableHighlight
      style={styles.button}
      underlayColor="#DDDDDD"
      onPress={onPress}
    >
      <View>{children}</View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    borderRadius: 50,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default FloatingButton;
