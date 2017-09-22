import { StyleSheet } from 'react-native';

export const FlatListStyles = StyleSheet.create({
	listView: {
		flex: 1
	},
	listItem: {
		borderColor: '#B5B9C2',
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
	input: {
		marginTop: 10,
		marginBottom: 40
	}
});

export const ActionButtonsStyles = StyleSheet.create({
	group: {
		marginTop: 50
	},
	button: {
		borderColor: '#B5B9C2',
		borderTopWidth: 0.5,
		paddingTop: 10,
		paddingBottom: 10
	},
	lastButton: {
		borderColor: '#B5B9C2',
		borderTopWidth: 0.5,
		paddingTop: 10,
		paddingBottom: 10,
		borderBottomWidth: 0.5
	}
});
