import './i18n';

import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import App from './App';

const container = document.getElementById('root')!;
const tree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, tree, {
    onRecoverableError: () => {},
  });
} else {
  createRoot(container).render(tree);
}
