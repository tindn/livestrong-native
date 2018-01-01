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
import { iosBlue, borderGray, UnitTypes, successGreen } from '../../globals';

export default (SetEntry = props => {
	return (
		<View style={styles.mainView} key={props.setIndex}>
			{props.set.completed ? null : (
				<View style={styles.actionGroup}>
					<TouchableHighlight
						style={styles.repsAction}
						onPress={() => {
							const set = props.set;
							set.reps++;
							props.updateSet(set, props.setIndex);
						}}
					>
						<Text style={styles.updateIcon}>+</Text>
					</TouchableHighlight>
					<TouchableHighlight
						style={styles.weightAction}
						onPress={() => {
							props.updateSet(
								{ ...props.set, weight: (props.set.weight += 2.5) },
								props.setIndex
							);
						}}
					>
						<Text style={styles.updateIcon}>+</Text>
					</TouchableHighlight>
				</View>
			)}
			<View style={styles.inputGroup}>
				<Text style={[styles.index, styles.readingFont]}>
					{props.setIndex + 1}.
				</Text>
				<TextInput
					style={[styles.repsInput, styles.readingFont]}
					value={props.set.reps.toString()}
					editable={!props.set.completed}
				/>
				<Text style={[styles.staticText, styles.readingFont]}>reps at</Text>
				<TextInput
					style={[styles.weightInput, styles.readingFont]}
					value={props.set.weight.toString()}
					editable={!props.set.completed}
				/>
				{props.set.completed ? (
					<Text style={[styles.readingFont, { width: 50 }]}>
						{props.set.weightUnit}
					</Text>
				) : (
					<Picker
						style={{ width: 50 }}
						itemStyle={{ height: 110 }}
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
				)}
				<View style={styles.iconGroup}>
					{props.set.completed ? null : (
						<TouchableHighlight
							onPress={() => {
								props.removeSet(props.setIndex);
							}}
						>
							<Image
								source={require('../../../assets/close.png')}
								style={[styles.actionIcon, styles.removeIcon]}
							/>
						</TouchableHighlight>
					)}
					{props.set.completed ? (
						<TouchableHighlight
							onPress={() => {
								props.updateSet(
									{ ...props.set, completed: false },
									props.setIndex
								);
							}}
						>
							<Image
								source={require('../../../assets/pencil.png')}
								style={[styles.actionIcon, styles.editIcon]}
							/>
						</TouchableHighlight>
					) : (
						<TouchableHighlight
							onPress={() => {
								props.updateSet(
									{ ...props.set, completed: true },
									props.setIndex
								);
							}}
						>
							<Image
								source={require('../../../assets/check.png')}
								style={[styles.actionIcon, styles.completeIcon]}
							/>
						</TouchableHighlight>
					)}
				</View>
			</View>
			{props.set.completed ? null : (
				<View style={styles.actionGroup}>
					<TouchableHighlight
						style={[styles.repsAction, { marginLeft: 5 }]}
						onPress={() => {
							const set = props.set;
							set.reps--;
							props.updateSet(set, props.setIndex);
						}}
					>
						<Text style={styles.updateIcon}>-</Text>
					</TouchableHighlight>
					<TouchableHighlight
						style={[styles.weightAction, { marginLeft: 5 }]}
						onPress={() => {
							props.updateSet(
								{ ...props.set, weight: (props.set.weight -= 2.5) },
								props.setIndex
							);
						}}
					>
						<Text style={styles.updateIcon}>-</Text>
					</TouchableHighlight>
				</View>
			)}
		</View>
	);
});

const styles = StyleSheet.create({
	mainView: {
		flexDirection: 'column',
		marginLeft: 10,
		marginRight: 5,
		marginTop: 5,
		borderColor: borderGray,
		borderTopWidth: 0.5,
		justifyContent: 'space-between'
	},
	readingFont: {
		fontSize: 18
	},
	actionGroup: {
		flexDirection: 'row',
		flex: 1
	},
	inputGroup: {
		flexDirection: 'row',
		flex: 1,
		// justifyContent: 'center',
		alignItems: 'center'
	},
	repsInput: {
		width: 40,
		textAlign: 'center'
	},
	weightInput: {
		width: 80,
		textAlign: 'center'
	},
	updateIcon: {
		color: iosBlue,
		fontSize: 30,
		textAlign: 'center',
		height: 30
	},
	staticText: {
		fontSize: 17,
		paddingLeft: 10,
		paddingRight: 10
	},
	repsAction: {
		left: 43
	},
	weightAction: {
		left: 160
	},
	index: {
		marginRight: 20
	},
	iconGroup: {
		flexDirection: 'column',
		marginLeft: 20
	},
	actionIcon: {
		width: 15,
		height: 15,
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 15,
		marginRight: 15
	},
	removeIcon: {
		tintColor: 'red'
	},
	editIcon: {
		tintColor: iosBlue
	},
	completeIcon: {
		tintColor: successGreen,
		width: 17,
		height: 17
	}
});
