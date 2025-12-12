import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShimmerPlaceholder from './ShimmerPlaceholder';

type RootStackParamList = {
  Liked: undefined;
  Downloads: undefined;
  EditProfile: undefined;
  Detail: { imageUrl: string; originalUrl?: string };
};

type NavProps = {
  navigate: <T extends keyof RootStackParamList>(
    screen: T,
    params?: RootStackParamList[T],
  ) => void;
};

const screenWidth = Dimensions.get('window').width;
const AVATAR_SIZE = 120;
const AVATAR_MIN = 44;
const SCROLL_RANGE = 120;
const PROFILE_KEY = 'user_profile_v1';

const Profile: React.FC = () => {
  const navigation = useNavigation<NavProps>();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>('Jane Doe');
  const [email, setEmail] = useState<string>('janedoe@example.com');

  const avatarUrl =
    'https://i.pinimg.com/736x/33/ba/df/33badf7bd7e2bd56b21e3d972fe3ed5a.jpg';

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem(PROFILE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setName(p.name || 'Jane Doe');
        setEmail(p.email || '');
      }
    } catch (e) {
      console.warn('Failed to load profile:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const avatarSize = scrollY.interpolate({
    inputRange: [0, SCROLL_RANGE],
    outputRange: [AVATAR_SIZE, AVATAR_MIN],
    extrapolate: 'clamp',
  });

  const avatarMarginTop = scrollY.interpolate({
    inputRange: [0, SCROLL_RANGE],
    outputRange: [20, 6],
    extrapolate: 'clamp',
  });

  const nameOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_RANGE / 2, SCROLL_RANGE],
    outputRange: [1, 0.6, 0],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_RANGE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const menuItems: {
    name: string;
    icon: string;
    action: () => void;
    color: string;
  }[] = [
    {
      name: 'Upload Wallpaper',
      icon: 'upload-cloud',
      action: () => {},
      color: '#4064f5',
    },
    {
      name: 'Liked Wallpapers',
      icon: 'heart',
      action: () => navigation.navigate('Liked'),
      color: '#ff4d60',
    },
    {
      name: 'Downloaded',
      icon: 'download',
      action: () => navigation.navigate('Downloads'),
      color: '#00bfa5',
    },
    {
      name: 'Categories',
      icon: 'grid',
      action: () => {},
      color: '#ffa200',
    },
    {
      name: 'Settings',
      icon: 'settings',
      action: () => {},
      color: '#5e5e5e',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.animatedHeader,
            {
              opacity: headerTitleOpacity,
            },
          ]}
        >
          <Text style={styles.headerTitle}>{name}</Text>
        </Animated.View>

        <Animated.ScrollView
          contentContainerStyle={styles.scrollContainer}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: scrollY } },
              },
            ],
            { useNativeDriver: false },
          )}
        >
          <Animated.View
            style={{ alignItems: 'center', marginTop: avatarMarginTop }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Animated.View
                style={[
                  styles.avatarContainer,
                  {
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: avatarSize,
                  },
                ]}
              >
                {loading ? (
                  <ShimmerPlaceholder
                    width={avatarSize}
                    height={avatarSize}
                    borderRadius={999}
                  />
                ) : (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={{ width: '100%', height: '100%', borderRadius: 999 }}
                  />
                )}
              </Animated.View>
            </TouchableOpacity>

            <Animated.Text style={[styles.userName, { opacity: nameOpacity }]}>
              {loading ? (
                <ShimmerPlaceholder width={140} height={20} borderRadius={6} />
              ) : (
                name
              )}
            </Animated.Text>

            <Animated.Text style={[styles.userEmail, { opacity: nameOpacity }]}>
              {loading ? (
                <ShimmerPlaceholder width={200} height={14} borderRadius={6} />
              ) : (
                email
              )}
            </Animated.Text>
          </Animated.View>

          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>My Activity</Text>

            {loading ? (
              <>
                <View style={styles.menuItem}>
                  <ShimmerPlaceholder
                    width={40}
                    height={40}
                    borderRadius={20}
                    style={{ marginRight: 12 }}
                  />
                  <ShimmerPlaceholder width={'60%'} height={16} />
                </View>
                <View style={styles.menuItem}>
                  <ShimmerPlaceholder
                    width={40}
                    height={40}
                    borderRadius={20}
                    style={{ marginRight: 12 }}
                  />
                  <ShimmerPlaceholder width={'60%'} height={16} />
                </View>
                <View style={styles.menuItem}>
                  <ShimmerPlaceholder
                    width={40}
                    height={40}
                    borderRadius={20}
                    style={{ marginRight: 12 }}
                  />
                  <ShimmerPlaceholder width={'60%'} height={16} />
                </View>
              </>
            ) : (
              menuItems.map((m, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.menuItem}
                  onPress={m.action}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: m.color + '20' },
                    ]}
                  >
                    <Icon name={m.icon} size={20} color={m.color} />
                  </View>
                  <Text style={styles.menuText}>{m.name}</Text>
                  <Icon name="chevron-right" size={18} color="#ccc" />
                </TouchableOpacity>
              ))
            )}
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f8f8' },
  container: { flex: 1 },
  scrollContainer: { paddingVertical: 14, paddingBottom: 40 },
  animatedHeader: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE,
    borderWidth: 3,
    borderColor: '#4064f5',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    color: '#222',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 12,
    marginTop: 20,
    paddingBottom: 10,
    elevation: 2,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
