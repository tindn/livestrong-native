import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function TextInputGroup(props) {
	return (
		<View style={styles.inputGroup}>
			<Text style={styles.label}>
				{props.labelText}
			</Text>
			<TextInput
				style={styles.input}
				defaultValue={props.inputValue}
				onChangeText={props.onChangeText}
				autoFocus={props.autoFocus ? props.autoFocus : false}
				placeholder={props.placeholderText}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	inputGroup: {
		paddingLeft: 10
	},
	label: {
		fontSize: 14,
		height: 15,
		color: '#808080'
	},
	input: {
		fontSize: 20,
		height: 40
	}
});
