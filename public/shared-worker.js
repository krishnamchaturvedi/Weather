/* eslint-disable no-restricted-globals */
// shared-worker.js

// This function handles incoming messages from the main script or other clients
function handleMessage(event) {
    const message = event.data;
  
    // Do some processing with the received message
    const result = `Processed: ${message}`;
  
    // Send the result back to the main script or other clients
    postMessage(result);
  }
  
  // Attach the message handling function to the 'message' event
  self.addEventListener('message', handleMessage);
  
  // Optional: Handle the 'connect' event if you want to perform some tasks when the worker is first created.
  self.addEventListener('connect', (event) => {
    console.log('Shared Worker connected!');
  });
  