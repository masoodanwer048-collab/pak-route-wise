// Test client for WebSocket server
const WebSocket = require('ws');

const WS_URL = process.env.WS_URL || 'ws://localhost:8080';

console.log('Connecting to WebSocket server at:', WS_URL);

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('Connected to server');
  
  // Register as a courier
  ws.send(JSON.stringify({
    type: 'register',
    courierId: 'C-1'
  }));
  
  // Send sample location update after a short delay
  setTimeout(() => {
    const sampleMessage = {
      type: 'location_update',
      courierId: 'C-1',
      lat: 24.861234,
      lng: 67.003210,
      speed: 12,
      ts: 1700000000
    };
    
    console.log('Sending sample message:', sampleMessage);
    ws.send(JSON.stringify(sampleMessage));
  }, 1000);
  
  // Request couriers list after another delay
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'get_couriers'
    }));
  }, 2000);
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    console.log('Received message:', message);
  } catch (error) {
    console.error('Error parsing message:', error);
  }
});

ws.on('close', () => {
  console.log('Disconnected from server');
  process.exit(0);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nClosing connection...');
  ws.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nClosing connection...');
  ws.close();
  process.exit(0);
});