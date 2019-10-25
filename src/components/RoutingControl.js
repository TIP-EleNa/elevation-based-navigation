import React, { Component } from 'react';
import { withLeaflet } from 'react-leaflet';
import L from 'leaflet'; 
import 'leaflet-routing-machine'; 
import Control from 'react-leaflet-control'; 
import { OpenStreetMapProvider } from 'leaflet-geosearch'; 

const provider = new OpenStreetMapProvider(); 

class RoutingControl extends Component {
	constructor(props) {
		super(props); 
		this.state = {
			start: '', 
			end: '', 
			matches_start: [], 
			matches_end: []
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
		const matches = `matches_${c}`; 
		this.setState({ [c]: addr }, () => {
			provider
				.search({ query: addr })
				.then(results => {
					this.setState({ [matches]: [] }); 
				})
		}); 
	}

	renderRoute = async (e) => {
		e.preventDefault(); 
		const start = await provider.search({ query: this.state.start }); 
		const end = await provider.search({ query: this.state.end }); 

		const { map } = this.props.leaflet;
	    const leafletElement = L.Routing.control({})
	    leafletElement.getPlan().setWaypoints([
        	L.latLng(start[0].y, start[0].x), 
			L.latLng(end[0].y, end[0].x)
        ]); 
		leafletElement.addTo(map); 
	}

	render() {
		return (
			<Control position='topleft' className='geosearch leaflet-bar leaflet-control leaflet-control-geosearch active'>
				<form onSubmit={ this.renderRoute }>
						<input className='glass' type='text' value={this.state.start} onChange={ e => { this.addrChangeHandler(e, 'start'); } } />
						<input className='glass' type='text' value={this.state.end} onChange={ e => { this.addrChangeHandler(e, 'end'); } } />
						<div className='results'>
							{   
								this.state.matches_start.map((item, key) => {
									return <div key={key} style={{ background: 'white' }} onClick={ () => { this.selectHandler(item.label, 'start'); } }>{item.label}</div>
								})
							}
							{
								this.state.matches_end.map((item, key) => {
									return <div key={key} style={{ background: 'white' }} onClick={ () => { this.selectHandler(item.label, 'end'); } }>{item.label}</div>
								})
							}
						</div>
						<button type='submit'>Start</button>
				</form>
			</Control>
		);
	}
}

export default withLeaflet(RoutingControl); 