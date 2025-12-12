import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Text,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type LikedItem = {
  uri: string;
  likedAt: number;
};

type DetailParams = {
  imageUrl: string;
  originalUrl?: string;
};

type RootStackParamList = {
  Detail: DetailParams;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const WallpaperDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { imageUrl, originalUrl } = route.params;
  const identifier = originalUrl || imageUrl;

  // ----------------------------------------- // 1️⃣ Check if liked already (UPDATED) // -----------------------------------------
  useEffect(() => {
    checkIfLiked();
  }, []);

  const checkIfLiked = async () => {
    const raw = await AsyncStorage.getItem('likedWallpapers');
    const liked: LikedItem[] = raw ? JSON.parse(raw) : [];
    setIsLiked(liked.some(item => item.uri === identifier));
  };

  // ----------------------------------------- // 2️⃣ Like or Unlike wallpaper (UPDATED) // -----------------------------------------
  const handleLike = async () => {
    try {
      let raw = await AsyncStorage.getItem('likedWallpapers');
      let likedList: LikedItem[] = raw ? JSON.parse(raw) : [];
      if (isLiked) {
        const newList = likedList.filter(item => item.uri !== identifier);
        await AsyncStorage.setItem('likedWallpapers', JSON.stringify(newList));
        setIsLiked(false);
        return;
      }
      const newLike: LikedItem = {
        uri: identifier,
        likedAt: Date.now(),
      };
      likedList.push(newLike);
      await AsyncStorage.setItem('likedWallpapers', JSON.stringify(likedList));
      setIsLiked(true);
    } catch (error) {
      console.log('Like Error:', error);
    }
  };

  // ----------------------------------------- // 3️⃣ Share (No Change) // -----------------------------------------
  const handleShare = async () => {
    try {
      await Share.open({
        message: `Check out this wallpaper!\n${imageUrl}`,
        url: imageUrl,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  // ----------------------------------------- // 4️⃣ Save downloaded record (No Change) // -----------------------------------------
  const saveDownloadedRecord = async (localPath: string) => {
    try {
      let raw = await AsyncStorage.getItem('downloadedWallpapersData');
      let saved = raw ? JSON.parse(raw) : [];
      const record = {
        originalUrl: originalUrl || identifier,
        localPath: `file://${localPath}`,
        downloadedAt: Date.now(),
      };
      const existingIndex = saved.findIndex(
        (rec: any) => rec.originalUrl === record.originalUrl,
      );
      if (existingIndex > -1) {
        saved[existingIndex] = record;
      } else {
        saved.push(record);
      }
      await AsyncStorage.setItem(
        'downloadedWallpapersData',
        JSON.stringify(saved),
      );
    } catch (e) {
      console.error('Failed to save download record:', e);
    }
  };

  // ----------------------------------------- // 5️⃣ Wallpaper Setter (Mock) (No Change) // -----------------------------------------
  const setWallpaper = (localPath: string, screenType: string) => {
    console.log(`Setting wallpaper: ${localPath} for screen: ${screenType}`);
    return Promise.resolve();
  };

  const handleSetWallpaper = async (
    localPath: string,
    screenType: 'HOME_SCREEN' | 'LOCK_SCREEN' | 'BOTH',
  ) => {
    try {
      await setWallpaper(`file://${localPath}`, screenType);
      const screenName =
        screenType === 'HOME_SCREEN'
          ? 'Home Screen'
          : screenType === 'LOCK_SCREEN'
          ? 'Lock Screen'
          : 'Home and Lock Screens';
      Alert.alert('Success!', `Wallpaper set for ${screenName}.`);
      await saveDownloadedRecord(localPath);
    } catch (e) {
      console.error('Set wallpaper error:', e);
      Alert.alert('Error', 'Failed to set wallpaper.');
    }
  };

  // ----------------------------------------- // 6️⃣ Download and Action handler (No Change) // -----------------------------------------
  const startDownloadAndExecute = async (
    actionType: 'HOME_SCREEN' | 'LOCK_SCREEN' | 'BOTH' | 'DOWNLOAD_ONLY',
  ) => {
    setIsDownloading(true);

    try {
      if (Platform.OS === 'android') {
        const permission =
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permission);

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Required', 'Allow storage permission.');
          return;
        }
      }
      const fileName = `wallpaper_${Date.now()}.jpg`;
      const path = `${RNFS.PicturesDirectoryPath}/${fileName}`;
      const download = RNFS.downloadFile({ fromUrl: identifier, toFile: path });
      const result = await download.promise;
      if (result.statusCode !== 200) {
        Alert.alert('Error', 'Failed to download wallpaper.');
        return;
      }
      if (Platform.OS === 'android') {
        await RNFS.scanFile(path);
      }
      switch (actionType) {
        case 'HOME_SCREEN':
        case 'LOCK_SCREEN':
        case 'BOTH':
          await handleSetWallpaper(path, actionType);
          break;
        case 'DOWNLOAD_ONLY':
          await saveDownloadedRecord(path);
          Alert.alert('Downloaded', 'Wallpaper saved to your gallery ❤️');
          break;
      }
    } catch (e) {
      console.log('Download error:', e);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsDownloading(false);
    }
  };

  // ----------------------------------------- // 7️⃣ Drawer Action Handler (No Change) // -----------------------------------------
  const handleDrawerAction = (
    type: 'HOME_SCREEN' | 'LOCK_SCREEN' | 'BOTH' | 'DOWNLOAD_ONLY',
  ) => {
    setIsModalVisible(false);
    startDownloadAndExecute(type);
  };

  // ----------------------------------------- // 8️⃣ Open Bottom Sheet (No Change) // -----------------------------------------
  const handleDownload = () => {
    if (isDownloading) {
      Alert.alert('Wait', 'Download already in progress.');
      return;
    }
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left-circle" size={32} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>

        <SafeAreaView style={styles.footer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Icon name="share-social" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDownload}
              style={styles.actionButton}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Text style={{ color: '#fff' }}>...</Text>
              ) : (
                <Feather name="download" size={24} color="#fff" />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <FontAwesome
                name={isLiked ? 'heart' : 'heart-o'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={modalStyles.overlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={modalStyles.drawerContainer}>
            <View style={modalStyles.handleBar} />
            <Text style={modalStyles.drawerTitle}>
              Set Wallpaper & Download
            </Text>

            <TouchableOpacity
              style={modalStyles.drawerOption}
              onPress={() => handleDrawerAction('HOME_SCREEN')}
            >
              <Text style={modalStyles.optionText}>Set Home Screen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={modalStyles.drawerOption}
              onPress={() => handleDrawerAction('LOCK_SCREEN')}
            >
              <Text style={modalStyles.optionText}>Set Lock Screen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={modalStyles.drawerOption}
              onPress={() => handleDrawerAction('BOTH')}
            >
              <Text style={modalStyles.optionText}>Set Both (Home & Lock)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[modalStyles.drawerOption, modalStyles.lastOption]}
              onPress={() => handleDrawerAction('DOWNLOAD_ONLY')}
            >
              <Text style={modalStyles.optionText}>Download to Phone</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={modalStyles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={modalStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default WallpaperDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 30,
    padding: 8,
    gap: 20,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 18,
    minWidth: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

// --- Stylesheet for the Modal Drawer ---
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  drawerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  drawerOption: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 15,
    marginTop: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff4d60',
  },
});
