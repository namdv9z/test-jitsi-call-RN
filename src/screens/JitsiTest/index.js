import { useNavigation } from '@react-navigation/core';
import { Button, Input } from 'native-base';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CallManager from '../../utils/callManager';
// import JitsiRTC from '../../utils/lib-jitsi-meet/JitsiRTC';

const styles = StyleSheet.create({
  convosWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtInput: {
    marginTop: 20,
    width: '50%',
  },
  btnAction: { marginTop: 10 },
});
const JitsiTestScreens = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState();
  const [roomId, setRoomId] = useState('test');

  const joinHandler = useCallback(async () => {
    navigation.navigate('Call', { username, roomId });
  }, [navigation, username, roomId]);

  return (
    <View style={styles.convosWrapper}>
      <Input
        placeholder="username"
        variant="underlined"
        style={styles.txtInput}
        value={username}
        onChangeText={setUsername}
      />
      <Input
        placeholder="Room name"
        variant="underlined"
        style={styles.txtInput}
        value={roomId}
        onChangeText={setRoomId}
      />
      <Button
        style={styles.btnAction}
        // size="sm"
        // margin={5}
        onPress={() => joinHandler(roomId)}>
        Join
      </Button>

      {/* <TextInput
        placeholder="username"
        variant="underlined"
        style={styles.txtInput}
        value={targetUsername}
        onChangeText={setTargetUsername}
      />
      <Button style={styles.btnAction} size="sm" onPress={callHandler}>
        Call
      </Button> */}
    </View>
  );
};

export default JitsiTestScreens;
