import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import courierTrackingWS from "@/utils/websocket-client";

// Fix default marker icons (bundler issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// TypeScript interfaces
interface Order {
  orderId: string;
  courierId: string;
  courierName: string;
  pickup: [number, number];
  dropoff: [number, number];
  status: string;
}

interface CourierLocation {
  lat: number;
  lng: number;
  speed: number;
  lastSeen: number;
}

interface WebSocketMessage {
  courierId: string;
  lat: number;
  lng: number;
  speed?: number;
  ts?: number;
}

function FitBounds({ points }: { points: number[][] }) {
  const map = useMap();
  useEffect(() => {
    const valid = (points || []).filter(Boolean).filter(p => Array.isArray(p) && p.length === 2);
    if (valid.length < 2) return;
    map.fitBounds(valid, { padding: [40, 40] });
  }, [points, map]);
  return null;
}

export default function CourierLiveTrackingModule() {
  // Example list (replace with API)
  const [orders, setOrders] = useState<Order[]>([
    {
      orderId: "ORD-1001",
      courierId: "C-1",
      courierName: "Ali",
      pickup: [24.8607, 67.0011],
      dropoff: [24.8722, 67.0450],
      status: "Out for delivery",
    },
    {
      orderId: "ORD-1002",
      courierId: "C-2",
      courierName: "Usman",
      pickup: [24.8440, 67.0200],
      dropoff: [24.8350, 67.0700],
      status: "Picked up",
    },
  ]);

  const [selectedOrderId, setSelectedOrderId] = useState("ORD-1001");

  // Live locations keyed by courierId
  const [courierLocations, setCourierLocations] = useState<Record<string, CourierLocation>>({
    "C-1": { lat: 24.8607, lng: 67.0011, speed: 0, lastSeen: Date.now() },
    "C-2": { lat: 24.8440, lng: 67.0200, speed: 0, lastSeen: Date.now() },
  });

  // Trail only for selected courier (avoid heavy memory)
  const [trail, setTrail] = useState<number[][]>([]);
  const MAX_TRAIL = 200;

  const selectedOrder = useMemo(
    () => orders.find(o => o.orderId === selectedOrderId),
    [orders, selectedOrderId]
  );

  const selectedCourierId = selectedOrder?.courierId;

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    courierTrackingWS.connect().then(() => {
      console.log('Connected to courier tracking WebSocket server');
    }).catch(error => {
      console.error('Failed to connect to WebSocket server:', error);
    });

    // Handle incoming location updates
    const handleLocationUpdate = (message: any) => {
      if (message.type === 'courier_location') {
        const msg = message as WebSocketMessage;
        if (!msg?.courierId || typeof msg.lat !== "number" || typeof msg.lng !== "number") return;

        setCourierLocations(prev => ({
          ...prev,
          [msg.courierId]: {
            lat: msg.lat,
            lng: msg.lng,
            speed: msg.speed ?? prev[msg.courierId]?.speed ?? 0,
            lastSeen: Date.now(),
          },
        }));

        // Update trail if this is selected courier
        if (msg.courierId === selectedCourierId) {
          const point: [number, number] = [msg.lat, msg.lng];
          setTrail(prev => {
            const updated = [...prev, point];
            return updated.length > MAX_TRAIL ? updated.slice(updated.length - MAX_TRAIL) : updated;
          });
        }
      }
    };

    // Register message handler
    courierTrackingWS.on('courier_location', handleLocationUpdate);

    return () => {
      courierTrackingWS.off('courier_location', handleLocationUpdate);
    };
  }, [selectedCourierId]);

  // When selecting a different order, reset trail
  useEffect(() => {
    setTrail([]);
  }, [selectedOrderId]);

  const selectedCourierPos = selectedCourierId
    ? [courierLocations[selectedCourierId]?.lat, courierLocations[selectedCourierId]?.lng]
    : null;

  const boundsPoints = useMemo(() => {
    if (!selectedOrder) return [];
    const pts: number[][] = [selectedOrder.pickup, selectedOrder.dropoff];
    if (selectedCourierPos?.[0] && selectedCourierPos?.[1]) pts.push(selectedCourierPos as [number, number]);
    return pts;
  }, [selectedOrder, selectedCourierPos]);

  const mapCenter = selectedCourierPos?.[0] ? selectedCourierPos : selectedOrder?.pickup || [24.8607, 67.0011];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", height: "100vh" }}>
      {/* LEFT PANEL */}
      <div style={{ borderRight: "1px solid #eee", padding: 12, overflow: "auto" }}>
        <h3 style={{ margin: "0 0 10px" }}>Courier Tracking</h3>

        {orders.map(o => (
          <div
            key={o.orderId}
            onClick={() => setSelectedOrderId(o.orderId)}
            style={{
              padding: 10,
              marginBottom: 10,
              border: "1px solid #ddd",
              borderRadius: 10,
              cursor: "pointer",
              background: o.orderId === selectedOrderId ? "#f7f7f7" : "white",
            }}
          >
            <div><b>Order:</b> {o.orderId}</div>
            <div><b>Courier:</b> {o.courierName} ({o.courierId})</div>
            <div><b>Status:</b> {o.status}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Last seen: {courierLocations[o.courierId]?.lastSeen ? new Date(courierLocations[o.courierId].lastSeen).toLocaleTimeString() : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* MAP */}
      <div style={{ height: "100%", width: "100%" }}>
        <MapContainer center={mapCenter as [number, number]} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds points={boundsPoints} />

          {/* Pickup / Dropoff */}
          {selectedOrder?.pickup && (
            <Marker position={selectedOrder.pickup}>
              <Popup><b>Pickup</b><br />Order: {selectedOrder.orderId}</Popup>
            </Marker>
          )}
          {selectedOrder?.dropoff && (
            <Marker position={selectedOrder.dropoff}>
              <Popup><b>Dropoff</b><br />Order: {selectedOrder.orderId}</Popup>
            </Marker>
          )}

          {/* Courier marker */}
          {selectedCourierPos?.[0] && (
            <Marker position={selectedCourierPos as [number, number]}>
              <Popup>
                <b>Courier</b><br />
                {selectedOrder?.courierName} ({selectedOrder?.courierId})<br />
                Speed: {courierLocations[selectedCourierId!]?.speed || 0} km/h
              </Popup>
            </Marker>
          )}

          {/* Trail */}
          {trail.length > 1 && (
            <Polyline positions={trail} color="#0066ff" weight={3} opacity={0.8} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}