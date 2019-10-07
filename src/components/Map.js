import React, { Component } from 'react'; 
import { Map as LeafletMap, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';

import LocateControl from './LocateControl'; 
import RoutingControl from './RoutingControl'; 
 
const locateOptions = {
  position: 'topright',
  strings: {
      title: ''
  },
  onActivate: () => {} 
}

class Map extends Component {
  render() {
    return (
      <LeafletMap
        zoom={15}
        maxZoom={15}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
      >
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <LocateControl options={locateOptions} startDirectly/>
        <RoutingControl from={[57.74, 11.94]} to={[57.6792, 11.949]} />
      </LeafletMap>
    );
  }
}

export default Map; 