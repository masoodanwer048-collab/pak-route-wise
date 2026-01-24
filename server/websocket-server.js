const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.WS_PORT || 8080;

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients by courier ID
const clients = new Map();

// Store courier locations
const courierLocations = new Map();

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection established');
  
  let currentCourierId = null;

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Received message:', message);

      switch (message.type) {
        case 'register':
          // Register courier
          currentCourierId = message.courierId;
          clients.set(currentCourierId, ws);
          
          // Send acknowledgment
          ws.send(JSON.stringify({
            type: 'registered',
            courierId: currentCourierId,
            timestamp: Date.now()
          }));
          
          console.log(`Courier ${currentCourierId} registered`);
          break;

        case 'location_update':
          // Update courier location
          if (!currentCourierId) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Courier not registered'
            }));
            return;
          }

          const locationData = {
            courierId: currentCourierId,
            lat: message.lat,
            lng: message.lng,
            speed: message.speed || 0,
            ts: message.ts || Date.now()
          };

          // Store location
          courierLocations.set(currentCourierId, locationData);

          // Broadcast to all connected clients
          broadcastToAll({
            type: 'courier_location',
            ...locationData
          });

          console.log(`Location update from ${currentCourierId}:`, locationData);
          break;

        case 'get_couriers':
          // Send list of active couriers
          const activeCouriers = Array.from(courierLocations.entries()).map(([id, location]) => ({
            courierId: id,
            ...location
          }));

          ws.send(JSON.stringify({
            type: 'couriers_list',
            couriers: activeCouriers
          }));
          break;

        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type'
          }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });

  // Handle connection close
  ws.on('close', () => {
    if (currentCourierId) {
      clients.delete(currentCourierId);
      courierLocations.delete(currentCourierId);
      console.log(`Courier ${currentCourierId} disconnected`);
      
      // Notify other clients
      broadcastToAll({
        type: 'courier_offline',
        courierId: currentCourierId
      });
    }
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to courier tracking server',
    timestamp: Date.now()
  }));
});

// Broadcast message to all connected clients
function broadcastToAll(message) {
  const messageStr = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`WebSocket URL: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { server, wss };