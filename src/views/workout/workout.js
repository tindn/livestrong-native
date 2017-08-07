import React from 'react';
import {
	Button,
	Picker,
	View,
	Text,
	TouchableHighlight,
	ScrollView,
	StyleSheet,
	AsyncStorage
} from 'react-native';
import localData from '../../utils/localData';
import { sortByDisplayName } from '../../utils/sorts';
import ExercisePicker from '../shared/exercisePicker';
import ExerciseEntry from './exerciseEntry';

export default class WorkoutView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedPlanId: null,
			allPlans: [],
			selectedPlanIndex: -1,
			allDays: [],
			selectedDayIndex: -1,
			workout: {
				exercises: []
			},
			showExercisePicker: false,
			showPlanPicker: false
		};
		this._beginWorkout = this._beginWorkout.bind(this);
		this._endWorkout = this._endWorkout.bind(this);
		this._resetState = this._resetState.bind(this);
		this._updateFromLastWorkout = this._updateFromLastWorkout.bind(this);
	}

	componentDidMount() {
		localData
			.getAllPlans()
			.then(plans => {
				this.setState(prevState => {
					prevState.allPlans = plans;
					return prevState;
				});
			})
			.then(this._updateFromLastWorkout);
	}

	_updateFromLastWorkout() {
		localData.getItem('lastWorkout').then(lastWorkout => {
			if (lastWorkout) {
				this.setState(prevState => {
					let lastWorkoutPlanIndex = prevState.allPlans.findIndex(
						plan => plan.id === lastWorkout.planId
					);
					prevState.selectedPlanIndex = lastWorkoutPlanIndex;
					prevState.selectedPlanId =
						prevState.allPlans[lastWorkoutPlanIndex].id;
					prevState.selectedDayIndex =
						(lastWorkout.dayIndex + 1) %
						prevState.allPlans[lastWorkoutPlanIndex].days.length;
					prevState.allDays = prevState.allPlans[lastWorkoutPlanIndex].days;
					return prevState;
				});
			}
		});
	}

	render() {
		let exercisePicker = null;
		if (this.state.showExercisePicker) {
			exercisePicker = (
				<ExercisePicker
					addExercise={exercise => {
						this.setState(prevState => {
							prevState.workout.exercises.push(exercise);
							prevState.showExercisePicker = false;
							return prevState;
						});
					}}
					cancelPicker={() => {
						this.setState(prevState => {
							prevState.showExercisePicker = false;
							return prevState;
						});
					}}
				/>
			);
		}
		let beginButton = null;
		if (!this.state.workout.startTimestamp) {
			beginButton = (
				<Button title="Begin Workout" onPress={this._beginWorkout} />
			);
		}
		let endButton = null;
		if (this.state.workout.startTimestamp) {
			endButton = <Button title="End Workout" onPress={this._endWorkout} />;
		}

		let planButton = null;
		if (!this.state.workout.startTimestamp && !this.state.showPlanPicker) {
			planButton = (
				<Button
					title="Choose plan"
					onPress={() => {
						this.setState(prevState => {
							prevState.showPlanPicker = true;
							return prevState;
						});
					}}
				/>
			);
		}
		let planPicker = null;
		if (this.state.showPlanPicker) {
			planPicker = (
				<View>
					<View style={{ flexDirection: 'row' }}>
						<Picker
							style={{ flex: 1 }}
							selectedValue={this.state.selectedPlanIndex}
							onValueChange={value => {
								this.setState(prevState => {
									prevState.selectedPlanIndex = value;
									if (value !== '-1') {
										prevState.selectedPlanId = prevState.allPlans[value].id;
										prevState.allDays = this.state.allPlans[value].days;
									}
									return prevState;
								});
							}}
						>
							<Picker.Item key={-1} label="" value="-1" />
							{this.state.allPlans.map((plan, index) => {
								return (
									<Picker.Item
										key={index}
										label={plan.displayName}
										value={index}
									/>
								);
							})}
						</Picker>
						<Picker
							style={{ flex: 1 }}
							selectedValue={this.state.selectedDayIndex}
							onValueChange={value => {
								this.setState(prevState => {
									prevState.selectedDayIndex = value;
									return prevState;
								});
							}}
						>
							<Picker.Item key={-1} label="" value="-1" />
							{this.state.allDays.map((day, index) => {
								if (!day.name) {
									day.name = 'Day ' + (index + 1);
								}
								return (
									<Picker.Item key={index} value={index} label={day.name} />
								);
							})}
						</Picker>
					</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}
					>
						<Button
							title="Cancel"
							onPress={() => {
								this.setState(prevState => {
									prevState.showPlanPicker = false;
									prevState.allDays = [];
									prevState.selectedPlanId = null;
									prevState.selectedPlanIndex = -1;
									prevState.selectedDayIndex = -1;
									return prevState;
								});
							}}
							color="red"
						/>
						<Button
							title="Select"
							onPress={() => {
								if (
									this.state.allPlans[this.state.selectedPlanIndex].days[
										this.state.selectedDayIndex
									]
								) {
									localData
										.getValues(
											this.state.allPlans[this.state.selectedPlanIndex].days[
												this.state.selectedDayIndex
											].exercises.map(exercise => {
												return 'exercise.' + exercise.exerciseId;
											})
										)
										.then(exercises => {
											this.setState(prevState => {
												prevState.workout.exercises = exercises;
												prevState.showPlanPicker = false;
												return prevState;
											});
										});
								}
							}}
						/>
					</View>
				</View>
			);
		}
		return (
			<ScrollView style={{ flex: 1, marginTop: 0 }}>
				{planButton}
				{planPicker}

				{this.state.workout.exercises.map((exercise, index) => {
					return (
						<ExerciseEntry
							exercise={exercise}
							exerciseIndex={index}
							key={index}
							updateExercise={(exercise, index) => {
								this.setState(prevState => {
									prevState.workout.exercises[index] = exercise;
									return prevState;
								}, this._saveWorkout);
							}}
						/>
					);
				})}
				<Button
					onPress={() => {
						this.setState(prevState => {
							prevState.showExercisePicker = true;
							return prevState;
						});
					}}
					title="Add Exercise"
				/>
				{exercisePicker}
				{beginButton}
				{endButton}
			</ScrollView>
		);
	}

	_beginWorkout() {
		this.setState((prevState, props) => {
			prevState.workout.startTimestamp = new Date().getTime().toString();
		}, this._saveWorkout);
	}

	_endWorkout() {
		localData
			.setItem(
				'lastWorkout',
				JSON.stringify({
					workoutId: this.state.workout.id,
					planId: this.state.selectedPlanId,
					dayIndex: this.state.selectedDayIndex
				})
			)
			.then(this._resetState);
	}

	_resetState() {
		this.setState(prevState => {
			prevState.selectedPlanId = null;
			prevState.selectedPlanIndex = -1;
			prevState.allDays = [];
			prevState.selectedDayIndex = -1;
			prevState.workout = {
				exercises: []
			};
			return prevState;
		}, this._updateFromLastWorkout);
	}

	_saveWorkout() {
		if (!this.state.workout.startTimestamp) {
			return;
		}
		localData.saveWorkout(this.state.workout).then(workout => {
			this.setState(prevState => {
				prevState.workout = workout;
				return prevState;
			});
		});
	}
}
