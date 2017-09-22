import React from 'react';
import {
	Image,
	Text,
	TextInput,
	TouchableHighlight,
	View,
	StyleSheet
} from 'react-native';

export default (SetEntry = props => {
	return (
		<View style={styles.mainView} key={props.setIndex}>
			<Text style={styles.index}>{props.setIndex + 1}.</Text>
			<View style={styles.inputGroup}>
				<TouchableHighlight
					onPress={() => {
						const set = props.set;
						set.reps++;
						props.updateSet(set, props.setIndex);
					}}
				>
					<Text style={styles.repsAction}>+</Text>
				</TouchableHighlight>
				<TextInput style={styles.repsInput} value={props.set.reps.toString()} />
				<TouchableHighlight
					onPress={() => {
						const set = props.set;
						set.reps--;
						props.updateSet(set, props.setIndex);
					}}
				>
					<Text style={styles.repsAction}>-</Text>
				</TouchableHighlight>
			</View>
			<Text style={styles.staticText}>reps at</Text>
			<View style={styles.inputGroup}>
				<TouchableHighlight
					onPress={() => {
						const set = props.set;
						set.weight += 2.5;
						props.updateSet(set, props.setIndex);
					}}
				>
					<Text style={styles.weightAction}>+</Text>
				</TouchableHighlight>
				<TextInput
					style={styles.weightInput}
					value={props.set.weight.toString()}
				/>
				<TouchableHighlight
					onPress={() => {
						const set = props.set;
						set.weight -= 2.5;
						props.updateSet(set, props.setIndex);
					}}
				>
					<Text style={styles.weightAction}>-</Text>
				</TouchableHighlight>
			</View>
			<Text style={styles.staticText}>
				{props.set.weightUnit ? props.set.weightUnit : 'lbs'}
			</Text>
			<TouchableHighlight
				onPress={() => {
					props.removeSet(props.setIndex);
				}}
			>
				<Image
					source={require('../../../assets/close.png')}
					style={styles.removeImage}
				/>
			</TouchableHighlight>
		</View>
	);
});

const styles = StyleSheet.create({
	mainView: {
		flexDirection: 'row',
		marginLeft: 5,
		marginRight: 5,
		marginTop: 5,
		borderColor: '#B5B9C2',
		borderTopWidth: 0.5,
		paddingLeft: 10
	},
	inputGroup: { flexDirection: 'column' },
	repsInput: {
		width: 40,
		textAlign: 'center',
		marginTop: 5,
		fontSize: 18
	},
	weightInput: {
		width: 80,
		textAlign: 'center',
		marginTop: 5,
		fontSize: 18
	},
	repsAction: {
		color: '#007AFF',
		fontSize: 30,
		paddingLeft: 8,
		paddingRight: 7,
		textAlign: 'center',
		height: 45
	},
	weightAction: {
		color: '#007AFF',
		fontSize: 30,
		paddingLeft: 10,
		paddingRight: 7,
		textAlign: 'center',
		height: 45
	},
	staticText: {
		marginTop: 50,
		fontSize: 17,
		paddingLeft: 10,
		paddingRight: 10
	},
	index: {
		marginTop: 50,
		fontSize: 17,
		marginRight: 20
	},
	removeImage: {
		width: 15,
		height: 15,
		tintColor: 'red',
		marginTop: 55,
		marginLeft: 30
	}
});
