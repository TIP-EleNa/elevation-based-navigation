import React, { Component } from 'react';

class ControlPanel extends Component {
	constructor(props) {
		super(props); 
		this.state = {
			focus_from: false, 
			focus_to: false
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
		const { style, state, addrChangeHandler, selectHandler, getPath, fromInput, toInput } = this.props; 
		return (
			<form onSubmit={ getPath } style={style.panel}>
				<div style={style.content}>
					<h1>EleNa Ultra</h1>
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
					<div style={style.input_range}>
						<input type="range" />
					</div>
					<button type='submit' style={style.button_submit}>Search</button>
				</div>
			</form>
		); 
	}
}

export default ControlPanel; 