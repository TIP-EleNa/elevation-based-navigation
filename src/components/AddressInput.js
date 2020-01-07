import React, { useState } from 'react'; 

import SuggestionList from './SuggestionList'; 

const styles = {
	input_box: {
		width: "70%", 
		fontFamily: "Verdana, Geneva, sans-serif", 
		fontSize: "14px", 
	}
}

const AddressInput = React.forwardRef((props, ref) => {
	const [isFocused, setIsFocused] = useState(false); 
	const [address, setAddress] = useState(''); 

	return (
		<div>
			<input 
				type="text" 
				style={styles.input_box} 
				value={address} 
				ref={ref} 
				onFocus={() => handleFocus()} 
				onBlur={() => handleBlur()} 
				onChange={e => handleAddressChange(e)} 
			/>
			<SuggestionList 
				address={address}
				isFocused={isFocused} 
				onClick={setAddress} 
			/>
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
})

export default AddressInput; 