import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomList from '../component/custom_list';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const HomeScreen = ({navigation}) => {
  const [chats, setChats] = useState([]);
  const signout = () => {
    // console.log(auth().currentUser);
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        navigation.replace('Login');
      });
  };
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .onSnapshot(snapshot => {
        setChats(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          })),
        );
      });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Signal',
      headerStyle: {backgroundColor: '#fff'},
      headerTitleStyle: {color: 'black'},
      headerTintColor: 'black',
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={signout} activeOpacity={0.5}>
            <Avatar
              rounded
              source={{
                uri: auth()?.currentUser?.photoURL,
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => {
        return (
          <View style={styles.headerRight}>
            <TouchableOpacity activeOpacity={0.5}>
              <AntDesign name="camerao" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddChat')}
              activeOpacity={0.5}>
              <SimpleLineIcons name="pencil" size={24} color="black" />
            </TouchableOpacity>
          </View>
        );
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enterChat = (id, chatName) => {
    navigation.navigate('ChatScreen', {
      id,
      chatName,
    });
  };
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView style={styles.container}>
        {chats.map(({id, data}) => (
          <CustomList
            key={id}
            id={id}
            chatName={data.chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  headerLeft: {
    marginHorizontal: 12,
  },
  headerRight: {
    flexDirection: 'row',
    width: 60,
    marginHorizontal: 1,
    justifyContent: 'space-between',
  },
  container: {
    height: '100%',
  },
});
