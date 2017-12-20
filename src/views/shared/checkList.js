import React from 'react';
import {
	Image,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from 'react-native';
import { iosBlue, borderGray } from '../../globals';

export default props => (
	<View style={props.style}>
		<Text style={styles.label}>{props.labelText}</Text>
		<View style={styles.list}>
			{props.options.map((option, index, list) => {
				let isSelected = props.selectedValue === option.value;
				return (
					<TouchableHighlight
						key={index}
						onPress={() => {
							props.onPress(option.value);
						}}
						underlayColor="#ddd"
					>
						<View
							style={[
								styles.listItem,
								index === list.length - 1 && styles.lastListItem
							]}
						>
							<Text
								style={[
									styles.listItemText,
									isSelected && styles.selectedListItemText
								]}
							>
								{option.name}
							</Text>
							{isSelected ? (
								<Image
									source={require('../../../assets/check.png')}
									style={styles.checkIcon}
								/>
							) : null}
						</View>
					</TouchableHighlight>
				);
			})}
		</View>
	</View>
);

const styles = StyleSheet.create({
	label: {
		paddingLeft: 10,
		fontSize: 14,
		height: 15,
		color: '#808080',
		height: 20,
		marginBottom: 10
	},
	list: {
		borderColor: borderGray,
		borderTopWidth: 0.5,
		borderBottomWidth: 0.5
	},
	listItem: {
		flexDirection: 'row',
		borderColor: borderGray,
		borderBottomWidth: 0.5,
		marginLeft: 10
	},
	lastListItem: {
		borderBottomWidth: 0
	},
	listItemText: {
		fontSize: 20,
		height: 35,
		color: '#000',
		paddingLeft: 10,
		flex: 9,
		marginTop: 8
	},
	selectedListItemText: {
		color: iosBlue
	},
	checkIcon: {
		alignSelf: 'flex-end',
		width: 25,
		height: 25,
		tintColor: iosBlue,
		marginBottom: 14,
		marginRight: 10
	}
});
