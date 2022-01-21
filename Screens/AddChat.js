import React, {useLayoutEffect, useState} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';

const AddChat = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add a new Chat',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [input, setinput] = useState('');
  const createChat = async () => {
    await firestore()
      .collection('chats')
      .add({
        chatName: input,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch(error => console.warn(error));
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c6bed" />
      <Text>This is a chat screenn</Text>
      <Input
        placeholder="Enter a name"
        value={input}
        onChangeText={value => setinput(value)}
        leftIcon={<AntDesign name="wechat" size={24} color="black" />}
        onSubmitEditing={createChat}
      />
      <Button disabled={!input} title="Create Chat" onPress={createChat} />
    </View>
  );
};

export default AddChat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 30,
    height: '100%',
  },
});
