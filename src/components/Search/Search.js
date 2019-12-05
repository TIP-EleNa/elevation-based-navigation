import { Component } from 'react'; 
import { withLeaflet } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import './leaflet-geosearch.css'; 

const provider = new OpenStreetMapProvider(); 

class Search extends Component {
	componentDidMount() {
		const { map } = this.props.leaflet; 
		const searchControl = new GeoSearchControl({ provider: provider }); 
		searchControl.addTo(map); 
	}

	render() {
		return null; 
	}
}

export default withLeaflet(Search);