import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

type NavProps = {
  goBack: () => void;
};

const PROFILE_KEY = 'user_profile_v1';

const EditProfile: React.FC = () => {
  const navigation = useNavigation<NavProps>();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_KEY);
        if (raw) {
          const p = JSON.parse(raw);
          setName(p.name || '');
          setEmail(p.email || '');
        }
      } catch (e) {
        console.warn('Failed to load profile:', e);
      }
    })();
  }, []);

  const saveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter your name.');
      return;
    }
    setSaving(true);
    try {
      const profile = { name: name.trim(), email: email.trim() };
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      Alert.alert('Saved', 'Profile updated.');
      navigation.goBack();
    } catch (e) {
      console.error('Save failed', e);
      Alert.alert('Error', 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left-circle" size={32} color="gray" />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
          >
            <View style={styles.form}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                placeholder="Your name"
                style={styles.input}
                value={name}
                onChangeText={setName}
                returnKeyType="next"
              />

              <Text style={[styles.label, { marginTop: 18 }]}>Email</Text>
              <TextInput
                placeholder="you@example.com"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={[styles.saveButton, saving && { opacity: 0.7 }]}
                onPress={saveProfile}
                disabled={saving}
              >
                <Text style={styles.saveText}>
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  form: {
    marginTop: 24,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
  },
  label: { color: '#444', fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  saveButton: {
    backgroundColor: '#4064f5',
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
