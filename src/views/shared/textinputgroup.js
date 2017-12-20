import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { TextInputGroupStyles } from '../../styles';

export default props => (
	<View style={styles.inputGroup}>
		<Text style={TextInputGroupStyles.label}>{props.labelText}</Text>
		<TextInput
			style={TextInputGroupStyles.input}
			defaultValue={props.inputValue}
			onChangeText={props.onChangeText}
			autoFocus={props.autoFocus ? props.autoFocus : false}
			placeholder={props.placeholderText}
		/>
	</View>
);

const styles = StyleSheet.create({
	inputGroup: {
		paddingLeft: 10
	}
});
