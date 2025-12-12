import React, { useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

type WallpaperRecord = {
  originalUrl: string;
  localPath: string;
};

const screenWidth = Dimensions.get('window').width;
const itemMargin = 10;
const numColumns = 3;
const itemWidth = screenWidth / numColumns - itemMargin * 1.5;

const STORAGE_KEY = 'downloadedWallpapersData';

const Download = () => {
  const [downloadedFiles, setDownloadedFiles] = useState<WallpaperRecord[]>([]);
  const navigation: any = useNavigation();

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const granted = await PermissionsAndroid.request(permission);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const loadDownloadedFiles = async () => {
    const allowed = await requestPermission();
    if (!allowed) {
      setDownloadedFiles([]);
      return;
    }

    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const records: WallpaperRecord[] = raw ? JSON.parse(raw) : [];

      const unique = Array.from(
        new Map(records.map(r => [r.originalUrl, r])).values(),
      );

      const valid: WallpaperRecord[] = [];
      const updated: WallpaperRecord[] = [];
      let needsCleanup = false;

      for (const rec of unique) {
        const path = rec.localPath.replace('file://', '');

        if (await RNFS.exists(path)) {
          const fixed = { ...rec, localPath: `file://${path}` };
          valid.push(fixed);
          updated.push(fixed);
        } else {
          needsCleanup = true;
        }
      }

      if (needsCleanup) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }

      setDownloadedFiles(valid);
    } catch (error) {
      console.error('Failed to load downloaded data:', error);
      setDownloadedFiles([]);
      Alert.alert('Error', 'Unable to load downloaded wallpapers.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadDownloadedFiles();
    }, []),
  );

  const handleImagePress = (item: WallpaperRecord) => {
    navigation.navigate('Detail', {
      imageUrl: item.localPath,
      originalUrl: item.originalUrl,
    });
  };

  const ListHeader = () => (
    <Text style={styles.downloadedText}>Your Downloaded Wallpapers</Text>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {downloadedFiles.length === 0 ? (
          <View style={styles.downloadContainer}>
            <Text style={styles.emptyText}>
              No wallpapers downloaded yet 😔
            </Text>
          </View>
        ) : (
          <FlatList
            data={downloadedFiles}
            numColumns={numColumns}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={styles.listContent}
            keyExtractor={item => item.originalUrl}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleImagePress(item)}
                style={styles.imageWrapper}
              >
                <Image
                  source={{ uri: item.localPath }}
                  style={styles.wallpaper}
                />
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Download;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  downloadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadedText: {
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
