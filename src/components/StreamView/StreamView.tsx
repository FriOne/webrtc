import { FC, useEffect, useRef } from 'react';

import styles from './StreamView.module.css';

type Props = {
  stream: MediaStream;
  muted?: boolean;
};

export const StreamView: FC<Props> = ({ stream, muted }) => {
  const videoRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video id="webcam-video" muted={muted} className={styles.root} autoPlay playsInline ref={videoRef} />
  );
};
