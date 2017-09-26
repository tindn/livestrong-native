import React from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native';

export default (PickerGroup = props => {
	return (
		<View
			style={{
				paddingLeft: 10
			}}
		>
			<Text
				style={{
					fontSize: 14,
					height: 15,
					color: '#808080'
				}}
			>
				{props.label || ''}
			</Text>
			<Picker
				selectedValue={props.selectedValue}
				onValueChange={props.onValueChange}
				style={{
					width: props.width || 200
				}}
				itemStyle={props.itemStyle || {}}
			>
				{props.pickerItems.map((item, index) => {
					return (
						<Picker.Item key={index} label={item.label} value={item.value} />
					);
				})}
				{props.items}
			</Picker>
		</View>
	);
});
