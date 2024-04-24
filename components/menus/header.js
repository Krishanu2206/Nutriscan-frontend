import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { authcontext, Authprovider } from '../../context/authcontext';

const HeaderMenu = () => {
  //global state
  const [state, setstate] = useContext(authcontext);
  //logout
  const handlelogout = async() => {
    setstate({token : '', user: null});
    await AsyncStorage.removeItem('@auth');
    return Alert.alert("Logout successfully");
  }

  return (
    <View>
        <TouchableOpacity onPress={handlelogout}>
            <Text style={styles.logouttext}>Logout</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logouttext:{
    color:"red",
    fontSize : 20,
  }
});

export default HeaderMenu;
