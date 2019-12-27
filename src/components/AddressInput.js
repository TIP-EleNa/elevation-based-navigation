import React from 'react'; 


export default function AddressInput(props) {
	const { style, address, ref, isFocused, focus, type, onFocus, onBlur, onChange, onSelect, matches_cache, matches } = props;
	return (
		<div>
			<input type="text" style={style.input_box} value={address} ref={ref} onFocus={() => onFocus(focus)} onBlur={() => onBlur(focus)} onChange={ e => { onChange(e, type); } }/>
			<div style={style.search_result_list}>
			{
				isFocused ? 
					matches_cache.map((item, key) => {
						return <div key={key} style={style.search_result} onClick={ () => { onSelect(type, item); } }>{item}</div>
					}) : null
			}
			{   
				isFocused ? 
					matches.map((item, key) => {
						return <div key={key} style={style.search_result} onClick={ () => { onSelect(type, item.label); } }>{item.label}</div>
					}) : null
			}
			</div>
		</div>
	); 
}