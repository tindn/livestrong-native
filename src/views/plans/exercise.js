import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableHighlight,
	StyleSheet,
	Image
} from 'react-native';

export default (Exercise = props => {
	return (
		<View style={styles.exercise}>
			<View style={styles.exerciseInformation}>
				<Text style={styles.exerciseName}>
					{props.exercise.displayName}
				</Text>
				<View style={styles.details}>
					<TextInput
						style={styles.detailInput}
						defaultValue={props.exercise.sets.toString()}
						keyboardType="numeric"
						onChangeText={value => _updateValue('sets', value, props)}
						selectTextOnFocus={true}
					/>
					<Text style={styles.detailLabel}>sets</Text>
					<Text>x&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
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
		marginBottom: 10,
		flexDirection: 'row'
	},
	exerciseInformation: {
		width: '90%'
	},
	exerciseName: {
		fontWeight: 'bold',
		fontSize: 15,
		marginTop: 5,
		marginBottom: 5
	},
	details: {
		flexDirection: 'row'
	},
	detailInput: {
		height: 20,
		fontSize: 16,
		width: 25
	},
	detailLabel: {
		width: 40
	},
	deleteButton: {
		width: '10%',
		marginTop: 10
	},
	deleteImage: {
		tintColor: 'red',
		width: 18,
		height: 18
	}
});
