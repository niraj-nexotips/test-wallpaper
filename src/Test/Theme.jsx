import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, useColorScheme, StyleSheet } from 'react-native';

const theme = () => {
  const theme = useColorScheme();
  const isDarkMode = theme === 'dark';
  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: backgroundColor }]}
      >
        <View style={styles.main}>
          <Text style={[styles.mainText, { color: textColor }]}>
            Hello World App
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default theme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: { fontSize: 20, fontWeight: 'bold' },
});
