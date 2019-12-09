import React, { Component } from 'react';

import ControlPanel from './components/ControlPanel'; 
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'; 
import L from 'leaflet'; 
import Locate from 'leaflet.locatecontrol';
import 'leaflet-routing-machine'; 

import './App.css';
import './leaflet-geosearch.css'; 
import './leaflet-routing-machine.css'; 

const provider = new OpenStreetMapProvider(); 

class App extends Component {
	constructor(props) {
		super(props); 
		this.state = {
			currLoc: '', 
			start: '', 
			end: '', 
			matches_start: [], 
			matches_end: [], 
			matches_cache_start: [], 
			matches_cache_end: [], 
			steep: 0, 
			progress: false
		}

		this.from = ''; 
		this.to = ''; 
		this.cache = []; 

		this.marker_from = undefined; 
		this.marker_to = undefined; 

		this.fromInput = React.createRef(); 
		this.toInput = React.createRef(); 
	}

	componentDidMount() {
		this.map = this.initializeMap(); 
		this.addBaseMap(); 
		this.addLocateControl(); 
		this.addSearchControl(); 
	}

	initializeMap = () => {
		let map = L.map('map', {
			zoom: 15, 
	        maxZoom: 15, 
	        attributionControl: true, 
	        zoomControl: true, 
	        doubleClickZoom: true,
	        scrollWheelZoom: true,
	        dragging: true,
	        animate: true,
	        easeLinearity: 0.35
		}); 
		return map; 
	}

	addBaseMap = () => {
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map); 
	}

	addLocateControl = () => {
		const options = {
		  position: 'topright',
		  strings: {
		    title: ''
		  }
		}
		const locate = new Locate(options);
	    this.map.on('locationfound', this.locationFoundHandler); 
	    locate.addTo(this.map);
	    locate.start()
	}

	locationFoundHandler = e => {
		const currLoc = `${e.latlng.lat} ${e.latlng.lng}`; 
		this.addToCache('Your Location'); 
		if(this.state.matches_cache_start.length === 0 && this.state.matches_cache_end.length === 0) {
			this.setState({ currLoc: currLoc, matches_cache_start: ['Your Location'], matches_cache_end: ['Your Location'] }); 
		} else {
			this.setState({ currLoc: currLoc }); 
		}
		
	}

	addSearchControl = () => {
		const searchControl = new GeoSearchControl({ provider: provider }); 
		searchControl.addTo(this.map); 
	}

	addrChangeHandler = (e, c) => {
		const addr = e.target.value; 
		const matches = `matches_${c}`; 
		this.setState({ [c]: addr }, () => {
			let cl = this.state[c].trim().replace(/\s+/g,' '); 
			if(cl === '') {
				this.setState({ [`matches_cache_${c}`]: this.cache, [matches]: [] }); 
			} else {
				const list_cache = this.query(cl); 
				if(list_cache.length > 0) {
					this.setState({ [`matches_cache_${c}`]: list_cache, [matches]: [] })
				} else {
					provider
						.search({ query: cl })
						.then(results => {this.setState({ [`matches_cache_${c}`]: [], [matches]: results }); 
					})
				}
			}
		})
	}

	selectHandler = (addr, c) => {
		this.setState({ [c]: addr }); 
	}

	addRoutingControl = async (e) => {
		e.preventDefault(); 
		this.validateInput(); 

		let start = this.state.start.trim().replace(/\s+/g,' '); 
		let end = this.state.end.trim().replace(/\s+/g,' '); 
		let currLoc = this.state.currLoc; 

		this.addToCache(start); 
		this.addToCache(end); 

		if(start === 'Your Location') start = currLoc; 
		if(end === 'Your Location') end = currLoc; 
		
		const from = start; 
		const to = end; 
		const prev_from = this.from; 
		const prev_to = this.to; 
		if(!this.isDifferent(prev_from, prev_to, from, to)) return; 
		this.from = from; 
		this.to = to; 

		this.setState({progress: true}); 
		let waypoints = await fetch('http://localhost:5000/search', {
			method: 'POST', 
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify({origin: start, destination: end, ratio: this.state.steep})
		}).then(response => response.json())
	      .then(data => { return data; })
	      .catch(error => console.warn(error));

	    this.clearMap(); 
		let latlngs = []; 
		for(let i in waypoints) {
			let waypoint = [waypoints[i].y, waypoints[i].x]
			if(i == 0) {
				this.marker_from = new L.Marker(waypoint).bindPopup(`<b>${this.state.start}</b>`); 
		        this.map.addLayer(this.marker_from);
			} else if(i == waypoints.length-1) {
				this.marker_to = new L.Marker(waypoint).bindPopup(`<b>${this.state.end}</b>`); 
				this.map.addLayer(this.marker_to); 
			} else {
				L.circle(waypoint, {
					color: 'red',
				    fillColor: '#f03',
				    fillOpacity: 0.5,
				    radius: 20
				}).addTo(this.map); 
			}
			latlngs.push(L.latLng(waypoint[0], waypoint[1])); 
		}
		L.polyline(latlngs, {color: 'red'}).addTo(this.map); 
		this.setState({progress: false}); 
	}

	query = (addr) => {
		let list = [];
		for(let i in this.cache) {
			if(list.length > 5) break; 
			if(this.cache[i].toLowerCase().indexOf(addr.toLowerCase()) === -1) continue; 
			list.push(this.cache[i]); 
		} 
		return list; 
	}

	addToCache = (addr) => {
		if(this.cache.length > 10) this.cache.splice(this.cache.length-1, 1); 
		let idx = -1; 
		for(let i in this.cache) {
			if(addr.toLowerCase() === this.cache[i].toLowerCase()) {
				idx = i; 
				break; 
			}
		}
		if(idx >= 0) {
			this.cache.splice(idx, 1); 
		}
		this.cache.unshift(addr); 
	}

	validateInput = () => {
		if(this.fromInput.current.value === '') {
			this.fromInput.current.focus(); 
			return; 
		}
		if(this.toInput.current.value === '') {
			this.toInput.current.focus(); 
			return; 
		}
	}

	isDifferent = (prev_from, prev_to, from, to) => {
		return prev_from !== from || prev_to !== to; 
	}

	steepChangeHandler = (e, value) => {
		this.setState({ steep: Math.floor(value/10)/10 })
	}

	clearMap = () => {
		if(this.marker_from !== undefined && this.marker_to !== undefined) {
	    	this.map.removeLayer(this.marker_from); 
	    	this.map.removeLayer(this.marker_to); 
	    }
	    for(let i in this.map._layers) {
	        if(this.map._layers[i]._path !== undefined) {
	            try {
	                this.map.removeLayer(this.map._layers[i]);
	            }
	            catch(e) {
	                console.log("problem with " + e + this.map._layers[i]);
	            }
	        }
	    }
    }

	render() {
		return (
			<div className="App">
				<div id='map'></div>
				<ControlPanel 
					state={this.state} 
					addrChangeHandler={this.addrChangeHandler} 
					selectHandler={this.selectHandler} 
					getPath={this.addRoutingControl} 
					fromInput={this.fromInput} 
					toInput={this.toInput} 
					steepChangeHandler={this.steepChangeHandler} 
				/>
			</div>
		);
	}
}

export default App;
