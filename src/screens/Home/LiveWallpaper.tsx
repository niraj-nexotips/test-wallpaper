import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

type WallpaperItem = {
  uri: string;
  height?: number;
};

type DetailParams = {
  imageUrl: string;
};

type NavigationProps = {
  navigate: (screen: 'Detail', params: DetailParams) => void;
};

const LiveWallpaper: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const boxData: WallpaperItem[] = [
    {
      uri: 'https://i.pinimg.com/736x/d6/4d/1d/d64d1d4645daadb9d0c7ac88818170be.jpg',
      height: 200,
    },
    {
      uri: 'https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg?cs=srgb&dl=pexels-rpnickson-2486168.jpg&fm=jpg',
    },
    { uri: 'https://wallpaperaccess.com/full/317501.jpg' },
    { uri: 'https://wallpaperaccess.com/full/2637581.jpg' },
    { uri: 'https://wallpaperaccess.com/full/33119.jpg' },
    { uri: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg' },
    { uri: 'https://wallpaperaccess.com/full/1122112.jpg' },
    { uri: 'https://wallpaperaccess.com/full/279547.jpg' },
    { uri: 'https://wallpaperaccess.com/full/1425307.jpg' },
    { uri: 'https://images.pexels.com/photos/34950/pexels-photo.jpg' },
    { uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba' },
    { uri: 'https://images.unsplash.com/photo-1503264116251-35a269479413' },
  ];

  const leftColumnData = boxData.filter((_, index) => index % 2 === 0);
  const rightColumnData = boxData.filter((_, index) => index % 2 !== 0);

  const handleImagePress = (uri: string) => {
    if (uri) {
      navigation.navigate('Detail', { imageUrl: uri });
    } else {
      console.error('Missing uri for detail navigation.');
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces
      decelerationRate="normal"
      scrollEventThrottle={16}
      overScrollMode="always"
    >
      <Text style={[styles.mainHeadingText, { paddingTop: 0 }]}>Nature</Text>
      <Text style={[styles.subHeadingText, { paddingTop: 0 }]}>
        36 wallpapers available
      </Text>

      <View style={styles.masonryContainer}>
        <View style={styles.column}>
          {leftColumnData.map((item, index) => (
            <TouchableOpacity
              key={`left-${index}`}
              onPress={() => handleImagePress(item.uri)}
              style={[styles.categoryCard, { height: item.height || 300 }]}
            >
              <Image source={{ uri: item.uri }} style={styles.categoryImage} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.column}>
          {rightColumnData.map((item, index) => (
            <TouchableOpacity
              key={`right-${index}`}
              onPress={() => handleImagePress(item.uri)}
              style={[styles.categoryCard, { height: item.height || 300 }]}
            >
              <Image source={{ uri: item.uri }} style={styles.categoryImage} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default LiveWallpaper;

const styles = StyleSheet.create({
  mainHeadingText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    paddingTop: 18,
    paddingLeft: 18,
  },
  subHeadingText: {
    fontSize: 18,
    color: '#000',
    paddingLeft: 18,
  },

  masonryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  categoryCard: {
    width: '100%',
    marginBottom: 18,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 14,
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 14,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
