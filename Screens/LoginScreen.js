import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Input, Image} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activity, setactivity] = useState(false);

  function onAuthStateChange(authUser) {
    if (authUser) {
      navigation.replace('HomeScreen');
    }
  }
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(onAuthStateChange);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User signed in!');
        navigation.replace('HomeScreen');
      })
      .catch(error => {
        console.error(error);
      });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c6bed" />
      <Image
        source={{
          uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png',
        }}
        style={styles.logo}
      />
      <View style={styles.inputcontainer}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          type="Email"
        />
        <Input
          placeholder="password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
          type="password"
        />
        <Button
          containerStyle={styles.button}
          onPress={() => {
            Keyboard.dismiss();
            setactivity(true);
            signIn();
          }}
          title="Login"
        />
        <Button
          containerStyle={styles.button}
          type="outline"
          title="Register"
          onPress={() => {
            console.log('register');
            navigation.navigate('Register');
          }}
        />
        <ActivityIndicator
          style={styles.ActivityIndicator}
          animating={activity}
          size="large"
          color="#2c6bed"
        />
      </View>
      <View style={styles.dummy} />
    </KeyboardAvoidingView>
  );
};
//() => navigation.navigate('Register')
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  logo: {width: 170, height: 170},
  inputcontainer: {
    width: 300,
    alignItems: 'center',
  },
  button: {
    width: 200,
    marginTop: 10,
    a
  },
  ActivityIndicator: {
    paddingTop: 20,
  },
  dummy: {height: 120},
});
