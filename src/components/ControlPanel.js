import React, { Component } from 'react';

import Slider from '@material-ui/core/Slider';
import CircularProgress from '@material-ui/core/CircularProgress';

import AddressInput from './AddressInput'; 


const style = {
	panel: {
		backgroundColor: "#222930", 
		color: "#4EB1BA", 
		fontFamily: "Verdana, Geneva, sans-serif", 
		display: "flex", 
		flexDirection: "row",
		justifyContent: "center", 
		width: "30vw", 
		height: "100vh"
	}, 
	content: {
		width: "90%", 
		overflowY:"scroll", 
		overflowX:"scroll"
	}, 
	title: {
		fontSize: 40, 
		marginBottom: 50
	}, 
	label: {
		textAlign: "left", 
		marginBottom: 20, 
		fontSize: "16px"
	}, 
	input_box: {
		width: "70%", 
		fontFamily: "Verdana, Geneva, sans-serif", 
		fontSize: "14px", 
	}, 
	input_range: {
		marginLeft: 30, 
		marginBottom: 20, 
		width: '80%'
	}, 
	button_submit: {
		backgroundColor: "#4EB1BA", 
		color: "white", 
		fontSize: 20, 
		fontWeight: "bold", 
		padding: "5px 20px", 
		cursor: "pointer", 
		marginTop: 50
	}, 
	search_result_list: {
		position: 'absolute', 
		zIndex: 1, 
		width: '100%', 
	}, 
	search_result: {
		background: 'white', 
		borderStyle: 'solid', 
		borderWidth: '1px', 
		padding: '5px 0px', 
		width: '70%', 
		margin: '0 auto', 
		fontSize: "14px", 
		color: "black"
	}, 
	favicon_container: {
		position: 'relative'
	}, 
	favicon: {
		position: 'absolute', 
		bottom: 0, 
		right: 0, 
		fontSize: 40, 
		color: '#4EB1BA'
	}
}

function valuetext(value) {
  return `${value}`;
}

class ControlPanel extends Component {
	constructor(props) {
		super(props); 
		this.state = {
			focus_from: false, 
			focus_to: false, 
		}; 
	}

	inputFocusHandler = (input) => {
		this.setState({[input]: true}); 
	}

	inputBlurHandler = (input) => {
		// send blur to event loop so suggestion list can be clicked
		setTimeout(() => {
			this.setState({[input]: false})
		}, 10); 
	}

	render() {
		const { state, addrChangeHandler, selectHandler, getPath, fromInput, toInput, steepChangeHandler } = this.props; 
		return (
			<form onSubmit={ getPath } style={style.panel}>
				<div style={style.content}>
					<h1 style={style.title}>EleNa Ultra</h1>
					<table style={{width: "100%", fontSize: 20, marginBottom: 50}}>
						<thead>
							<tr>
								<th>Distance</th>
								<th>Elevation</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{state.route_distance.toFixed(2)}&nbsp;miles</td>
								<td>{state.route_elevation.toFixed(2)}&nbsp;feet</td>
							</tr>
						</tbody>
					</table>
					<div style={{position: 'relative', zIndex: 0}}>
						<h3 style={style.label}>FROM</h3>
						<AddressInput 
							style={style}
							address={state.start}
							ref={fromInput}
							isFocused={this.state.focus_from}
							focus='focus_from'
							type='start'
							matches_cache={state.matches_cache_start}
							matches={state.matches_start}
							onFocus={this.inputFocusHandler}
							onBlur={this.inputBlurHandler}
							onChange={addrChangeHandler}
							onSelect={selectHandler}
						/>
						<h3 style={style.label}>TO</h3>
						<AddressInput 
							style={style}
							address={state.end}
							ref={toInput}
							isFocused={this.state.focus_to}
							focus='focus_to'
							type='end'
							matches_cache={state.matches_cache_end}
							matches={state.matches_end}
							onFocus={this.inputFocusHandler}
							onBlur={this.inputBlurHandler}
							onChange={addrChangeHandler}
							onSelect={selectHandler}
						/>
						<h3 style={{...style.label, marginTop: 30, marginBottom: 0}}>Elevation Preference (%)</h3>
						<table style={{width: "100%"}}>
							<tbody>
								<tr>
									<td style={{width: "10%"}}><h3 style={{...style.label}}>L</h3></td>
									<td>
										<Slider
											onChange={steepChangeHandler}
											defaultValue={0}
											getAriaValueText={valuetext}
											min={0}
											max={90}
											step={10}
											marks
											valueLabelDisplay="auto"
											zIndex={0}
								      	/>
									</td>
									<td style={{width: "10%"}}><h3 style={{...style.label}}>H</h3></td>
								</tr>
							</tbody>
						</table>
					</div>
					<div style={{marginTop: 30}}>
					{
						state.progress ? 
							<CircularProgress /> : 
							<button type='submit' style={style.button_submit} disabled={state.progress}>Search</button>
					}
					{
						state.error ? 
							<p style={{...style.label, color: 'red'}}>Server is not activated. Please contact the owner to start the server. </p> : 
							null
					}
					</div>
				</div>
				<div style={style.favicon_container}>
					<a href="https://github.com/TIP-EleNa/elevation-based-navigation" target="_blank" style={style.favicon}><i className="fa fa-github-square" aria-hidden="true"></i></a>
				</div>
			</form>
		); 
	}
}

export default ControlPanel; 