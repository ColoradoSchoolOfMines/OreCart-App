import React from 'react';
import { View } from 'react-native';

import Divider from './Divider';

/**
 * The props for the {@interface SkeletonList} component.
 */
interface SkeletonProps {
  /** Returns the skeleton item to render. */
  generator: () => React.ReactNode
}

/**
 * A component that renders a list of skeleton items with decreasing opacity.
 */
const SkeletonList: React.FC<SkeletonProps> = ({ generator }) => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <View key={index} style={{ opacity: 1 / Math.pow(2, index) }}>
          {generator()}
          {index < 2 ? <Divider /> : null}
        </View>
      ))}
    </>
  );
};

export default SkeletonList;