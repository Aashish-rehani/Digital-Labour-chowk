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

export default function MapPicker({ latitude, longitude, onChange }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const defaultCenter = [28.6139, 77.2090];
    const initialPos = (latitude && longitude) ? [latitude, longitude] : defaultCenter;

    const map = L.map(containerRef.current).setView(initialPos, 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    if (latitude && longitude) {
      markerRef.current = L.marker([latitude, longitude]).addTo(map);
    }

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }
      onChange(lat, lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // Run once on mount

  useEffect(() => {
    if (mapRef.current && latitude && longitude) {
      const pos = [latitude, longitude];
      if (!markerRef.current) {
         markerRef.current = L.marker(pos).addTo(mapRef.current);
      } else {
         markerRef.current.setLatLng(pos);
      }
      mapRef.current.flyTo(pos, 14);
    }
  }, [latitude, longitude]);

  return (
    <div style={{ height: '300px', width: '100%', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative', zIndex: 0 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
