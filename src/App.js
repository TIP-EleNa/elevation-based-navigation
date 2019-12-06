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
		borderWidth: '1px'
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
			from: undefined, 
			to: undefined
		}
	}

	addrChangeHandler = (e, c) => {
		const addr = e.target.value; 
		const matches = `matches_${c}`; 
		this.setState({ [c]: addr }, () => {
			let cl = this.state[c]
			if(cl.length === 0) {
				this.setState({ [matches]: [] }); 
			}
			else if(cl.length % 2 === 0) {
				provider
					.search({ query: cl })
					.then(results => {
						this.setState({ [matches]: results }); 
					})
			}
		})
	}

	selectHandler = (addr, c) => {
		this.setState({ [c]: addr }); 
	}

	getPath = async (e) => {
		e.preventDefault(); 
		let start = this.state.start; 
		let end = this.state.end; 
		if(start === 'Your Location') start = this.state.currLoc; 
		if(end === 'Your Location') end = this.state.currLoc; 
		const from = await provider.search({ query: start }); 
		const to = await provider.search({ query: end }); 
		this.setState({from: from, to: to}); 
	}

	locationFoundHandler = e => {
		const currLoc = `${e.latlng.lat}, ${e.latlng.lng}`; 
		this.setState({ currLoc: currLoc }); 
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
					getPath={this.getPath} />
			</div>
		);
	}
}

export default App;
