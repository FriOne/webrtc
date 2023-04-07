import { useEffect, useState } from 'react';

const config: RTCConfiguration = {
  iceServers: [{
    urls: [
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302',
      'stun:stun3.l.google.com:19302',
      'stun:stun4.l.google.com:19302',
    ],
  }],
  iceCandidatePoolSize: 10,
};

export function usePeerConnection() {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();

  useEffect(() => {
    setPeerConnection(new RTCPeerConnection(config));
  }, []);

  return peerConnection;
}
