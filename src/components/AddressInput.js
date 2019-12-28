import React, { useState, useEffect } from 'react'; 
import { OpenStreetMapProvider } from 'leaflet-geosearch'; 

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

const AddressInput = React.forwardRef((props, ref) => {
	const [isFocused, setIsFocused] = useState(false); 
	const [address, setAddress] = useState(''); 
	const [suggestionList, setSuggestionList] = useState({ matches: [], matches_cache: []}); 

	const { cache } = props;
	const { matches, matches_cache } = suggestionList; 

	useEffect(() => {
		let address_no_whitespace = address.trim().replace(/\s+/g,' '); 
		if(address_no_whitespace === '') {
			updateSuggestionList(cache, []); 
		} else {
			const list_cache = queryCache(address); 
			if(list_cache.length > 0) {
				updateSuggestionList(list_cache, []); 
			} else {
				queryOSM(address).then(results => updateSuggestionList([], results)); 
			}
		}
	}, [address])

	return (
		<div>
			<input type="text" style={style.input_box} value={address} ref={ref} onFocus={() => handleFocus()} onBlur={() => handleBlur()} onChange={e => handleAddressChange(e)}/>
			<div style={style.search_result_container}>
			{
				isFocused ? 
					matches_cache.map((item, key) => {
						return <div key={key} style={style.search_result_item} onClick={() => handleClick(item)}>{item}</div>
					}) : null
			}
			{   
				isFocused ? 
					matches.map((item, key) => {
						return <div key={key} style={style.search_result_item} onClick={() => handleClick(item.label)}>{item.label}</div>
					}) : null
			}
			</div>
		</div>
	); 

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

	function handleAddressChange(e) {
		setAddress(e.target.value); 
	}

	function handleClick(addressChosen) {
		setAddress(addressChosen); 
	}

	function updateSuggestionList(newCacheList, newMatchesList) {
		setSuggestionList({ matches_cache: newCacheList, matches: newMatchesList }); 
	}

	function queryCache(address) {
		let list = [];
		for(let i in cache) {
			if(list.length > 5) break; 
			if(cache[i].toLowerCase().indexOf(address.toLowerCase()) === -1) continue; 
			list.push(cache[i]); 
		} 
		return list; 
	}

	function queryOSM(address) {
		const provider = new OpenStreetMapProvider(); 
		return provider.search({ query: address }); 
	}
})

export default AddressInput; 