import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

const CustomList = ({id, chatName, enterChat}) => {
  const [chatMessage, setchatMessaage] = useState([]);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot =>
        setchatMessaage(snapshot.docs.map(doc => doc.data())),
      );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessage]);
  return (
    <ListItem key={id} onPress={() => enterChat(id, chatName)} bottomDivider>
      <Avatar
        rounded
        source={{
          uri:
            chatMessage?.[0]?.photoURL ||
            'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.title}>{chatName}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessage?.[0]?.displayName}:{chatMessage?.[0]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomList;

const styles = StyleSheet.create({
  title: {
    fontWeight: '800',
  },
});
