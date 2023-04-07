import { FirebaseApp } from '@firebase/app';
import { Firestore } from '@firebase/firestore';
import { createContext } from 'react';

type ConfigContextValue = {
  firebaseApp: FirebaseApp;
  fireStore: Firestore;
  peerConnection: RTCPeerConnection;
};

export const ConfigContext = createContext<ConfigContextValue | null>(null);

