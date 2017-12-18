import React from 'react';
import {
	Button,
	NavigatorIOS,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from 'react-native';
import localData from '../../utils/localData';
import { sortByDisplayName } from '../../utils/sorts';
import ExercisePicker from '../shared/exercisePicker';
import DayPicker from '../shared/dayPicker';
import ExerciseEntry from './exerciseEntry';
import { iosBlue, borderGray } from '../../globals';

export default class WorkoutView extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<NavigatorIOS
				ref="nav"
				initialRoute={{
					component: Workout,
					title: 'Workout'
				}}
				style={{ flex: 1 }}
			/>
		);
	}
}

class Workout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			workout: {
				exercises: []
			},
			showExercisePicker: false,
			showPlanPicker: false,
			planChosen: false,
			refreshPlans: 1,
			refreshing: false
		};
		this._beginWorkout = this._beginWorkout.bind(this);
		this._endWorkout = this._endWorkout.bind(this);
		this._resetState = this._resetState.bind(this);
		this._updateFromLastWorkout = this._updateFromLastWorkout.bind(this);
		this._updateDay = this._updateDay.bind(this);
		this._updateExercise = this._updateExercise.bind(this);
		this._removeExercise = this._removeExercise.bind(this);
	}

	componentDidMount() {
		this._updateFromLastWorkout();
	}

	_updateFromLastWorkout() {
		localData.getItem('lastWorkout').then(lastWorkout => {
			if (lastWorkout) {
				localData.getItem('plan.' + lastWorkout.planId).then(plan => {
					let nextDayIndex = (lastWorkout.dayIndex + 1) % plan.days.length;
					return localData
						.getValues(
							plan.days[nextDayIndex].exercises.map(exercise => {
								return 'exercise.' + exercise.exerciseId;
							})
						)
						.then(exercises =>
							this._updateDay(exercises, lastWorkout.planId, nextDayIndex)
						);
				});
			}
		});
	}

	_updateDay(exercises, planId, dayIndex) {
		this.setState(prevState => {
			prevState.workout.exercises = exercises;
			prevState.workout.planId = planId;
			prevState.workout.dayIndex = dayIndex;
			return prevState;
		});
	}

	render() {
		return (
			<ScrollView
				style={styles.mainView}
				refreshControl={
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={() => {
							this.setState({
								refreshing: true
							});
							this.setState(prevState => {
								prevState.refreshPlans++;
								return prevState;
							}, this.setState({ refreshing: false }));
						}}
					/>
				}
			>
				{!this.state.workout.startTimestamp ? (
					<DayPicker updateDay={this._updateDay} title="Choose Day" />
				) : (
					<View style={styles.placeholder} />
				)}
				<View style={styles.exercises}>
					{this.state.workout.exercises.map((exercise, index) => {
						return (
							<ExerciseEntry
								exercise={exercise}
								exerciseIndex={index}
								key={index}
								updateExercise={this._updateExercise}
								removeExercise={this._removeExercise}
								workoutStarted={this.state.workout.startTimestamp !== undefined}
							/>
						);
					})}
				</View>

				{this.state.showExercisePicker ? (
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
				) : (
					<TouchableHighlight
						onPress={() => {
							this.setState(prevState => {
								prevState.showExercisePicker = true;
								return prevState;
							});
						}}
						title="Add Exercise"
						style={styles.addExercise}
					>
						<Text style={styles.addExerciseText}>Add Exercise</Text>
					</TouchableHighlight>
				)}
				<View style={styles.actions}>
					<View style={styles.button}>
						{this.state.workout.startTimestamp ? (
							<Button
								title="End Workout"
								onPress={this._endWorkout}
								color="red"
							/>
						) : (
							<Button
								title="Begin Workout"
								onPress={this._beginWorkout}
								color="#16ad05"
							/>
						)}
					</View>
				</View>
			</ScrollView>
		);
	}

	_beginWorkout() {
		this.setState((prevState, props) => {
			prevState.workout.startTimestamp = new Date().getTime().toString();
		}, this._saveWorkout);
	}

	_endWorkout() {
		this.setState(
			(prevState, props) => {
				prevState.workout.endTimestamp = new Date().getTime().toString();
				prevState.workout.exercises = prevState.workout.exercises.filter(
					exercise => exercise.sets.length > 0
				);
			},
			() => {
				this._saveWorkout();
				localData
					.setItem(
						'lastWorkout',
						JSON.stringify({
							workoutId: this.state.workout.id,
							planId: this.state.workout.planId,
							dayIndex: this.state.workout.dayIndex
						})
					)
					.then(this._resetState);
			}
		);
	}

	_resetState() {
		this.setState(prevState => {
			prevState.workout = {
				exercises: []
			};
			prevState.planChosen = false;
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

	_updateExercise(exercise, index) {
		// if (exercise.sets.length > 0) {
		// 	exercise.heaviestSet = exercise.sets[0];
		// 	for (var i = 1; i < exercise.sets.length - 1; i++) {
		// 		if (exercise.heaviestSet.weight < exercise.sets[i].weight) {
		// 			exercise.heaviestSet = exercise.sets[i];
		// 		}
		// 	}
		// 	localData.getItem('exercise.' + exercise.id).then(currentExercise => {
		// 		if (
		// 			!currentExercise.heaviestSet ||
		// 			currentExercise.heaviestSet.weight < exercise.heaviestSet.weight
		// 		) {
		// 			localData.mergeItem(
		// 				'exercise.' + exercise.id,
		// 				JSON.stringify({
		// 					heaviestSet: exercise.heaviestSet
		// 				})
		// 			);
		// 		}
		// 	});
		// }
		this.setState(prevState => {
			prevState.workout.exercises[index] = exercise;
			return prevState;
		}, this._saveWorkout);
	}

	_removeExercise(exerciseIndex) {
		let exercises = this.state.workout.exercises;
		exercises.splice(exerciseIndex, 1);
		this.setState(prevState => {
			prevState.workout.exercises = exercises;
			return prevState;
		}, this._saveWorkout);
	}
}

const styles = StyleSheet.create({
	mainView: {
		flex: 1
	},
	exercises: {
		marginTop: 10
	},
	actions: {
		marginTop: 65
	},
	button: {
		borderColor: borderGray,
		borderTopWidth: 0.5,
		marginLeft: 10,
		paddingTop: 10,
		paddingBottom: 10
	},
	placeholder: {
		backgroundColor: '#f0f0f0',
		height: 31
	},
	addExercise: {},
	addExerciseText: {
		color: iosBlue,
		textAlign: 'center',
		fontSize: 16
	}
});
