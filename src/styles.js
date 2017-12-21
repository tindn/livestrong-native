import { StyleSheet } from 'react-native';
import { borderGray } from './globals';

export const ListStyles = StyleSheet.create({
	listView: {
		flex: 1
	},
	listItem: {
		borderColor: borderGray,
		borderBottomWidth: 0.5,
		paddingLeft: 7,
		paddingBottom: 15,
		paddingTop: 20,
		marginLeft: 10
	},
	itemTitle: {
		fontSize: 18,
		// color: '#4B4C4B',
		marginBottom: 5
	}
});

export const TextInputGroupStyles = StyleSheet.create({
	group: {
		paddingLeft: 10
	},
	label: {
		fontSize: 14,
		height: 15,
		color: '#808080',
		marginBottom: 10
	},
	input: {
		fontSize: 20,
		height: 40
	}
});

export const ActionButtonsStyles = StyleSheet.create({
	group: {
		marginTop: 50
	},
	button: {
		borderColor: borderGray,
		borderTopWidth: 0.5,
		paddingTop: 10,
		paddingBottom: 10
	},
	lastButton: {
		borderColor: borderGray,
		borderTopWidth: 0.5,
		paddingTop: 10,
		paddingBottom: 10,
		borderBottomWidth: 0.5
	}
});
