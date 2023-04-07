import { useEffect, useRef, useState } from 'react';
import { addDoc, getDoc, updateDoc, doc, collection, onSnapshot } from '@firebase/firestore';

import { useConfigContext } from '../../contexts/useConfigContext';

export function useStreams() {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const remoteStream = useRef(new MediaStream());
  const { peerConnection, fireStore } = useConfigContext();

  useEffect(() => {
    const createLocalStream = async () => {
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        })

        peerConnection.ontrack = (event) => {
          event.streams[0]?.getTracks().forEach((track) => {
            remoteStream.current.addTrack(track);
          });
        };
      } catch (e) {
        console.error('Something happened with stream', e);
      }
    };

    createLocalStream();
  }, []);

  const generateCallId = async () => {
    const offerDescription = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    const callDoc = await addDoc(collection(fireStore, 'calls'), { offer });

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(collection(fireStore, 'offerCandidates'), event.candidate.toJSON());
      }
    };

    onSnapshot(collection(fireStore, 'answerCandidates'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
        }
      });
    });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        peerConnection.setRemoteDescription(answerDescription);
      }
    });

    return callDoc.id;
  };

  const connectToCall = async (callId: string) => {
    const callDoc = await getDoc(doc(fireStore, 'calls', callId));

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(collection(fireStore, 'answerCandidates'), event.candidate.toJSON());
      }
    };

    const offerDescription = callDoc.get('offer');
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };
    await updateDoc(doc(fireStore, 'calls', callId), { answer });

    onSnapshot(collection(fireStore, 'offerCandidates'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
        }
      });
    });
  };

  return { localStream, remoteStream: remoteStream.current, generateCallId, connectToCall };
}
