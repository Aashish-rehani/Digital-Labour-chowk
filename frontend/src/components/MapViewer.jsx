import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapViewer({ latitude, longitude }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude) return;
    if (!containerRef.current || mapRef.current) return;

    const position = [latitude, longitude];
    const map = L.map(containerRef.current).setView(position, 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    L.marker(position).addTo(map);
    mapRef.current = map;

    // Fix map loading slightly offset in Modals/accordions
    setTimeout(() => { map.invalidateSize(); }, 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude]);

  if (!latitude || !longitude) return null;

  return (
    <div style={{ height: '200px', width: '100%', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative', zIndex: 0, marginTop: 'var(--spacing-4)' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
