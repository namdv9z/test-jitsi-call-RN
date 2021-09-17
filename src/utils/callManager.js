import { config } from './config';
import JitsiMeetJS, {
  JitsiConferenceEvents,
  JitsiConnectionEvents,
} from './lib-jitsi-meet';

const MEET_URL = config.jitsiUrl;

const options = {
  hosts: {
    domain: `${MEET_URL}`,
    muc: `conference.${MEET_URL}`,
  },
  //   useStunTurn: true,
  bosh: `https://${MEET_URL}/http-bind`,
};
class CallManager {
  constructor() {
    this.connection = undefined;
    this.room = undefined;

    this.audioTracks = [];
    this.callback = {
      setAudioTracks: undefined,
    };
    JitsiMeetJS.init({
      //   disableAudioLevels: false,
      disableSimulcast: false,
    });
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
  }

  connect(roomId, username, callback) {
    return new Promise(async (resolve, reject) => {
      console.log('connecting...');
      this.connection = new JitsiMeetJS.JitsiConnection(null, null, options);

      this.callback = callback;
      this.connection.addEventListener(
        JitsiConnectionEvents.CONNECTION_ESTABLISHED,
        () => {
          console.log('connection established!');

          if (this.room) {
            return;
          }

          this.room = this.connection.initJitsiConference(roomId, {
            openBridgeChannel: true,
          });
          console.log('join room!');
          this.room.join();

          this.room.on(
            JitsiMeetJS.events.conference.CONFERENCE_JOINED,
            async () => {
              console.log('CONFERENCE_JOINED');
              this.room.setDisplayName(username);

              resolve();
            },
          );

          this.room.on(JitsiConferenceEvents.CONNECTION_INTERRUPTED, () =>
            console.log('CONNECTION_INTERRUPTED'),
          );
          this.room.on(JitsiConferenceEvents.CONNECTION_RESTORED, () =>
            console.log('CONNECTION_RESTORED'),
          );
          this.room.on(JitsiConferenceEvents.TRACK_ADDED, track => {
            console.log('TRACK_ADDED');
            const participantId = track.getParticipantId();
            const participant = this.room.getParticipantById(participantId);
            let name;
            if (participant) {
              name = participant.getDisplayName();
            } else {
              return; // is local track
            }
            if (!track.stream) {
              return;
            }

            if (track.type === 'audio') {
              this.audioTracks.push(track);
              track.name = name;
            }

            if (this.callback.setAudioTracks) {
              this.callback.setAudioTracks(this.audioTracks);
            }
          });
          this.room.on(JitsiConferenceEvents.TRACK_REMOVED, track => {
            console.log('TRACK_REMOVED');
          });
        },
      );

      this.connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_FAILED,
        () => {
          console.log('JitsiConnection', 'CONNECTION_FAILED');
          reject();
        },
      );

      this.connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
        () => {
          console.log('JitsiConnection', 'CONNECTION_DISCONNECTED');
        },
      );
      this.connection.connect();
    });
  }

  async createLocalTracks() {
    const sourceInfos = await navigator.mediaDevices.enumerateDevices();
    console.log('mediaDevices.enumerateDevices', sourceInfos);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    console.log('mediaDevices.getUserMedia', stream);

    try {
      const localTracks = await JitsiMeetJS.createLocalTracks({
        devices: ['audio'],
        // micDeviceId: 'audio-1',
        // micDeviceId: 'com.apple.avfoundation.avcapturedevice.built-in_audio:0',
      });
      // console.log('local tracks', localTracks);

      for (const localTrack of localTracks) {
        if (localTrack.getType() === 'audio') {
          this.room.addTrack(localTrack);
        }
      }
    } catch (error) {
      console.log('createLocalTracks', error);
    }
  }

  getAudioTracks() {
    // console.log('tracks', this.audioTracks);
    return this.audioTracks;
  }

  async leave() {
    await this.room.leave();
    await this.connection.disconnect();

    this.connection = undefined;
    this.room = undefined;
    this.audioTracks = [];
    this.callback = {
      setAudioTracks: undefined,
    };
  }
}

export default new CallManager();
