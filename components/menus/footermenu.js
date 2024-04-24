import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const FooterMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const isRouteActive = (routeName) => {
    return route.name === routeName;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.menuItem, isRouteActive('Home') && styles.activeMenuItem]}
        onPress={() => {navigation.navigate('Home')}}>
        <Text style={[styles.menuText, isRouteActive('Home') && styles.activeMenuText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.menuItem, isRouteActive('Post') && styles.activeMenuItem]}
        onPress={() => {navigation.navigate('Post')}}>
        <Text style={[styles.menuText, isRouteActive('Post') && styles.activeMenuText]}>Reviews</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.menuItem, isRouteActive('History') && styles.activeMenuItem]}
        onPress={() => {navigation.navigate('History')}}>
        <Text style={[styles.menuText, isRouteActive('History') && styles.activeMenuText]}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.menuItem, isRouteActive('Myposts') && styles.activeMenuItem]}
        onPress={() => {navigation.navigate('Myposts')}}>
        <Text style={[styles.menuText, isRouteActive('Myposts') && styles.activeMenuText]}>My Reviews</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.menuItem, isRouteActive('Scan') && styles.activeMenuItem]}
        onPress={() => {navigation.navigate('Scan')}}>
        <Text style={[styles.menuText, isRouteActive('Scan') && styles.activeMenuText]}>Scan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff', // Change to your desired background color
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  menuItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // Change to your desired default text color
  },
  activeMenuItem: {
    backgroundColor: 'black', // Change to your desired active menu item background color
    borderColor : 'grey',
    borderWidth : 2,
    borderRadius : 10
  },
  activeMenuText: {
    color: 'white', // Change to your desired active menu text color
  },
});

export default FooterMenu;
