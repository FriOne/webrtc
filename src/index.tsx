import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';

import { App } from './components/App/App';
import { InitGuard } from './components/InitGurad/InitGuard';

const rootEl = document.getElementById('root');

if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <InitGuard>
      <App />
    </InitGuard>
  );
} else {
  console.error('No root element');
}
