import React, { Component } from 'react';
import { withLeaflet } from 'react-leaflet';
import L from 'leaflet'; 
import 'leaflet-routing-machine'; 

class RoutingControl extends Component {
	componentDidMount() {
		const { map } = this.props.leaflet;
		const { from, to } = this.props;
	    const leafletElement = L.Routing.control({})
	    leafletElement.getPlan().setWaypoints([
        	L.latLng(from[0], from[1]), 
        	L.latLng(to[0], to[1])
        ]); 
		leafletElement.addTo(map); 
	}

	render() {
		return null;
	}
}

export default withLeaflet(RoutingControl); 