import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { TextInputGroupStyles } from '../../styles';

export default props => (
	<View style={TextInputGroupStyles.group}>
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
