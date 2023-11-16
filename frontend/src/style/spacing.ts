import { type ViewStyle } from "react-native";

export interface Insets {
  /** The amount of space to inset from the top of the map. 0 if not specified. */
  top?: number;
  /** The amount of space to inset from the left of the map. 0 if not specified. */
  left?: number;
  /** The amount of space to inset from the bottom of the map. 0 if not specified. */
  bottom?: number;
  /** The amount of space to inset from the right of the map. 0 if not specified. */
  right?: number;
}

/**
 * Transforms an existing padding value into a {@type ViewStyle} by adding the specified amount to
 * each side.
 * @param existingPadding The existing padding.
 * @param amount The amount to add to each side.
 * @returns The {@type ViewStyle} representing the new padding.
 */
function pad(existingPadding: Insets, amount: number): ViewStyle {
  return {
    paddingTop: (existingPadding.top ?? 0) + amount,
    paddingLeft: (existingPadding.left ?? 0) + amount,
    paddingBottom: (existingPadding.bottom ?? 0) + amount,
    paddingRight: (existingPadding.right ?? 0) + amount,
  };
}

export default { pad };
