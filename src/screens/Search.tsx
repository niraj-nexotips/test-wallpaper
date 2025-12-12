import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const itemMargin = 10;
const numColumns = 3;
const itemWidth = screenWidth / numColumns - itemMargin * 1.5;

const boxData = [
  {
    uri: 'https://i.pinimg.com/736x/d6/4d/1d/d64d1d4645daadb9d0c7ac88818170be.jpg',
    category: 'Nature',
    color: '#A3D9A5',
  },
  {
    uri: 'https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg?cs=srgb&dl=pexels-rpnickson-2486168.jpg&fm=jpg',
    category: 'Abstract',
    color: '#F7A072',
  },
  {
    uri: 'https://wallpaperaccess.com/full/317501.jpg',
    category: 'Industrial',
    color: '#9CCBFF',
  },
  {
    uri: 'https://wallpaperaccess.com/full/2637581.jpg',
    category: 'Nature',
    color: '#FFD97D',
  },
  {
    uri: 'https://wallpaperaccess.com/full/33119.jpg',
    category: 'Cars',
    color: '#D39FF6',
  },
  {
    uri: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg',
    category: 'Nature',
    color: '#FF9AA2',
  },
  {
    uri: 'https://wallpaperaccess.com/full/1122112.jpg',
    category: 'Cars',
    color: '#B5EAD7',
  },
  {
    uri: 'https://wallpaperaccess.com/full/279547.jpg',
    category: 'Technology',
    color: '#C7CEEA',
  },
  {
    uri: 'https://wallpaperaccess.com/full/1425307.jpg',
    category: 'Space',
    color: '#FFDAC1',
  },
  {
    uri: 'https://images.pexels.com/photos/34950/pexels-photo.jpg',
    category: 'Food',
    color: '#E2F0CB',
  },
  {
    uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    category: 'Travel',
    color: '#A3D9A5',
  },
  {
    uri: 'https://images.unsplash.com/photo-1503264116251-35a269479413',
    category: 'Architecture',
    color: '#F7A072',
  },
];

type WallpaperItem = (typeof boxData)[0];
type DetailParams = { imageUrl: string; originalUrl?: string };
type NavProps = {
  navigate: (screen: 'Detail', params: DetailParams) => void;
};

const Search: React.FC<{ searchTerm: string; onCancel: () => void }> = ({
  searchTerm,
  onCancel,
}) => {
  const filteredData = useMemo(() => {
    if (!searchTerm || searchTerm.length < 3) {
      return [];
    }
    const lowerCaseTerm = searchTerm.toLowerCase();

    return boxData.filter(item =>
      item.category.toLowerCase().includes(lowerCaseTerm),
    );
  }, [searchTerm]);

  const navigation = useNavigation<NavProps>();

  if (!searchTerm || searchTerm.length < 3) {
    return (
      <View style={searchStyles.container}>
        <Text style={searchStyles.promptText}>
          Start typing (3+ characters) to search by category.
        </Text>
      </View>
    );
  }

  const handleImagePress = (uri: string) => {
    navigation.navigate('Detail', { imageUrl: uri });
  };

  const renderItem = ({ item }: { item: WallpaperItem }) => (
    <TouchableOpacity
      style={searchStyles.imageWrapper}
      onPress={() => handleImagePress(item.uri)}
    >
      <Image
        source={{ uri: item.uri }}
        style={searchStyles.image}
        resizeMode="cover"
      />
      <View style={searchStyles.categoryOverlay}>
        <Text style={searchStyles.categoryText}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={searchStyles.container}>
      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.uri}
          renderItem={renderItem}
          numColumns={numColumns}
          contentContainerStyle={searchStyles.flatListContent}
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        <View style={searchStyles.noResultsView}>
          <Text style={searchStyles.promptText}>
            No results found for "**{searchTerm}**"
          </Text>
          <Text style={{ color: '#999', marginTop: 10 }}>
            Try a different category name (e.g., Nature, Cars).
          </Text>
        </View>
      )}
    </View>
  );
};

export default Search;

const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  promptText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    padding: 20,
  },
  flatListContent: {
    paddingHorizontal: itemMargin / 2,
    paddingBottom: 10,
  },
  imageWrapper: {
    width: itemWidth,
    height: 250,
    margin: itemMargin / 2,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    top: '43%',
    left: 0,
    right: 0,
    paddingVertical: 5,
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noResultsView: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
});
