import React, {useLayoutEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

const ChatScreen = ({navigation, route}) => {
  const [input, setinput] = useState('');
  const [messages, setmessages] = useState([]);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(route.params.id)
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot(snapshot =>
        setmessages(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          })),
        ),
      );
    return unsubscribe;
  }, [route, messages]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: ' Chat',
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
      headerTitle: () => (
        <View style={styles.header}>
          <Avatar
            rounded
            source={{
              uri:
                messages?.[messages.length - 1]?.data.photoURL ||
                'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
            }}
          />
          <Text style={styles.title}>{route.params.chatName}</Text>
        </View>
      ),
      headerLeft: () => {
        if (Platform.OS === 'ios') {
          return (
            <TouchableOpacity onPress={navigation.goBack} style={styles.back}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
          );
        }
        return null;
      },
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="phone" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, messages]);
  const sendMessage = async () => {
    Keyboard.dismiss();
    await firestore()
      .collection('chats')
      .doc(route.params.id)
      .collection('messages')
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        displayName: auth().currentUser.displayName,
        email: auth().currentUser.email,
        photoURL: auth().currentUser.photoURL,
      });
    setinput('');
  };

  return (
    <SafeAreaView style={styles.body}>
      <StatusBar barStyle="light-content" backgroundColor="#2c6bed" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({ios: 90, android: -500})}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView style={styles.contentconatainer}>
              {messages.map(({id, data}) =>
                data.email === auth().currentUser.email ? (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      size={24}
                      position="absolute"
                      rounded
                      bottom={-15}
                      right={-5}
                      source={{uri: data.photoURL}}
                    />
                    <Text style={styles.send}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.receiver}>
                    <Avatar
                      size={24}
                      position="absolute"
                      rounded
                      bottom={-15}
                      left={-5}
                      source={{uri: data.photoURL}}
                    />
                    <Text style={styles.received}>{data.message}</Text>
                    <Text style={styles.receiverName}>{data.displayName}</Text>
                  </View>
                ),
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                placeholder="Signal Message"
                style={styles.TextInput}
                value={input}
                onSubmitEditing={sendMessage}
                onChangeText={text => setinput(text)}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={24} color="#2B68E6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    color: 'white',
    marginLeft: 10,
    fontWeight: '700',
  },
  back: {
    margin: 10,
  },
  headerRight: {
    flexDirection: 'row',
    width: 70,
    justifyContent: 'space-between',
  },
  body: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentconatainer: {
    padding: 10,
    marginBottom: 10,
  },
  TextInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: 'transparent',
    backgroundColor: '#ececec',
    padding: 10,
    color: 'black',
    borderRadius: 30,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  sender: {
    padding: 15,
    flexDirection: 'row',
    backgroundColor: '#ececec',
    alignSelf: 'flex-end',
    marginRight: 15,
    marginVertical: 15,
    maxWidth: '80%',
    position: 'relative',
    borderRadius: 15,
  },
  receiver: {
    padding: 15,
    backgroundColor: '#2B68E6',
    alignSelf: 'flex-start',
    marginRight: 15,
    marginVertical: 15,
    maxWidth: '80%',
    position: 'relative',
    borderRadius: 15,
  },
  send: {
    color: 'black',
    fontWeight: '500',
    marginHorizontal: 10,
  },
  received: {
    color: 'white',
    fontWeight: '500',
    marginHorizontal: 10,
  },
  receiverName: {
    left: 10,
    paddingRight: 10,
    paddingTop: 10,
    fontSize: 10,
    color: 'white',
  },
});
