import { StyleSheet, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Input = () => {
  const [text, setText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const handlePress = () => {
    setSubmittedText(text);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder="Write something"
        />
        <Pressable title="Submit" style={styles.button} onPress={handlePress}>
          <Text>Submit</Text>
        </Pressable>
        <Text style={[styles.TextColor, { marginBottom: 10 }]}>
          Result : {submittedText}
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: { flex: 1 },
  button: {
    padding: 10,
    backgroundColor: 'lightblue',
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 5,
    color: '#fff',
  },
  TextColor: { color: '#fff', marginTop: 10, fontSize: 16 },
});
