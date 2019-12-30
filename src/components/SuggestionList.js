import React, { useState, useEffect, useContext } from 'react'; 
import { OpenStreetMapProvider } from 'leaflet-geosearch'; 

import { AppContext } from '../App.js'; 

const styles = {
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

export default function SuggestionList(props) {
	const [suggestionList, setSuggestionList] = useState({ matches: [], matches_cache: []}); 
	const { cache } = useContext(AppContext); 
	const { address, isFocused, onClick } = props; 
	const { matches, matches_cache } = suggestionList; 

	useEffect(() => {
		getSuggestionList(); 
	}, [address])

	return (
		<div style={styles.search_result_container}>
		{
			isFocused ? 
				matches_cache.map((item, key) => {
					return <div key={key} style={styles.search_result_item} onClick={() => onClick(item)}>{item}</div>
				}) : null
		}
		{   
			isFocused ? 
				matches.map((item, key) => {
					return <div key={key} style={styles.search_result_item} onClick={() => onClick(item.label)}>{item.label}</div>
				}) : null
		}
		</div>
	); 

	function getSuggestionList() {
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
}