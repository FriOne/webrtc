import { ChangeEvent, FC, useState } from 'react';
import { Button, FormControl, InputGroup, Spinner } from 'react-bootstrap';

import { StreamView } from '../StreamView/StreamView';
import { useStreams } from './useStreams';

import styles from './App.module.css';

export const App: FC = () => {
  const [callId, setCallId] = useState<string>();
  const [myCallId, setMyCallId] = useState<string>();
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'connecting' | 'error' | 'success'>('none');
  const { localStream, remoteStream, generateCallId, connectToCall } = useStreams();

  const handleGenerateIdClick = async () => {
    try {
      setMyCallId('*');
      const newCallId = await generateCallId();
      setMyCallId(newCallId);
    } catch (e) {
      console.log('Error while generating call id', e);
      setMyCallId(undefined);
    }
  };

  const handleConnectClick = async () => {
    try {
      setConnectionStatus('connecting');
      await connectToCall(callId);
      setConnectionStatus('success');
    } catch (e) {
      console.error('Error while connecting');
      setConnectionStatus('error');
    }
  };

  const handleCallIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCallId(event.currentTarget.value);
  };

  return (
    <div className={styles.root}>
      <div className={styles.videos}>
        <StreamView muted stream={localStream} />
        <StreamView stream={remoteStream} />
      </div>
      <div>
        <h2>Create a new call</h2>
        {myCallId ? (
          <div className={styles.callId}>My Call ID is {myCallId}</div>
        ) : (
          <Button onClick={handleGenerateIdClick}>
            Generate ID
          </Button>
        )}
      </div>
      <div>
        <h2>Join a call</h2>
        {connectionStatus === 'connecting' && <Spinner />}
        {connectionStatus === 'success' && <div>Connected</div>}
        {['none', 'error'].includes(connectionStatus) && (
          <InputGroup>
            <FormControl placeholder="Put Call ID here" onChange={handleCallIdChange} />
            <Button disabled={!callId} onClick={handleConnectClick}>
              Connect
            </Button>
          </InputGroup>
        )}
      </div>
    </div>
  );
};
