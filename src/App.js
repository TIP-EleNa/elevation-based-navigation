import React, { Component } from 'react';

import ControlPanel from './components/ControlPanel'; 
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'; 
import L from 'leaflet'; 
import Locate from 'leaflet.locatecontrol';
import 'leaflet-routing-machine'; 

import './App.css';

const controlPanelStyle = {
	panel: {
		backgroundColor: "lightgray", 
		display: "flex", 
		flexDirection: "row",
		justifyContent: "center", 
		width: "30%"
	}, 
	content: {
		width: "90%", 
		marginTop: 30
	}, 
	label: {
		textAlign: "left", 
		marginBottom: 10
	}, 
	input_box: {
		width: "70%"
	}, 
	input_range: {
		marginTop: 50
	}, 
	button_submit: {
		marginTop: 50
	}, 
	search_result: {
		background: 'white', 
		borderStyle: 'solid', 
		borderWidth: '1px', 
		padding: '5px 0px', 
		width: '70%', 
		margin: '0 auto'
	}
}

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
		}

		this.from = ''; 
		this.to = ''; 
		this.cache = []; 

		this.routingControl = null; 

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
		const currLoc = `${e.latlng.lat}, ${e.latlng.lng}`; 
		this.addToCache('Your Location'); 
		this.setState({ currLoc: currLoc, matches_cache_start: ['Your Location'], matches_cache_end: ['Your Location'] }); 
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

		if(start === '' || end === '') return; 

		this.addToCache(start); 
		this.addToCache(end); 

		if(start === 'Your Location') start = currLoc; 
		if(end === 'Your Location') end = currLoc; 

		const from = await provider.search({ query: start }); 
		const to = await provider.search({ query: end }); 
		const prev_from = this.from; 
		const prev_to = this.to; 
		if(this.isFound(from, to)) {
			if(!this.isValid(prev_from, prev_to) || 
				!this.isFound(prev_from, prev_to) || 
				this.isDifferent(prev_from, prev_to, from, to)) {
			    if(this.routingControl != null) {
			    	this.map.removeControl(this.routingControl); 
			    } 
		    	this.routingControl = L.Routing.control({}); 
			    this.routingControl.getPlan().setWaypoints([
		        	L.latLng(from[0].y, from[0].x), 
					L.latLng(to[0].y, to[0].x)
		        ]); 
				this.routingControl.addTo(this.map); 
				this.from = from; 
				this.to = to; 
			}
		}
	}

	query = (addr) => {
		let list = [];
		for(let item in this.cache) {
			if(item.indexOf(addr) === -1 || list.length > 5) break; 
			list.push(item); 
		} 
		return list; 
	}

	addToCache = (addr) => {
		if(addr === '') return; 
		if(this.cache.length > 10) this.cache.splice(this.cache.length-1, 1); 
		const idx = this.cache.indexOf(addr); 
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

	isValid = (from, to) => {
		return from !== undefined && to !== undefined; 
	}

	isFound = (from, to) => {
		return from.length > 0 && to.length > 0; 
	}

	isDifferent = (prev_from, prev_to, from, to) => {
		return JSON.stringify(prev_from[0]) !== JSON.stringify(from[0]) || 
				JSON.stringify(prev_to[0]) !== JSON.stringify(to[0]); 
	}

	render() {
		return (
			<div className="App">
				<div id='map'></div>
				<ControlPanel 
					style={controlPanelStyle} 
					state={this.state} 
					addrChangeHandler={this.addrChangeHandler} 
					selectHandler={this.selectHandler} 
					getPath={this.addRoutingControl} 
					fromInput={this.fromInput} 
					toInput={this.toInput} />
			</div>
		);
	}
}

export default App;
