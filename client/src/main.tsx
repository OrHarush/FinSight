import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
//
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/service-worker.js')
//       .then(registration => {
//         console.log('✅ Service Worker registered:', registration.scope);
//
//         registration.addEventListener('updatefound', () => {
//           const newWorker = registration.installing;
//           console.log('🔄 New Service Worker found, installing...');
//
//           newWorker?.addEventListener('statechange', () => {
//             if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
//               console.log('✨ New version available! Refresh to update.');
//             }
//           });
//         });
//       })
//       .catch(error => {
//         console.error('❌ Service Worker registration failed:', error);
//       });
//   });
// }
