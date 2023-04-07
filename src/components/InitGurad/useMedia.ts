import { useEffect, useState } from 'react';

export function useMedia() {
  const [mediaStatus, setMediaStatus] = useState<'init' | 'error' | 'success'>('init');

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaStatus('success');
      } catch (e) {
        console.error('Something happened with stream', e);
        setMediaStatus('error');
      }
    };

    checkPermissions();
  }, []);

  return mediaStatus;
}
