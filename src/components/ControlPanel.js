import React, { Component } from 'react';

class ControlPanel extends Component {
	render() {
		const { style, state, addrChangeHandler, selectHandler, getPath } = this.props; 
		return (
			<form onSubmit={ getPath } style={style.panel}>
				<div style={style.content}>
					<h1>EleNa Ultra</h1>
					<h3 style={style.label}>FROM</h3>
					<input type="text" style={style.input_box} value={state.start} onChange={ e => { addrChangeHandler(e, 'start'); } }/>
					{   
						state.matches_start.map((item, key) => {
							return <div key={key} style={{ background: 'white' }} onClick={ () => { selectHandler(item.label, 'start'); } }>{item.label}</div>
						})
					}
					<h3 style={style.label}>TO</h3>
					<input type="text" style={style.input_box} value={state.end} onChange={ e => { addrChangeHandler(e, 'end'); } }/>
					{
						state.matches_end.map((item, key) => {
							return <div key={key} style={{ background: 'white' }} onClick={ () => { selectHandler(item.label, 'end'); } }>{item.label}</div>
						})
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