import React from 'react';
import {
	Button,
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
import { iosBlue } from '../../globals';

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
		this._orderUp = this._orderUp.bind(this);
		this._orderDown = this._orderDown.bind(this);
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
				<View>{this._renderExercises(this.state.day.exercises)}</View>
				{this.state.showExercisePicker ? (
					<ExercisePicker
						allExercises={this.state.allExercises}
						addExercise={this._addExercise}
						cancelPicker={this._toggleExercisePicker}
					/>
				) : (
					<TouchableHighlight
						onPress={this._toggleExercisePicker}
						style={styles.addButton}
					>
						<Text style={styles.addText}>Add Exercise</Text>
					</TouchableHighlight>
				)}
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
						orderUp={this._orderUp}
						orderDown={this._orderDown}
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
				prevState.day.exercises.push(
					Object.assign(exercise, {
						exerciseId: exercise.id,
						sets: 3,
						reps: 8
					})
				);
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

	_orderUp(exerciseIndex) {
		if (exerciseIndex === 0) {
			return;
		}
		let replaced = this.state.day.exercises[exerciseIndex - 1];
		let replacing = this.state.day.exercises[exerciseIndex];
		this.setState(
			prevState => {
				prevState.day.exercises[exerciseIndex] = replaced;
				prevState.day.exercises[exerciseIndex - 1] = replacing;
				return prevState;
			},
			() => {
				this.props.updateDay(this.state.day, this.props.dayIndex);
			}
		);
	}

	_orderDown(exerciseIndex) {
		if (exerciseIndex === this.state.day.exercises.length - 1) {
			return;
		}
		let replaced = this.state.day.exercises[exerciseIndex + 1];
		let replacing = this.state.day.exercises[exerciseIndex];
		this.setState(
			prevState => {
				prevState.day.exercises[exerciseIndex] = replaced;
				prevState.day.exercises[exerciseIndex + 1] = replacing;
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
		marginBottom: 30
	},
	header: {
		flexDirection: 'row',
		paddingTop: 7,
		paddingBottom: 7,
		paddingLeft: 10
	},
	dayTitle: {
		flex: 1,
		fontSize: 18,
		fontWeight: 'bold'
	},
	removeDay: {
		width: 60,
		fontSize: 16,
		color: 'red'
	},
	addButton: {
		alignSelf: 'center',
		marginTop: 20
	},
	addText: {
		color: iosBlue,
		fontSize: 18
	},
	addImage: {
		tintColor: iosBlue,
		width: 18,
		height: 18
	}
});
