# Courier Live Tracking Integration Guide

This guide covers the integration of the courier live tracking component with WebSocket support for real-time location updates.

## WebSocket Message Format

The tracking component expects WebSocket messages in the following JSON format:

```json
{
  "courierId": "C-1",
  "lat": 24.861234,
  "lng": 67.003210,
  "speed": 12,
  "ts": 1700000000
}
```

### Message Fields
- `courierId` (string, required): Unique identifier for the courier
- `lat` (number, required): Latitude coordinate (-90 to 90)
- `lng` (number, required): Longitude coordinate (-180 to 180)
- `speed` (number, optional): Speed in km/h
- `ts` (number, optional): Unix timestamp in milliseconds

## Integration Steps

### 1. Set Up WebSocket Server

Create a WebSocket server that sends location updates in the specified format:

#### Node.js Example
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send location updates every 5 seconds
  const interval = setInterval(() => {
    const message = {
      courierId: "C-1",
      lat: 24.861234 + (Math.random() - 0.5) * 0.001,
      lng: 67.003210 + (Math.random() - 0.5) * 0.001,
      speed: Math.floor(Math.random() * 20) + 5,
      ts: Date.now()
    };
    ws.send(JSON.stringify(message));
  }, 5000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});
```

#### Python Example
```python
import asyncio
import json
import random
import websockets

async def send_locations(websocket, path):
    print("Client connected")
    try:
        while True:
            message = {
                "courierId": "C-1",
                "lat": 24.861234 + (random.random() - 0.5) * 0.001,
                "lng": 67.003210 + (random.random() - 0.5) * 0.001,
                "speed": random.randint(5, 25),
                "ts": int(time.time() * 1000)
            }
            await websocket.send(json.dumps(message))
            await asyncio.sleep(5)
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

start_server = websockets.serve(send_locations, "localhost", 8080)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
```

### 2. Update WebSocket URL

Replace the placeholder WebSocket URL in the tracking components:

In `CourierLiveTracking.tsx` and `CourierLiveTrackingExample.tsx`:
```typescript
// Replace this line:
wsRef.current = new WebSocket('wss://YOUR_DOMAIN/ws/courier-tracking');

// With your actual WebSocket server URL:
wsRef.current = new WebSocket('wss://your-domain.com/ws/courier-tracking');
// or for local development:
wsRef.current = new WebSocket('ws://localhost:8080');
```

### 3. Environment Variables

Add WebSocket configuration to your environment variables:

```bash
# .env file
VITE_WEBSOCKET_URL=wss://your-domain.com/ws/courier-tracking
VITE_WEBSOCKET_RECONNECT_INTERVAL=5000
```

### 4. API Integration

Connect the tracking component to your order management API:

```typescript
// In CourierLiveTrackingExample.tsx, replace mock data with API calls
const fetchOrders = async () => {
  try {
    const response = await fetch('/api/orders?status=assigned');
    const data = await response.json();
    setOrders(data.orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};
```

### 5. Security Considerations

- Use WSS (WebSocket Secure) in production
- Implement authentication for WebSocket connections
- Validate incoming message formats
- Rate limit location updates
- Sanitize coordinates to prevent injection attacks

## Testing

### Manual Testing
1. Start your WebSocket server
2. Open the tracking component in browser
3. Verify courier markers appear on the map
4. Check that location updates are received and displayed
5. Test trail rendering and auto-zoom functionality

### Sample Message Testing
Use the built-in test button in `CourierLiveTrackingExample.tsx` to simulate the exact message format:

```typescript
const simulateSampleMessage = () => {
  const sampleMessage = {
    courierId: "C-1",
    lat: 24.861234,
    lng: 67.003210,
    speed: 12,
    ts: 1700000000
  };
  // This will trigger the same handling as real WebSocket messages
};
```

## Troubleshooting

### Map Not Displaying
- Verify Leaflet CSS is imported: `import "leaflet/dist/leaflet.css";`
- Check that map container has proper height/width
- Ensure map tiles are loading (check network tab)

### Markers Not Appearing
- Verify WebSocket connection is established
- Check browser console for JavaScript errors
- Validate incoming message format matches expected structure
- Ensure courierId matches existing orders

### WebSocket Connection Issues
- Check WebSocket server is running and accessible
- Verify URL format (ws:// for local, wss:// for production)
- Check firewall/proxy settings
- Monitor browser network tab for connection attempts

### Performance Issues
- Trail is limited to 200 points per courier for memory efficiency
- Consider reducing update frequency for high-traffic scenarios
- Implement client-side filtering for large courier fleets

## Deployment

1. Deploy your WebSocket server to a scalable infrastructure
2. Update WebSocket URLs in tracking components
3. Configure load balancing for high availability
4. Set up monitoring and logging
5. Test in staging environment before production

## Next Steps

- Implement courier assignment logic
- Add delivery status tracking
- Integrate with notification system
- Add historical route playback
- Implement geofencing alerts