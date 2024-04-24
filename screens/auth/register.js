import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);

  const handleSubmit = async() => {
    // Handle registration logic here
    try{
        setloading(true);
        if(!name || !email || !password){
            setloading(false);
            return Alert.alert("Fill all fields")
        }
        
        const requestbody = {
          name : name,
          email : email,
          password : password
        };

        const res = await fetch("http://192.168.0.104:8080/api/v1/auth/register", {
          method : "POST",
          headers: {
            "Content-Type" : "application/json",
          },
          body : JSON.stringify(requestbody),
        });

        const result = await res.json();
        if(result.success == false){
          setloading(false);
          return Alert.alert(result.message);
        }

        navigation.navigate('Login')
        console.log('Registering:', { name, email, password });
        setloading(false);
        return Alert.alert(result.message);
    }
    catch(err){
        setloading(false);
        console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoComplete='password'
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} >
        <Text style={styles.buttonText}>{loading ? "Please Wait..." : "Register"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    width: '80%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Register;

