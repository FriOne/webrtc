import { FC, PropsWithChildren } from 'react';
import { Spinner, Alert } from 'react-bootstrap';

import { ConfigContext } from '../../contexts/ConfigContext';
import { useFirebase } from './useFirebase';
import { usePeerConnection } from './usePeerConnection';
import { useMedia } from './useMedia';

import styles from './InitGuard.module.css';

export const InitGuard: FC<PropsWithChildren> = ({ children }) => {
  const { firebaseApp, fireStore} = useFirebase();
  const peerConnection = usePeerConnection();
  const mediaStatus = useMedia();

  if (!firebaseApp || !fireStore || !peerConnection || mediaStatus === 'init') {
    return (
      <div className={styles.root}><Spinner /></div>
    );
  }

  if (mediaStatus === 'error') {
    return (
      <div className={styles.root}>
        <Alert variant="warning" className={styles.alert}>
          You need to have permissions to camera and audio.
          <br />
          Enable it by clicking on camera icon at your browser search bar and then refresh the page.
        </Alert>
      </div>
    );
  }

  return (
    <ConfigContext.Provider value={{ firebaseApp, fireStore, peerConnection }}>
      {children}
    </ConfigContext.Provider>
  );
};
