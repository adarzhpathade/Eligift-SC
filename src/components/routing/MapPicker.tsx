'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelected: (lat: number, lng: number) => void;
}

function LocationMarker({ position, setPosition, onLocationSelected }: any) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelected(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function MapPicker({ initialLat = 23.2599, initialLng = 77.4126, onLocationSelected }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLat && initialLng ? new L.LatLng(initialLat, initialLng) : null
  );

  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden border border-border/10 shadow-inner z-0 relative">
      <MapContainer 
        center={[initialLat, initialLng]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelected={onLocationSelected} />
      </MapContainer>
      <div className="absolute bottom-4 left-0 w-full flex justify-center z-[400] pointer-events-none">
        <div className="bg-background/90 backdrop-blur-sm text-foreground text-[12px] font-semibold px-4 py-2 rounded-full shadow-lg border border-border/20 pointer-events-auto">
          Tap anywhere on the map to set your exact location
        </div>
      </div>
    </div>
  );
}
