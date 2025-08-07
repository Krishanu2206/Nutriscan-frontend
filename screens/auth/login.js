import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet , Alert} from 'react-native';
import { Authprovider, authcontext } from '../../context/authcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = ({navigation}) => {
  //global state managing
  const [state, setstate] = useContext(authcontext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);

  const handleLogin = async() => {
        // Handle login logic here
        try{
            setloading(true);
            if(!email || !password){
                setloading(false);
                return Alert.alert("Fill all fields")
            }

            const requestbody = {
              email : email,
              password : password
            };
    
            const res = await fetch("https://nutriscan-backend.onrender.com/api/v1/auth/login", {
              method : "POST",
              headers: {
                "Content-Type" : "application/json",
              },
              body : JSON.stringify(requestbody),
            });
    
            const result = await res.json();

            //global 
            setstate(result);
            
            if(result.success == false){
              setloading(false);
              return Alert.alert(result.message);
            }
            await AsyncStorage.setItem('@auth', JSON.stringify(result));
    
            console.log('logging in:', { email, password });
            
            setloading(false);
            navigation.navigate('Home');
            return Alert.alert(result.message);
        }
        catch(err){
            setloading(false);
            console.log(err);
        }
  };

  const navigateToRegister = () => {
    // Navigate to the register page
    navigation.navigate('Register');
  };

/*   const getdata = async() => {
    let data = await AsyncStorage.getItem('@auth');
    console.log(data);
  };
  getdata(); */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoComplete='email'
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoComplete='password'
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{loading ? "Logging in" : "Login"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.registerText}>Not a user? Register</Text>
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
  registerText: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
  },
});

export default LoginPage;
