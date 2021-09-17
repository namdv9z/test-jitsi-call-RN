import { useNavigation, useRoute } from '@react-navigation/core';
import { Button, Text } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CallManager from '../../utils/callManager';

const styles = StyleSheet.create({
  convosWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAction: { marginTop: 10 },
});
const CallScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [audioTracks, setAudioTracks] = useState([]);
  const roomId = route.params.roomId;
  const username = route.params.username;

  useEffect(() => {
    initCall();
    return () => {};
  }, [initCall]);

  const initCall = useCallback(async () => {
    if (!username || !roomId) {
      return;
    }
    const callback = { setAudioTracks };

    await CallManager.connect(roomId, username, callback);
    await CallManager.createLocalTracks();

    // setTimeout(() => {
    //   setAudioTracks(CallManager.getAudioTracks());
    // }, 3000);
  }, [roomId, username]);

  const hangupHandler = useCallback(async () => {
    await CallManager.leave();
    backHandler();
  }, [backHandler]);

  const backHandler = useCallback(() => {
    navigation.navigate('JitsiTest');
  }, [navigation]);

  if (!username || !roomId) {
    return (
      <View style={styles.convosWrapper}>
        <Text>Missing username or roomId</Text>
        <Button onPress={backHandler}>Back</Button>
      </View>
    );
  }

  return (
    <View style={styles.convosWrapper}>
      <Text>room: {roomId}</Text>
      <Text>@{username}</Text>
      <Text>Calling</Text>
      {audioTracks.length > 0 &&
        audioTracks.map(stream => (
          <Text key={stream.track.id}>{stream.name}</Text>
        ))}
      <Button style={styles.btnAction} onPress={hangupHandler}>
        Hangup
      </Button>
    </View>
  );
};

export default CallScreen;
