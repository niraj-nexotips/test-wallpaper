import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

type AnimatedWidth =
  | number
  | `${number}%`
  | Animated.Value
  | Animated.AnimatedInterpolation<number | string>;

type AnimatedHeight =
  | number
  | `${number}%`
  | Animated.Value
  | Animated.AnimatedInterpolation<number | string>;

type Props = {
  width?: AnimatedWidth;
  height?: AnimatedHeight;
  style?: ViewStyle | Animated.AnimatedProps<ViewStyle>;
  borderRadius?: number;
};

const ShimmerPlaceholder: React.FC<Props> = ({
  width = '100%',
  height = 16,
  style,
  borderRadius = 8,
}) => {
  const translateX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      }),
    ).start();
  }, [translateX]);

  const translate = translateX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  const baseStyle: Animated.AnimatedProps<ViewStyle> = {
    width: width as any,
    height,
    borderRadius,
    backgroundColor: '#eee',
    overflow: 'hidden',
  };

  return (
    <Animated.View style={[baseStyle, style as any]}>
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '40%',
          transform: [{ translateX: translate as any }],
          backgroundColor: 'rgba(255,255,255,0.5)',
        }}
      />
    </Animated.View>
  );
};

export default ShimmerPlaceholder;
