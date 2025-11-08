import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapController = ({ selectedSchool, schools }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (selectedSchool) {
      const school = schools.find(s => s.id === selectedSchool);
      if (school) {
        const lat = school.lat || school.latitude || 39.8283;
        const lng = school.lng || school.longitude || -98.5795;
        map.flyTo([lat, lng], 8, { duration: 1.5 });
      }
    }
  }, [selectedSchool, schools, map]);
  
  return null;
};

const Map = ({ schools, onSchoolClick, selectedSchool }) => {
  return (
    <MapContainer 
      center={[39.8283, -98.5795]} 
      zoom={4} 
      zoomControl={false}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    >
      <MapController selectedSchool={selectedSchool} schools={schools} />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      {schools.map((school) => {
        const lat = school.lat || school.latitude || 39.8283;
        const lng = school.lng || school.longitude || -98.5795;
        
        return (
          <Marker 
            key={school.id}
            position={[lat, lng]}
            icon={selectedSchool === school.id ? redIcon : blueIcon}
            eventHandlers={{
              click: () => onSchoolClick(school.id)
            }}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{school.name}</h3>
                <p>{school.location}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;