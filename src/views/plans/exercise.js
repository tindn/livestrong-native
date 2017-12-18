import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableHighlight,
	StyleSheet,
	Image
} from 'react-native';
import { iosBlue, borderGray } from '../../globals';

export default (Exercise = props => {
	return (
		<View style={styles.exercise}>
			<View style={styles.ordering}>
				<TouchableHighlight
					onPress={() => props.orderUp(props.exerciseIndex)}
					style={styles.orderUp}
				>
					<Image
						source={require('../../../assets/chevron-up.png')}
						style={styles.chevron}
					/>
				</TouchableHighlight>
				<TouchableHighlight
					onPress={() => props.orderDown(props.exerciseIndex)}
					style={styles.orderDown}
				>
					<Image
						source={require('../../../assets/chevron-down.png')}
						style={styles.chevron}
					/>
				</TouchableHighlight>
			</View>
			<View style={styles.exerciseInformation}>
				<Text style={styles.exerciseName}>{props.exercise.displayName}</Text>
				<View style={styles.details}>
					<TextInput
						style={styles.detailInput}
						defaultValue={props.exercise.sets.toString()}
						keyboardType="numeric"
						onChangeText={value => _updateValue('sets', value, props)}
						selectTextOnFocus={true}
					/>
					<Text style={styles.detailLabel}>sets</Text>
					<Text style={styles.detailLabel}>
						&nbsp;&nbsp;&nbsp;x&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					</Text>
					<TextInput
						style={styles.detailInput}
						defaultValue={props.exercise.reps.toString()}
						keyboardType="numeric"
						onChangeText={value => _updateValue('reps', value, props)}
						selectTextOnFocus={true}
					/>
					<Text style={styles.detailLabel}>reps</Text>
				</View>
			</View>

			<TouchableHighlight
				style={styles.deleteButton}
				onPress={() => _deleteExercise(props)}
			>
				<Image
					source={require('../../../assets/close.png')}
					style={styles.deleteImage}
				/>
			</TouchableHighlight>
		</View>
	);
});

const _updateValue = (key, value, props) => {
	value = Number.parseInt(value);
	if (Number.isNaN(value)) {
		return;
	}
	const updatedExercise = Object.assign({}, props.exercise);
	updatedExercise[key] = value;
	props.updateExercise(updatedExercise, props.exerciseIndex, props.dayIndex);
};

const _deleteExercise = props => {
	props.deleteExercise(props.exerciseIndex, props.dayIndex);
};

const styles = StyleSheet.create({
	exercise: {
		paddingBottom: 5,
		marginLeft: 15,
		paddingTop: 15,
		flexDirection: 'row',
		borderColor: borderGray,
		borderTopWidth: 0.5
	},
	exerciseInformation: {
		flex: 8
	},
	exerciseName: {
		fontSize: 18,
		marginBottom: 15
	},
	details: {
		flexDirection: 'row'
	},
	detailInput: {
		height: 20,
		fontSize: 18,
		width: 25
	},
	detailLabel: {
		width: 40,
		fontSize: 18
	},
	deleteButton: {
		flex: 1,
		marginTop: 10
	},
	deleteImage: {
		tintColor: 'red',
		width: 18,
		height: 18
	},
	ordering: {
		flex: 1,
		flexDirection: 'column'
	},
	orderUp: {
		flex: 1
	},
	orderDown: {
		flex: 1
	},
	chevron: {
		tintColor: iosBlue,
		width: 18,
		height: 18
	}
});
