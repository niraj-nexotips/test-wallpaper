import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Dimensions,
  Animated,
  TouchableOpacity,
  NativeSyntheticEvent,
  LayoutChangeEvent,
  Keyboard,
} from 'react-native';
import Wallpapers from './Wallpaper/Wallpaper';
import LiveWallpapers from './LiveWallpaper';
import Categories from './Categories';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView as ScrollViewType } from 'react-native';
import Search from '../Search';

const screenWidth = Dimensions.get('window').width;

type TabName = 'wallpaper' | 'live' | 'categories';

type TabLayout = {
  x: number;
  width: number;
  height: number;
  y: number;
};

const Home: React.FC = () => {
  const [tab, setTab] = useState<TabName>('wallpaper');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const animation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollViewType | null>(null);
  const tabsData = useRef<Record<TabName, TabLayout>>({} as any);
  const tabsOrder: TabName[] = ['wallpaper', 'live', 'categories'];
  const contentWidth = useRef(0);

  const handleScrollToTab = (tabName: TabName) => {
    const layout = tabsData.current[tabName];
    if (scrollViewRef.current && layout) {
      let scrollToX = layout.x - screenWidth / 2 + layout.width / 2;

      scrollToX = Math.max(0, scrollToX);
      scrollToX = Math.min(scrollToX, contentWidth.current - screenWidth + 50);

      scrollViewRef.current.scrollTo({ x: scrollToX, animated: true });
    }
  };

  const handleTabPress = (newTab: TabName) => {
    if (newTab === tab) {
      return handleScrollToTab(newTab);
    }

    const oldIndex = tabsOrder.indexOf(tab);
    const newIndex = tabsOrder.indexOf(newTab);
    const direction = newIndex > oldIndex ? -1 : 1;

    Animated.timing(animation, {
      toValue: direction,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setTab(newTab);
      handleScrollToTab(newTab);

      animation.setValue(-direction);
      Animated.timing(animation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleTabLayout = (
    tabName: TabName,
    event: NativeSyntheticEvent<LayoutChangeEvent['nativeEvent']>,
  ) => {
    tabsData.current[tabName] = event.nativeEvent.layout;
  };

  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleSearchCancel = () => {
    setIsSearching(false);
    setSearchTerm('');
    Keyboard.dismiss();
  };

  const renderContent = () => {
    switch (tab) {
      case 'wallpaper':
        return <Wallpapers />;
      case 'live':
        return <LiveWallpapers />;
      case 'categories':
        return <Categories />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1 }}>
          <View>
            <View style={styles.searchBar}>
              {isSearching && (
                <TouchableOpacity onPress={handleSearchCancel}>
                  <Icon
                    name="arrow-back"
                    size={18}
                    color="#4064f5"
                    style={{ marginRight: 8 }}
                  />
                </TouchableOpacity>
              )}
              {!isSearching && (
                <Icon
                  name="search"
                  size={18}
                  color="#777"
                  style={{ marginRight: 8 }}
                />
              )}

              <TextInput
                style={[styles.input, { width: isSearching ? '80%' : '100%' }]}
                placeholder="Find wallpaper"
                value={searchTerm}
                onChangeText={setSearchTerm}
                onFocus={handleSearchFocus}
                onBlur={() => {
                  if (!searchTerm) {
                    setIsSearching(false);
                  }
                }}
                autoCapitalize="none"
              />
              {isSearching && searchTerm.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchTerm('')}
                  style={styles.clearButton}
                >
                  <Icon name="close-circle" size={18} color="#777" />
                </TouchableOpacity>
              )}
            </View>

            {!isSearching && (
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                onContentSizeChange={w => (contentWidth.current = w)}
                contentContainerStyle={styles.topTabsScroll}
              >
                <TouchableOpacity onPress={() => handleTabPress('wallpaper')}>
                  <Text
                    onLayout={e => handleTabLayout('wallpaper', e)}
                    style={[
                      styles.topTab,
                      tab === 'wallpaper' && styles.activeTab,
                    ]}
                  >
                    Wallpapers
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleTabPress('live')}>
                  <Text
                    onLayout={e => handleTabLayout('live', e)}
                    style={[styles.topTab, tab === 'live' && styles.activeTab]}
                  >
                    Live Wallpapers
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleTabPress('categories')}>
                  <Text
                    onLayout={e => handleTabLayout('categories', e)}
                    style={[
                      styles.topTab,
                      tab === 'categories' && styles.activeTab,
                    ]}
                  >
                    Categories
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>

          <View style={{ flex: 1, overflow: 'hidden' }}>
            {isSearching ? (
              <Search searchTerm={searchTerm} onCancel={handleSearchCancel} />
            ) : (
              <Animated.View
                style={{
                  flex: 1,
                  transform: [
                    {
                      translateX: animation.interpolate({
                        inputRange: [-1, 0, 1],
                        outputRange: [-screenWidth, 0, screenWidth],
                      }),
                    },
                  ],
                }}
              >
                {renderContent()}
              </Animated.View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  searchBar: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    paddingVertical: 10,
    paddingEnd: 10,
    color: '#000',
  },
  clearButton: {
    padding: 4,
  },
  topTabsScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 25,
    height: 48,
    width: '100%',
    justifyContent: 'space-between',
  },
  topTab: {
    fontSize: 16,
    fontWeight: '600',
    color: '#777',
  },
  activeTab: {
    color: '#4064f5',
    borderBottomWidth: 2,
    borderColor: '#4064f5',
    paddingBottom: 4,
  },
});

const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  promptText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
  },
});
