import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

const Wallpaper = () => {
  const boxData = [
    {
      type: 'image',
      uri: 'https://i.pinimg.com/736x/d6/4d/1d/d64d1d4645daadb9d0c7ac88818170be.jpg',
      category: 'Nature',
      color: '#A3D9A5',
    },
    {
      type: 'image',
      uri: 'https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg?cs=srgb&dl=pexels-rpnickson-2486168.jpg&fm=jpg',
      category: 'Abstract',
      color: '#F7A072',
    },
    {
      type: 'image',
      uri: 'https://wallpaperaccess.com/full/317501.jpg',
      category: 'Industrial',
      color: '#9CCBFF',
    },
    {
      type: 'image',
      uri: 'https://wallpaperaccess.com/full/2637581.jpg',
      category: 'Kids',
      color: '#FFD97D',
    },
    {
      type: 'image',
      uri: 'https://wallpaperaccess.com/full/33119.jpg',
      category: 'Geometric',
      color: '#D39FF6',
    },
    {
      type: 'image',
      uri: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg',
      category: 'Animals',
      color: '#FF9AA2',
    },
    {
      type: 'image',
      uri: 'https://wallpaperaccess.com/full/1122112.jpg',
      category: 'Cars',
      color: '#B5EAD7',
    },
    {
      type: 'image',
      uri: 'https://wallpaperaccess.com/full/279547.jpg',
      category: 'Technology',
      color: '#C7CEEA',
    },
    {
      type: 'image',
      uri: 'https://wallpaperaccess.com/full/1425307.jpg',
      category: 'Space',
      color: '#FFDAC1',
    },
    {
      type: 'image',
      uri: 'https://images.pexels.com/photos/34950/pexels-photo.jpg',
      category: 'Food',
      color: '#E2F0CB',
    },
    {
      type: 'image',
      uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
      category: 'Travel',
      color: '#A3D9A5',
    },
    {
      type: 'image',
      uri: 'https://images.unsplash.com/photo-1503264116251-35a269479413',
      category: 'Architecture',
      color: '#F7A072',
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={true}
      decelerationRate="normal"
      scrollEventThrottle={16}
      overScrollMode="always"
    >
      <Text style={styles.mainHeadingText}>Best of the month</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.main}
      >
        {boxData.map((item, index) => (
          <Image
            key={index}
            source={{ uri: item.uri }}
            style={styles.imageStyle}
          />
        ))}
      </ScrollView>

      <Text style={[styles.mainHeadingText, { paddingTop: 0 }]}>
        The color tone
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boxStyleMain}
      >
        {boxData.map((item, index) => (
          <Image
            key={index}
            style={[styles.boxStyle, { backgroundColor: item.color }]}
          />
        ))}
      </ScrollView>

      <Text style={[styles.mainHeadingText, { paddingTop: 0 }]}>
        Categories
      </Text>
      <View style={styles.categoriesMain}>
        {boxData.map((item, index) => (
          <View key={index} style={styles.categoryCard}>
            <Image source={{ uri: item.uri }} style={styles.categoryImage} />
            <View style={styles.textOverlay}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Wallpaper;

const styles = StyleSheet.create({
  main: {
    padding: 20,
    gap: 20,
    flexDirection: 'row',
  },
  boxStyleMain: {
    padding: 20,
    gap: 10,
    flexDirection: 'row',
  },
  mainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  mainHeadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    paddingTop: 20,
    paddingLeft: 20,
  },
  cardBox: {
    width: 200,
    height: 300,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: 200,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  boxStyle: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  categoriesMain: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
    paddingBottom: 20,
  },
  categoryCard: {
    width: '47%',
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
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
    width: '100%',
    top: '40%',
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 18,
  },
});
