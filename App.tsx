import React from 'react';
import { StyleSheet } from 'react-native';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
  RouteProp,
  ParamListBase,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import Home from './src/screens/Home/Home';
import Profile from './src/screens/Profile/Profile';
import Download from './src/screens/Download';
import Like from './src/screens/Like';
import EditProfile from './src/screens/Profile/EditProfile';
import WallpaperDetailScreen from './src/screens/Home/WallpaperDetailScreen';

import Feather from 'react-native-vector-icons/Feather';

import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-7290179508746811/4308828942';

export type RootStackParamList = {
  HomeRoot: undefined;
  Detail: { imageUrl: string; originalUrl?: string };
  EditProfile: undefined;
  MainTabs: undefined;
  Downloads: undefined;
  Liked: undefined;
  Profile: undefined;
};

export type TabParamList = {
  Home: undefined;
  Downloads: undefined;
  Liked: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// ------------ HOME STACK ------------
const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeRoot"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="HomeRoot" component={Home} />
      <Stack.Screen
        name="Detail"
        component={WallpaperDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? '';

        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#4064f5',

          tabBarStyle: {
            height: 80,
            paddingBottom: 6,
            display: routeName === 'Detail' ? 'none' : 'flex',
          },

          tabBarIconStyle: { marginTop: 12 },
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="grid" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Downloads"
        component={Download}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="download" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Liked"
        component={Like}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="heart" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ------------ ROOT STACK ------------
const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Detail" component={WallpaperDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};

// ------------ APP ROOT ------------
const App = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
