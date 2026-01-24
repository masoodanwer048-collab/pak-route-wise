import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import courierTrackingWS from '@/utils/websocket-client';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// TypeScript interfaces
interface WebSocketMessage {
  courierId: string;
  lat: number;
  lng: number;
  speed?: number;
  ts?: number;
}

interface CourierLocation {
  courierId: string;
  name: string;
  lat: number;
  lng: number;
  speed?: number;
  lastUpdate: number;
  status: 'online' | 'offline' | 'busy';
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  deliveryAddress: string;
  status: 'assigned' | 'picked-up' | 'in-transit' | 'delivered';
  courierId?: string;
  priority: 'low' | 'medium' | 'high';
}

interface CourierTrail {
  courierId: string;
  positions: Array<[number, number]>;
  timestamps: number[];
}

// FitBounds component to auto-adjust map view
function FitBounds({ positions }: { positions: Array<[number, number]> }) {
  const map = useMap();
  
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  
  return null;
}

export default function CourierLiveTrackingExample() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [courierLocations, setCourierLocations] = useState<Record<string, CourierLocation>>({});
  const [courierTrails, setCourierTrails] = useState<Record<string, CourierTrail>>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock orders data - replace with API call
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        deliveryAddress: '123 Main St, Karachi',
        status: 'in-transit',
        courierId: 'C-1',
        priority: 'high'
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        deliveryAddress: '456 Clifton Rd, Karachi',
        status: 'assigned',
        courierId: 'C-2',
        priority: 'medium'
      },
      {
        id: '3',
        orderNumber: 'ORD-003',
        customerName: 'Bob Wilson',
        deliveryAddress: '789 DHA Phase 5, Karachi',
        status: 'picked-up',
        courierId: 'C-3',
        priority: 'low'
      }
    ];
    setOrders(mockOrders);
  }, []);

  // WebSocket connection management
  useEffect(() => {
    const connectWebSocket = () => {
      courierTrackingWS.connect().then(() => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      }).catch(error => {
        console.error('Failed to connect to WebSocket server:', error);
        setConnectionStatus('disconnected');
      });
    };

    connectWebSocket();

    // Handle incoming location updates
    const handleLocationUpdate = (message: any) => {
      if (message.type === 'courier_location') {
        const data = message as WebSocketMessage;
        handleLocationUpdateDirect(data);
      }
    };

    courierTrackingWS.on('courier_location', handleLocationUpdate);

    return () => {
      courierTrackingWS.off('courier_location', handleLocationUpdate);
      courierTrackingWS.disconnect();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Handle location updates from WebSocket
  const handleLocationUpdateDirect = (data: WebSocketMessage) => {
    const { courierId, lat, lng, speed, ts } = data;
    
    // Update courier location
    setCourierLocations(prev => ({
      ...prev,
      [courierId]: {
        courierId,
        name: `Courier ${courierId}`,
        lat,
        lng,
        speed,
        lastUpdate: ts || Date.now(),
        status: 'online'
      }
    }));

    // Update courier trail (limit to 200 points for performance)
    setCourierTrails(prev => {
      const existingTrail = prev[courierId] || { courierId, positions: [], timestamps: [] };
      const newPositions = [...existingTrail.positions, [lat, lng] as [number, number]];
      const newTimestamps = [...existingTrail.timestamps, ts || Date.now()];
      
      // Keep only last 200 positions
      if (newPositions.length > 200) {
        newPositions.shift();
        newTimestamps.shift();
      }
      
      return {
        ...prev,
        [courierId]: {
          courierId,
          positions: newPositions,
          timestamps: newTimestamps
        }
      };
    });
  };

  // Simulate sample message for testing
  const simulateSampleMessage = () => {
    const sampleMessage: WebSocketMessage = {
      courierId: "C-1",
      lat: 24.861234,
      lng: 67.003210,
      speed: 12,
      ts: 1700000000
    };
    
    // Send through WebSocket client
    courierTrackingWS.sendLocationUpdate("C-1", 24.861234, 67.003210, 12);
    
    // Also handle locally for immediate UI update
    handleLocationUpdateDirect(sampleMessage);
  };

  // Get all courier positions for map bounds
  const allPositions = useMemo(() => {
    return Object.values(courierLocations).map(loc => [loc.lat, loc.lng] as [number, number]);
  }, [courierLocations]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Courier Live Tracking</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-600">
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={simulateSampleMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
            >
              Simulate Sample Message
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Orders Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Orders ({orders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.map((order) => {
                    const courier = order.courierId ? courierLocations[order.courierId] : null;
                    return (
                      <div
                        key={order.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedOrder?.id === order.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">{order.orderNumber}</span>
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{order.customerName}</p>
                        <p className="text-xs text-gray-500 mb-2">{order.deliveryAddress}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{order.status}</Badge>
                          {courier && (
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(courier.status)}`} />
                              <span className="text-xs text-gray-500">{courier.name}</span>
                            </div>
                          )}
                        </div>
                        {courier && courier.speed && (
                          <div className="mt-2 text-xs text-gray-500">
                            Speed: {courier.speed} km/h
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Courier Status */}
            <Card>
              <CardHeader>
                <CardTitle>Courier Status ({Object.keys(courierLocations).length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.values(courierLocations).map((courier) => (
                    <div key={courier.courierId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(courier.status)}`} />
                        <span className="text-sm font-medium">{courier.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {courier.speed && `${courier.speed} km/h`}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Live Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full rounded-lg overflow-hidden">
                  <MapContainer
                    center={[24.8607, 67.0011]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* Fit bounds to show all couriers */}
                    {allPositions.length > 0 && <FitBounds positions={allPositions} />}
                    
                    {/* Render courier trails */}
                    {Object.values(courierTrails).map((trail) => (
                      trail.positions.length > 1 && (
                        <Polyline
                          key={`trail-${trail.courierId}`}
                          positions={trail.positions}
                          color="#3b82f6"
                          weight={3}
                          opacity={0.6}
                        />
                      )
                    ))}
                    
                    {/* Render courier markers */}
                    {Object.values(courierLocations).map((courier) => (
                      <Marker key={courier.courierId} position={[courier.lat, courier.lng]}>
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold">{courier.name}</h3>
                            <p className="text-sm text-gray-600">
                              Lat: {courier.lat.toFixed(6)}, Lng: {courier.lng.toFixed(6)}
                            </p>
                            {courier.speed && (
                              <p className="text-sm text-gray-600">Speed: {courier.speed} km/h</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Last update: {new Date(courier.lastUpdate).toLocaleTimeString()}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(courier.status)}`} />
                              <span className="text-xs">{courier.status}</span>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Selected Order Details */}
        {selectedOrder && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details: {selectedOrder.orderNumber}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                    <p className="text-sm text-gray-600">Name: {selectedOrder.customerName}</p>
                    <p className="text-sm text-gray-600">Address: {selectedOrder.deliveryAddress}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Order Status</h3>
                    <p className="text-sm text-gray-600">Status: {selectedOrder.status}</p>
                    <p className="text-sm text-gray-600">Priority: {selectedOrder.priority}</p>
                    {selectedOrder.courierId && courierLocations[selectedOrder.courierId] && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Courier: {courierLocations[selectedOrder.courierId].name}
                        </p>
                        {courierLocations[selectedOrder.courierId].speed && (
                          <p className="text-sm text-gray-600">
                            Current Speed: {courierLocations[selectedOrder.courierId].speed} km/h
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}