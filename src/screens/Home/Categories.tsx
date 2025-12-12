import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

type CategoryItem = {
  uri: string;
  category: string;
  color: string;
};

const Categories: React.FC = () => {
  const boxData: CategoryItem[] = [
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
      category: 'Kids',
      color: '#FFD97D',
    },
    {
      uri: 'https://wallpaperaccess.com/full/33119.jpg',
      category: 'Geometric',
      color: '#D39FF6',
    },
    {
      uri: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg',
      category: 'Animals',
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

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={true}
      decelerationRate="normal"
      scrollEventThrottle={16}
      overScrollMode="always"
    >
      <Text style={[styles.mainHeadingText, { paddingTop: 0 }]}>Nature</Text>

      <View style={styles.largeCardContainer}>
        {boxData.length > 0 && (
          <View key={0} style={styles.largeCategoryCard}>
            <Image
              source={{ uri: boxData[0].uri }}
              style={styles.largeCategoryImage}
            />
            <View style={styles.textOverlay}>
              <Text style={styles.categoryText}>{boxData[0].category}</Text>
            </View>
          </View>
        )}
      </View>

      <Text style={styles.gridHeadingText}>Categories Grid</Text>

      <View style={styles.categoriesGrid}>
        {boxData.slice(1).map((item, index) => (
          <View key={index + 1} style={styles.smallCategoryCard}>
            <Image
              source={{ uri: item.uri }}
              style={styles.smallCategoryImage}
            />
            <View style={styles.textOverlay}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  mainHeadingText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    paddingTop: 20,
    paddingLeft: 20,
  },
  gridHeadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    paddingTop: 10,
    paddingLeft: 20,
    marginBottom: 10,
  },
  largeCardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  largeCategoryCard: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ddd',
  },
  largeCategoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 14,
  },
  categoriesGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 10,
    paddingBottom: 20,
    justifyContent: 'flex-start',
  },
  smallCategoryCard: {
    width: '31.3%',
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ddd',
  },
  smallCategoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 14,
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 14,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
