import { FirebaseApp, initializeApp } from '@firebase/app';
import { Firestore, initializeFirestore } from '@firebase/firestore';
import { useEffect, useState } from 'react';

const firebaseConfig = {
  apiKey: 'AIzaSyB3r4_HC1YWNbHSfH02tSScE6b_g369Uyw',
  authDomain: 'webrtc-b334a.firebaseapp.com',
  databaseURL: 'https://webrtc-b334a-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'webrtc-b334a',
  storageBucket: 'webrtc-b334a.appspot.com',
  messagingSenderId: '438546390479',
  appId: '1:438546390479:web:06ab3e7bd6c3501b92c6ba'
};

const fireStoreConfig = {};

export function useFirebase() {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp>();
  const [fireStore, setFireStore] = useState<Firestore>();

  useEffect(() => {
    const fbApp = initializeApp(firebaseConfig);

    setFirebaseApp(fbApp);
    setFireStore(initializeFirestore(fbApp, fireStoreConfig));
  }, []);

  return { firebaseApp, fireStore };
}