import { useContext } from 'react';

import { ConfigContext } from './ConfigContext';

export function useConfigContext() {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error('Context should always be defined');
  }

  return context;
}
