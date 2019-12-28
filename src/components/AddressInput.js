import React, { useState } from 'react'; 

const style = {
	input_box: {
		width: "70%", 
		fontFamily: "Verdana, Geneva, sans-serif", 
		fontSize: "14px", 
	}, 
	search_result_container: {
		position: 'absolute', 
		zIndex: 1, 
		width: '100%', 
	}, 
	search_result_item: {
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

export default function AddressInput(props) {
	const [isFocused, setIsFocused] = useState(false); 

	function handleFocus() {
		setIsFocused(true); 
	}

	function handleBlur() {
		// setTimeout so suggestion list can be clicked
		// or it will be blurred first
		setTimeout(() => {
			setIsFocused(false); 
		}, 10); 
	}

	const { address, ref, type, onChange, onSelect, matches_cache, matches } = props;
	return (
		<div>
			<input type="text" style={style.input_box} value={address} ref={ref} onFocus={() => handleFocus()} onBlur={() => handleBlur()} onChange={ e => { onChange(e, type); } }/>
			<div style={style.search_result_container}>
			{
				isFocused ? 
					matches_cache.map((item, key) => {
						return <div key={key} style={style.search_result_item} onClick={ () => { onSelect(type, item); } }>{item}</div>
					}) : null
			}
			{   
				isFocused ? 
					matches.map((item, key) => {
						return <div key={key} style={style.search_result_item} onClick={ () => { onSelect(type, item.label); } }>{item.label}</div>
					}) : null
			}
			</div>
		</div>
	); 
}