import React, { Component } from 'react'; 
import { Map as LeafletMap, TileLayer} from 'react-leaflet';

import LocateControl from './LocateControl'; 
import RoutingControl from './RoutingControl'; 
import Search from './Search/Search'
 
const locateOptions = {
  position: 'topright',
  strings: {
      title: ''
  }
}

class Map extends Component {
  render() {
    const { from, to, onLocationFound } = this.props; 
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
        <LocateControl options={locateOptions} onLocationFound={onLocationFound} startDirectly />
        <Search />
        <RoutingControl from={from} to={to} />
      </LeafletMap>
    );
  }
}

export default Map; 