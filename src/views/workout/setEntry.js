import React from 'react';
import {
	Image,
	Picker,
	Text,
	TextInput,
	TouchableHighlight,
	View,
	StyleSheet
} from 'react-native';
import { iosBlue, borderGray, UnitTypes } from '../../globals';

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
						props.updateSet(
							{ ...props.set, weight: (props.set.weight += 2.5) },
							props.setIndex
						);
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
						props.updateSet(
							{ ...props.set, weight: (props.set.weight -= 2.5) },
							props.setIndex
						);
					}}
				>
					<Text style={styles.weightAction}>-</Text>
				</TouchableHighlight>
			</View>
			<View />
			<Picker
				style={{ width: 50 }}
				itemStyle={{ height: 120 }}
				selectedValue={props.set.weightUnit}
				onValueChange={(itemValue, itemIndex) => {
					props.updateSet(
						{ ...props.set, weightUnit: itemValue },
						props.setIndex
					);
				}}
			>
				{UnitTypes.map((type, index) => (
					<Picker.Item key={index} label={type.name} value={type._id} />
				))}
			</Picker>
			<TouchableHighlight
				onPress={() => {
					props.removeSet(props.setIndex);
				}}
				style={styles.removeInput}
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
		marginLeft: 10,
		marginRight: 5,
		marginTop: 5,
		borderColor: borderGray,
		borderTopWidth: 0.5,
		justifyContent: 'space-between'
	},
	inputGroup: { flexDirection: 'column' },
	repsInput: {
		width: 40,
		textAlign: 'center',
		marginTop: 5,
		marginBottom: 8,
		fontSize: 18
	},
	weightInput: {
		width: 80,
		textAlign: 'center',
		marginTop: 5,
		marginBottom: 8,
		fontSize: 18
	},
	repsAction: {
		color: iosBlue,
		fontSize: 30,
		paddingLeft: 8,
		paddingRight: 7,
		textAlign: 'center',
		height: 45
	},
	weightAction: {
		color: iosBlue,
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
	removeInput: {},
	removeImage: {
		width: 15,
		height: 15,
		tintColor: 'red',
		marginTop: 52,
		marginLeft: 15,
		marginRight: 15
	}
});
