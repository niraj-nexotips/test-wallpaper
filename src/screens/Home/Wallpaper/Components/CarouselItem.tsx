// import React from 'react';
// import {
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   ViewStyle,
// } from 'react-native';
// import Animated, {
//   interpolate,
//   useAnimatedStyle,
//   Extrapolate,
// } from 'react-native-reanimated';
// import type { WallpaperItem } from '../Wallpaper';

// const { width } = Dimensions.get('window');

// interface Props {
//   item: WallpaperItem;
//   index: number;
//   onPress: () => void;
// }

// const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// const CarouselItem: React.FC<Props> = ({ item, index, onPress }) => {
//   const animatedStyle = useAnimatedStyle(() => {
//     // Parallax + scale effect
//     const scale = interpolate(
//       index,
//       [index - 1, index, index + 1],
//       [0.85, 1, 0.85],
//       Extrapolate.CLAMP,
//     );

//     return {
//       transform: [{ scale }],
//     };
//   });

//   return (
//     <AnimatedTouchable
//       style={[styles.container, animatedStyle as ViewStyle]}
//       activeOpacity={0.9}
//       onPress={onPress}
//     >
//       <Image source={{ uri: item.uri }} style={styles.image} />
//     </AnimatedTouchable>
//   );
// };

// export default CarouselItem;

// const styles = StyleSheet.create({
//   container: {
//     width: width * 0.72,
//     height: 300,
//     borderRadius: 22,
//     overflow: 'hidden',
//     marginHorizontal: 10,
//     backgroundColor: '#ddd',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
// });
