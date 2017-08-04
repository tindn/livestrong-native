import React from 'react';
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableHighlight,
	Image
} from 'react-native';
import localData from '../../utils/localData';
import ExercisePicker from '../shared/exercisePicker';
import Exercise from './exercise';
import { sortByDisplayName } from '../../utils/sorts';

export default class Day extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			day: props.day,
			showExercisePicker: false,
			allExercises: []
		};
		this._updateExercises(props.day.exercises);
		this._toggleExercisePicker = this._toggleExercisePicker.bind(this);
		this._addExercise = this._addExercise.bind(this);
		this._updateDayName = this._updateDayName.bind(this);
	}

	_updateExercises(exercises) {
		var promises = exercises.map(function(exercise) {
			return localData.getExercise(exercise.exerciseId).then(function(ex) {
				exercise = Object.assign(exercise, ex);
				return exercise;
			});
		});
		Promise.all(promises).then(
			function(results) {
				this.setState(prevState => {
					return { exercises: results };
				});
			}.bind(this)
		);
	}

	render() {
		let exercisePicker = null;
		if (this.state.showExercisePicker) {
			exercisePicker = (
				<ExercisePicker
					allExercises={this.state.allExercises}
					addExercise={this._addExercise}
					cancelPicker={this._toggleExercisePicker}
				/>
			);
		}
		let addExerciseIcon = null;
		if (!this.state.showExercisePicker) {
			addExerciseIcon = (
				<TouchableHighlight
					onPress={this._toggleExercisePicker}
					style={styles.addButton}
				>
					<Image
						source={require('../../../assets/plus.png')}
						style={styles.addImage}
					/>
				</TouchableHighlight>
			);
		}
		return (
			<View style={styles.day}>
				<View style={styles.header}>
					<TextInput
						style={styles.dayTitle}
						placeholder={`Day ${this.props.dayIndex + 1}`}
						value={this.state.day.name}
						onChangeText={this._updateDayName}
					/>
					<TouchableHighlight
						onPress={() => this.props.removeDay(this.props.dayIndex)}
					>
						<Text style={styles.removeDay}>Remove</Text>
					</TouchableHighlight>
				</View>
				<View style={styles.content}>
					{this._renderExercises(this.state.day.exercises)}
				</View>
				{addExerciseIcon}
				{exercisePicker}
			</View>
		);
	}

	_renderExercises(exercises) {
		return exercises.map(
			function(exercise, index) {
				return (
					<Exercise
						key={index}
						exerciseIndex={index}
						dayIndex={this.props.dayIndex}
						exercise={exercise}
						updateExercise={this.props.updateExercise}
						deleteExercise={this.props.deleteExercise}
					/>
				);
			}.bind(this)
		);
	}

	_toggleExercisePicker() {
		if (
			!this.state.showExercisePicker &&
			(this.state.allExercises === undefined ||
				this.state.allExercises.length === 0)
		) {
			localData.getAllExercises().then(exercises => {
				this.setState({
					allExercises: exercises.sort(sortByDisplayName)
				});
			});
		}
		this.setState(prevState => {
			prevState.showExercisePicker = !prevState.showExercisePicker;
			return prevState;
		});
	}

	_addExercise(exercise) {
		this.setState(
			prevState => {
				prevState.day.exercises.push({
					exerciseId: exercise.id,
					sets: 3,
					reps: 8
				});
				return prevState;
			},
			() => {
				this.props.updateDay(this.state.day, this.props.dayIndex);
			}
		);
		this._toggleExercisePicker();
	}

	_updateDayName(dayName) {
		this.setState(
			prevState => {
				prevState.day.name = dayName;
				return prevState;
			},
			() => {
				this.props.updateDay(this.state.day, this.props.dayIndex);
			}
		);
	}
}

const styles = StyleSheet.create({
	day: {
		marginBottom: 20
	},
	header: {
		flexDirection: 'row',
		backgroundColor: '#e9e9e9',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 10
	},
	dayTitle: {
		flex: 1,
		fontSize: 18
	},
	removeDay: {
		width: 60,
		fontSize: 15,
		color: 'red'
	},
	content: {
		paddingLeft: 10,
		paddingTop: 5
	},
	addButton: {
		alignSelf: 'center',
		marginTop: 10
	},
	addImage: {
		tintColor: '#007AFF',
		width: 18,
		height: 18
	}
});
