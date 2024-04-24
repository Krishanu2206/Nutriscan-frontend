import {View, Text} from 'react-native';
import React from 'react';
import { useContext } from 'react';
const Stack = createNativeStackNavigator();
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from '../screens/auth/register';
import Login from '../screens/auth/login';
import Home from '../screens/home';
import { authcontext } from '../context/authcontext';
import HeaderMenu from './menus/header';
import Account from '../screens/auth/account';
import About from '../screens/auth/about';
import Post from '../screens/auth/post';
import Myposts from '../screens/myposts';
import Scan from '../screens/scan';
import History from '../screens/history';

const Screenmenu= ()=> {
    //global state
    const [state] = useContext(authcontext);

    //auth condition true or false
    const authenticateduser = state?.user && state?.token;

    return (
      <Stack.Navigator initialRouteName="Login">
        {
          authenticateduser? 
          (
            <>
            <Stack.Screen name="Home" component={Home} options={{
              title: "NUTRISCAN",
              headerRight : () => <HeaderMenu/> }} />
            <Stack.Screen name="Post" component={Post} options={{
              title: "NUTRISCAN",
              headerRight : () => <HeaderMenu/> }} />
            <Stack.Screen name="Myposts" component={Myposts} options={{
              title: "NUTRISCAN",
              headerRight : () => <HeaderMenu/> }} />
            <Stack.Screen name="History" component={History} options={{
              title: "NUTRISCAN",
              headerRight : () => <HeaderMenu/> }} />
            <Stack.Screen name="Scan" component={Scan} options={{
              title: "NUTRISCAN",
              headerRight : () => <HeaderMenu/> }} />
            </>
          ):
          (
            <>
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
            </>
          )
        }
      </Stack.Navigator>
    )
};

export default Screenmenu;