import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  pharmacies: any[];
  userLocation: [number, number];
}

const MapComponent: React.FC<MapComponentProps> = ({ pharmacies, userLocation }) => {
  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userLocation}>
          <Popup>Votre position</Popup>
        </Marker>
        {pharmacies.map((p) => (
          <Marker key={p.id} position={[p.latitude, p.longitude]}>
            <Popup>
              <div style={{ padding: '0.5rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{p.nom}</strong>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.distance.toFixed(1)} km</span>
                <div style={{ marginTop: '0.5rem' }}>
                   <p style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Médicaments : {p.score}/{p.totalMeds}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
