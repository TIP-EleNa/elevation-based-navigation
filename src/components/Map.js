import React, { Component } from 'react'; 
import { Map as LeafletMap, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';

import LocateControl from './LocateControl'; 
import RoutingControl from './RoutingControl'; 
import Search from './Search/Search'
 
const locateOptions = {
  position: 'topright',
  strings: {
      title: ''
  },
  onActivate: () => {} 
}

class Map extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      currLoc: undefined, 
      start: undefined, 
      end: undefined
    }
  }

  locationFoundHandler = e => {
    this.setState({ currLoc: e.latlng }); 
  }

  routeHandler = e => {
    
  }

  renderRoute() {
    const {currLoc, start, end} = this.state; 
    if(start !== undefined && end !== undefined) {
      return (
        <RoutingControl 
          from={start === undefined ? currLoc : [57.74, 11.94]} 
          to={[57.6792, 11.949]} 
        />
      );
    }
  }

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
        <LocateControl options={locateOptions} onLocationFound={ this.locationFoundHandler } startDirectly/>
        <Search />
        <RoutingControl />
      </LeafletMap>
    );
  }
}

export default Map; 