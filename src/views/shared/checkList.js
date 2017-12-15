import React from 'react';
import {
	Image,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from 'react-native';

export default props => (
	<View style={styles.container}>
		<Text style={styles.label}>{props.labelText}</Text>
		<View style={styles.list}>
			{props.options.map((option, index) => {
				let isSelected = props.selectedValue === option.value;
				return (
					<TouchableHighlight
						key={index}
						onPress={() => {
							props.onPress(option.value);
						}}
						underlayColor="#ddd"
					>
						<View style={styles.listItem}>
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
	container: {},
	label: {
		paddingLeft: 10,
		fontSize: 14,
		height: 15,
		color: '#808080',
		height: 20
	},
	list: {
		borderColor: '#B5B9C2',
		borderTopWidth: 0.5
	},
	listItem: {
		flexDirection: 'row',
		borderColor: '#B5B9C2',
		borderBottomWidth: 0.5,
		marginLeft: 10
	},
	listItemText: {
		fontSize: 20,
		height: 40,
		color: '#000',
		paddingLeft: 10,
		flex: 9,
		marginTop: 13
	},
	selectedListItemText: {
		color: '#007AFF'
	},
	checkIcon: {
		alignSelf: 'flex-end',
		width: 30,
		height: 30,
		tintColor: '#007AFF',
		marginBottom: 14,
		flex: 1
	}
});
