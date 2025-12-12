// import React from 'react';
// import { View, StyleSheet, DimensionValue } from 'react-native';
// import Animated, {
//   useSharedValue,
//   withRepeat,
//   withTiming,
//   useAnimatedStyle,
//   interpolate,
// } from 'react-native-reanimated';

// interface Props {
//   width: DimensionValue; // <-- FIXED TYPE
//   height: number;
//   borderRadius?: number;
// }

// const SkeletonCard: React.FC<Props> = ({
//   width,
//   height,
//   borderRadius = 12,
// }) => {
//   const progress = useSharedValue(0);

//   React.useEffect(() => {
//     progress.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => {
//     const opacity = interpolate(progress.value, [0, 1], [0.3, 1]);
//     return { opacity };
//   });

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           width: width, // Now accepts "47%" or 200 correctly
//           height,
//           borderRadius,
//         },
//       ]}
//     >
//       <Animated.View style={[styles.shimmer, animatedStyle]} />
//     </View>
//   );
// };

// export default SkeletonCard;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#e6e6e6',
//     overflow: 'hidden',
//   },
//   shimmer: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: '#f2f2f2',
//   },
// });
