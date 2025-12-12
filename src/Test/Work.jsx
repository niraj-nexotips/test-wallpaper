import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Work = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.cmnText}>Hello World App</Text>
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          />
          <TouchableOpacity
            style={{ padding: 10, backgroundColor: 'lightblue', marginTop: 10 }}
            onPress={() => alert('TouchableOpacity pressed!')}
          >
            <Text>Press Me</Text>
          </TouchableOpacity>
          <TouchableHighlight
            onPress={() => alert('TouchableHighlight pressed!')}
            underlayColor="lightgray"
            style={styles.cmnTouchable}
          >
            <Text>TouchableHighlight Press Me</Text>
          </TouchableHighlight>
          <Pressable>
            {({ pressed }) => (
              <Text
                style={{
                  padding: 10,
                  backgroundColor: pressed ? 'lightcoral' : 'lightyellow',
                  marginTop: 10,
                }}
              >
                {pressed ? 'Pressed!' : 'Press Me'}
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Work;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cmnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cmnTouchable: {
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: 'lightgreen',
    marginTop: 10,
  },
});
