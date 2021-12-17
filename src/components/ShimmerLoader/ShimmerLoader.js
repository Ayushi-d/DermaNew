import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ShimmerPlaceholoader = createShimmerPlaceholder(LinearGradient);

export const ShimmerLoader = ({styles}) => {
  return (
    <ShimmerPlaceholoader
      height={10}
      style={styles}
      shimmerColors={['#FBFDFF', '#E9F0F8', '#FBFDFF']}
    />
  );
};