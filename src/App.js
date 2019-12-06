import React, { Component } from 'react';

import Map from './components/Map'; 
import ControlPanel from './components/ControlPanel'; 
import { OpenStreetMapProvider } from 'leaflet-geosearch'; 

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

let cache = []
const query = (addr) => {
	let list = [];
	for(let item in cache) {
		if(item.indexOf(addr) === -1 || list.length > 5) break; 
		list.push(item); 
	} 
	return list; 
}

const addToCache = (addr) => {
	if(addr === '') return; 
	if(cache.length > 10) cache.splice(cache.length-1, 1); 
	const idx = cache.indexOf(addr); 
	if(idx >= 0) {
		cache.splice(idx, 1); 
	}
	cache.unshift(addr); 
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
			from: undefined, 
			to: undefined
		}
	}

	addrChangeHandler = (e, c) => {
		const addr = e.target.value; 
		const matches = `matches_${c}`; 
		this.setState({ [c]: addr }, () => {
			let cl = this.state[c].trim().replace(/\s+/g,' '); 
			if(cl.length === 0) {
				this.setState({ [`matches_cache_${c}`]: cache, [matches]: [] }); 
			} else {
				const list_cache = query(cl); 
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

	getPath = async (e) => {
		e.preventDefault(); 
		let start = this.state.start.trim().replace(/\s+/g,' '); 
		let end = this.state.end.trim().replace(/\s+/g,' '); 
		let currLoc = this.state.currLoc; 

		addToCache(start); 
		addToCache(end); 

		if(start === 'Your Location') start = currLoc; 
		if(end === 'Your Location') end = currLoc; 

		const from = await provider.search({ query: start }); 
		const to = await provider.search({ query: end }); 
		this.setState({from: from, to: to}); 
	}

	locationFoundHandler = e => {
		const currLoc = `${e.latlng.lat}, ${e.latlng.lng}`; 
		addToCache('Your Location'); 
		this.setState({ currLoc: currLoc, matches_cache_start: ['Your Location'], matches_cache_end: ['Your Location'] }); 
	}

	render() {
		return (
			<div className="App">
				<Map 
				from={this.state.from} 
				to={this.state.to} 
				onLocationFound={this.locationFoundHandler} />
				<ControlPanel 
					style={controlPanelStyle} 
					state={this.state} 
					addrChangeHandler={this.addrChangeHandler} 
					selectHandler={this.selectHandler} 
					getPath={this.getPath} 
					cache={cache} />
			</div>
		);
	}
}

export default App;
