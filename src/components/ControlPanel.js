import React, { Component } from 'react';

import Slider from '@material-ui/core/Slider';
import LinearProgress from '@material-ui/core/LinearProgress';

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
	search_result: {
		background: 'white', 
		borderStyle: 'solid', 
		borderWidth: '1px', 
		padding: '5px 0px', 
		width: '70%', 
		margin: '0 auto', 
		fontSize: "14px", 
		color: "black"
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
					<div style={{height: "2%"}}>
					{
						state.progress ? 
							<LinearProgress variant="indeterminate" color="secondary" /> : null
					}
					</div>
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
								<td>{state.route_distance.toFixed(2)}</td>
								<td>{state.route_elevation.toFixed(2)}</td>
							</tr>
						</tbody>
					</table>
					<h3 style={style.label}>FROM</h3>
					<input type="text" style={style.input_box} value={state.start} ref={fromInput} onFocus={() => this.inputFocusHandler('focus_from')} onBlur={() => this.inputBlurHandler('focus_from')} onChange={ e => { addrChangeHandler(e, 'start'); } }/>
					{
						this.state.focus_from ? 
							state.matches_cache_start.map((item, key) => {
								return <div key={key} style={style.search_result} onClick={ () => { selectHandler(item, 'start'); } }>{item}</div>
							}) : null
					}
					{   
						this.state.focus_from ? 
							state.matches_start.map((item, key) => {
								return <div key={key} style={style.search_result} onClick={ () => { selectHandler(item.label, 'start'); } }>{item.label}</div>
							}) : null
					}
					<h3 style={style.label}>TO</h3>
					<input type="text" style={style.input_box} value={state.end} ref={toInput} onFocus={() => this.inputFocusHandler('focus_to')} onBlur={() => this.inputBlurHandler('focus_to')} onChange={ e => { addrChangeHandler(e, 'end'); } }/>
					{
						this.state.focus_to ? 
							state.matches_cache_end.map((item, key) => {
								return <div key={key} style={style.search_result} onClick={ () => { selectHandler(item, 'end'); } }>{item}</div>
							}) : null
					}
					{
						this.state.focus_to ? 
							state.matches_end.map((item, key) => {
								return <div key={key} style={style.search_result} onClick={ () => { selectHandler(item.label, 'end'); } }>{item.label}</div>
							}) : null
					}
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
							      	/>
								</td>
								<td style={{width: "10%"}}><h3 style={{...style.label}}>H</h3></td>
							</tr>
						</tbody>
					</table>
					<button type='submit' style={style.button_submit} disabled={state.progress}>Search</button>
				</div>
			</form>
		); 
	}
}

export default ControlPanel; 