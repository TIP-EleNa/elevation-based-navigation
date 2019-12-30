import React from 'react';

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
	favicon_container: {
		position: 'relative'
	}, 
	favicon: {
		position: 'absolute', 
		bottom: 0, 
		right: 0, 
		fontSize: 40, 
		color: '#4EB1BA'
	}, 
	table: {
		width: "100%"
	}, 
	td: {
		width: "10%"
	}, 
	progress_bar_container: {
		marginTop: 30
	}
}

function valuetext(value) {
  return `${value}`;
}

function ControlPanel(props) {
	const { state, getPath, fromInput, toInput, steepChangeHandler } = props; 
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
				<div style={{position: 'relative', zindex: 0}}>
					<h3 style={style.label}>FROM</h3>
					<AddressInput ref={fromInput} />
					<h3 style={style.label}>TO</h3>
					<AddressInput ref={toInput} />
					<h3 style={{...style.label, marginTop: 30, marginBottom: 0}}>Elevation Preference (%)</h3>
					<table style={style.table}>
						<tbody>
							<tr>
								<td style={style.td}><h3 style={style.label}>L</h3></td>
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
										zindex={0}
							      	/>
								</td>
								<td style={style.td}><h3 style={{...style.label}}>H</h3></td>
							</tr>
						</tbody>
					</table>
				</div>
				<div style={style.progress_bar_container}>
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
				<a href="https://github.com/TIP-EleNa/elevation-based-navigation" target="_blank" rel="noopener noreferrer" style={style.favicon}><i className="fa fa-github-square" aria-hidden="true"></i></a>
			</div>
		</form>
	); 
}

export default ControlPanel; 