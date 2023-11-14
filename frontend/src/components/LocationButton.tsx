import React from 'react';
import { type ViewProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { IconButton } from './IconButton';

/**
 * The props for the {@function LocationButton} component.
 */
export interface LocationButtonProps {
  /** Whether the button should display that the user location is actively being followed. */
  isActive: boolean,
  /** Callback for when the button is pressed by the user. */
  onPress: () => void
}

/**
 * A button that toggles whether the user's location is being followed.
 */
export function LocationButton(props: ViewProps & LocationButtonProps): React.ReactElement {
  return (
    <IconButton onPress={props.onPress}>
      { props.isActive ? <MaterialIcons name="my-location" size={24} color="green" /> : 
          <MaterialIcons name="location-searching" size={24} color="black" /> }
    </IconButton>
  )
}
