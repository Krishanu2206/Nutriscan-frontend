import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Authprovider, authcontext} from './context/authcontext'
import Register from "./screens/auth/register";
import Login from "./screens/auth/login";
import Home from "./screens/home";
import Rootnavigation from './navigation';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Rootnavigation/>
    </NavigationContainer>
  );
}

