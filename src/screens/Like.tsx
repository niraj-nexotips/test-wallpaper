import React, { useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const itemMargin = 10;
const numColumns = 3;
const itemWidth = screenWidth / numColumns - itemMargin * 1.5;

type LikedItem = {
  uri: string;
  likedAt: number;
};

type DetailParams = { imageUrl: string; originalUrl?: string };
type NavProps = {
  navigate: (screen: 'Detail', params: DetailParams) => void;
};

const LikeScreen = () => {
  const [likedWallpapers, setLikedWallpapers] = useState<LikedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavProps>();

  useFocusEffect(
    React.useCallback(() => {
      loadLikedWallpapers();
    }, []),
  );

  const loadLikedWallpapers = async () => {
    setLoading(true);

    try {
      const raw = await AsyncStorage.getItem('likedWallpapers');
      let data: any[] = raw ? JSON.parse(raw) : [];

      if (data.length > 0 && typeof data[0] === 'string') {
        console.warn(
          'Liked storage format detected as old (URI string array). Migrating...',
        );
        data = (data as string[]).map(uri => ({
          uri: uri,
          likedAt: Date.now(),
        }));

        await AsyncStorage.setItem('likedWallpapers', JSON.stringify(data));
      }

      const likedItems = data as LikedItem[];

      const sorted = [...likedItems].sort((a, b) => b.likedAt - a.likedAt);

      setLikedWallpapers(sorted);
    } catch (error) {
      console.error('Error loading liked wallpapers:', error);
      setLikedWallpapers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePress = (uri: string) => {
    navigation.navigate('Detail', { imageUrl: uri });
  };

  const ListHeader = () => (
    <Text style={styles.styleText}>Your Liked Wallpapers</Text>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <View style={styles.likeContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : likedWallpapers.length === 0 ? (
          <View style={styles.likeContainer}>
            <Text style={styles.emptyText}>No liked wallpapers yet ❤️</Text>
          </View>
        ) : (
          <FlatList
            data={likedWallpapers}
            numColumns={numColumns}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={styles.listContent}
            keyExtractor={item => item.uri}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleImagePress(item.uri)}
                style={styles.imageWrapper}
              >
                <Image source={{ uri: item.uri }} style={styles.wallpaper} />
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LikeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  likeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleText: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  listContent: {
    paddingHorizontal: itemMargin / 2,
    paddingBottom: 10,
  },
  imageWrapper: {
    width: itemWidth,
    height: 250,
    margin: itemMargin / 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  wallpaper: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});
