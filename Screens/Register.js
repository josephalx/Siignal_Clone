import React, {useState, useLayoutEffect} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ToastAndroid,
} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {Input} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const Register = ({navigation}) => {
  const [name, setname] = useState('');
  const [password, setpassword] = useState('');
  const [email, setemail] = useState('');
  const [url, seturl] = useState('');

  const register = () => {
    console.log(`${email}...${password}`);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        console.log('created....');
        authUser.user.updateProfile({
          displayName: name,
          photoURL:
            url ||
            'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
        });
        console.log("navigation.navigate('Login')");
        ToastAndroid.show('Account created successfully', ToastAndroid.SHORT);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          ToastAndroid.show(
            'That email address is already in use!',
            ToastAndroid.SHORT,
          );
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          ToastAndroid.show(
            'That email address is already in use!',
            ToastAndroid.SHORT,
          );
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };
  const signout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };
  return (
    <KeyboardAvoidingView behavior="paddding" style={styles.container}>
      <Text h3>Create a Signal Account</Text>
      <View style={styles.inputcontainer}>
        <Input
          placeholder="Full Name"
          autoFocus
          type="text"
          value={name}
          onChangeText={text => {
            setname(text);
          }}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={text => setemail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={text => setpassword(text)}
        />
        <Input
          placeholder="Image URL (Optional)"
          type="text"
          value={url}
          onChangeText={text => seturl(text)}
          onSubmitEditing={register}
        />
        <Button
          containerStyle={styles.button}
          raised
          onPress={register}
          title="Register"
        />
      </View>
      <View style={{height: 10}} />
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  inputcontainer: {
    marginTop: 20,
    width: 300,
    alignItems: 'center',
  },
  button: {
    width: 200,
    marginTop: 10,
    borderRadius: 100,
  },
});
