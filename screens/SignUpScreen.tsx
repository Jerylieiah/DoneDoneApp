import { LogBox, StyleSheet, Image, TextInput, Button } from 'react-native';
import React, { useState, useEffect } from "react";
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'

import { useMutation, gql } from '@apollo/client';

const SIGN_UP_MUTATION = gql`
  mutation signUp(
    $email: String!,
    $password: String!,
    $name: String!)

  {
    signUp(input: {
      email: $email,
      password: $password,
      name: $name
    }) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigation = useNavigation();
  
  const [signUp, { data, error, loading }] = useMutation(SIGN_UP_MUTATION);
  
  if (error) {
    Alert.alert('Error signing up. Try again');
  }
  
  if (data) {
    AsyncStorage
      .setItem('token', data.signUp.token)
      .then(() => { 
        navigation.navigate('Home')
    })
  }
  
  const onSubmit = () => {
     signUp({variables: { name, email, password }})
  }
  

  return (
    <View style={styles.container}>
      <Image style={{ width: 200, height: 200 }} source={require('../assets/images/logo.jpg')}></Image>
      <Text style={styles.body}>Name</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="full name"
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.body}>Email</Text>
      <TextInput 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType = "email-address"
        autoCapitalize = 'none' 
        placeholder="email address (e.g.)"
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.body}>Password</Text>
      <TextInput 
        secureTextEntry={true} 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} 
        placeholder="password (e.g.)"
      />
      <Button 
        title="Register me"
        onPress={onSubmit}
      />
    </View>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  home: {
    paddingRight:320,
    textAlignVertical: 'top',
  },
  welcome: {
    textAlignVertical: 'top',
    fontSize: 30,
    height:500,
    fontWeight: 'bold',
    
  },
  input: {
    height: 40,
    width: 150,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 10,
  },
  separator: {
    marginVertical: 15,
    height: 1,
    width: '80%',
  },
  
});