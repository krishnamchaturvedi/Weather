import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Check if the browser supports service workers and register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}
if ('SharedWorker' in window) {
  // Register the shared worker
  navigator.serviceWorker.register('shared-worker.js')
    .then((registration) => {
      console.log('Shared Worker registered!', registration);

      // After registration, create a new SharedWorker instance
      const sharedWorker = new SharedWorker('shared-worker.js');

      // Function to handle incoming messages from the shared worker
      sharedWorker.port.onmessage = (event) => {
        const result = event.data;
        console.log('Received result from shared worker:', result);
      };

      // Function to send a message to the shared worker
      function sendMessageToWorker(message) {
        sharedWorker.port.postMessage(message);
      }

      // Call the function to send a message to the shared worker
      sendMessageToWorker('Hello, Shared Worker!');
    })
    .catch((error) => {
      console.error('Error registering Shared Worker:', error);
    });
} else {
  console.log('Shared Workers are not supported in this browser.');
}
