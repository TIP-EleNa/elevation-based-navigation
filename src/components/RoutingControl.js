import { Component } from 'react';
import { withLeaflet } from 'react-leaflet';
import L from 'leaflet'; 
import 'leaflet-routing-machine'; 

class RoutingControl extends Component {
	componentDidUpdate(prevProps) {
		const {from, to} = this.props; 
		if(from !== undefined && to !== undefined && 
			from.length > 0 && to.length > 0 && 
			JSON.stringify(prevProps.from[0]) !== JSON.stringify(from[0]) && 
			JSON.stringify(prevProps.to[0]) !== JSON.stringify(to[0])) {
			this.renderRoute(from , to); 
		}
	}

	renderRoute = (from, to) => {
		const { map } = this.props.leaflet;
	    const leafletElement = L.Routing.control({}); 
	    leafletElement.getPlan().setWaypoints([
        	L.latLng(from[0].y, from[0].x), 
			L.latLng(to[0].y, to[0].x)
        ]); 
        leafletElement.on('routeselected', function(routes) {
        	console.log(`routes: ${routes}`); 
        	console.log(`instructions: ${routes.route.instructions}`); 
        }); 
		leafletElement.addTo(map); 
	}

	render() {
		return null; 
	}
}

export default withLeaflet(RoutingControl); 