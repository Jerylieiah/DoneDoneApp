import { LogBox, StyleSheet, Image, TextInput, Button, Alert, PlatformColor, Platform } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View, } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, gql } from '@apollo/client';


const SIGN_IN_MUTATION = gql`
mutation signIn(
  $email: String!, 
  $password: String!) 

{  
  signIn(input: {
    email: $email, 
    password: $password
  }) {
    token
    user {
      id
      name
      email
    }
  }
}
`;


const LoginScreen = () => {  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigation = useNavigation();
  
  const [signIn, { data, error, loading }] = useMutation(SIGN_IN_MUTATION);
  
  useEffect(() => {
    if (error) {
      Alert.alert('Email or password is invalid.');
    }
  }, [error])
  
  if (data) {
    AsyncStorage
      .setItem('token', data.signIn.token)
      .then(() => { 
        navigation.navigate('Home');
    })
  }
  
  const onSubmit = () => {
     signIn({variables: { email, password }})
  };

  return (
    <View style={styles.container}>
      <Image style={{width:200, height:200}} source = {require('../assets/images/logo-removebg-preview.png')}></Image>
      <Text style={styles.title}>Login</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.body}>Email</Text>
      <TextInput keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="email address (e.g.)"/>
      
      <Text style={styles.body}>Password</Text>
      <TextInput secureTextEntry={true} style={styles.input} value={password} onChangeText={setPassword} placeholder="password (e.g.)"/>
      <Button 
        title="Login"
        onPress={onSubmit}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button 
        title="Register"
        onPress = {() => navigation.navigate('SignUp')}
      />
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 150,
    margin: 12,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        color: PlatformColor("label"),
        backgroundColor: PlatformColor("tertiarySystemBackground"),
      }
    }),
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
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});