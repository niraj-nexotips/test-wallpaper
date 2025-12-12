// import React from 'react';
// import {
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   View,
// } from 'react-native';
// import Animated, {
//   useAnimatedStyle,
//   withTiming,
// } from 'react-native-reanimated';

// interface Props {
//   categories: string[];
//   emojis: Record<string, string>;
//   selected: string;
//   onSelect: (category: string) => void;
// }

// const CategoryFilter: React.FC<Props> = ({
//   categories,
//   emojis,
//   selected,
//   onSelect,
// }) => {
//   return (
//     <ScrollView
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       contentContainerStyle={styles.container}
//     >
//       {categories.map((cat, index) => {
//         const isActive = selected === cat;

//         // Animated highlight bubble
//         const bubbleStyle = useAnimatedStyle(() => ({
//           opacity: withTiming(isActive ? 1 : 0, { duration: 200 }),
//           transform: [
//             { scale: withTiming(isActive ? 1 : 0.7, { duration: 200 }) },
//           ],
//         }));

//         // Animated text weight
//         const textStyle = useAnimatedStyle(() => ({
//           transform: [
//             { scale: withTiming(isActive ? 1.1 : 1, { duration: 150 }) },
//           ],
//         }));

//         return (
//           <TouchableOpacity
//             key={index}
//             style={styles.tab}
//             activeOpacity={0.7}
//             onPress={() => onSelect(cat)}
//           >
//             <View style={styles.inner}>
//               <Animated.View style={[styles.bubble, bubbleStyle]} />

//               <Animated.Text style={[styles.emoji, textStyle]}>
//                 {cat === 'All' ? '⭐' : emojis[cat]}
//               </Animated.Text>

//               <Animated.Text style={[styles.label, textStyle]}>
//                 {cat}
//               </Animated.Text>
//             </View>
//           </TouchableOpacity>
//         );
//       })}
//     </ScrollView>
//   );
// };

// export default CategoryFilter;

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 12,
//     paddingTop: 10,
//     gap: 12,
//   },
//   tab: {
//     alignItems: 'center',
//   },
//   inner: {
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 20,
//     backgroundColor: 'transparent',
//     overflow: 'hidden',
//   },

//   // Highlight bubble
//   bubble: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: '#e6ebff',
//     borderRadius: 20,
//   },

//   emoji: {
//     fontSize: 24,
//     textAlign: 'center',
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//     marginTop: 2,
//   },
// });
