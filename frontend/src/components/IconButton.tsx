import React from 'react';
import { TouchableHighlight, StyleSheet, type ViewProps, View } from 'react-native';

/**
 * The props for the {@function IconButton} component.
 */
export interface IconButtonProps {
  children: React.ReactNode,
  /** Callback for when the button is pressed by the user. */
  onPress: () => void
}

/**
 * A button that toggles whether the user's location is being followed.
 */
export function IconButton(props: ViewProps & IconButtonProps): React.ReactElement {
  return (
    <TouchableHighlight style={styles.button} underlayColor="#DDDDDD" onPress={props.onPress}>
      <View>
        {props.children}
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderRadius: 50,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
})
