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
import { iosBlue, borderGray, successGreen } from '../../globals';
import { UIManager } from 'NativeModules';

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

export class Workout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			workout: props.workout || {
				exercises: []
			},
			showExercisePicker: false,
			showPlanPicker: false,
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
		this._updateHeaviestSet = this._updateHeaviestSet.bind(this);
	}

	componentDidMount() {
		localData.getItem('currentWorkout').then(currentWorkoutId => {
			if (currentWorkoutId) {
				localData.getItem(currentWorkoutId).then(currentWorkout => {
					this.setState({ workout: currentWorkout });
				});
			} else {
				this._updateFromLastWorkout();
			}
		});
	}

	_updateFromLastWorkout() {
		localData.getItem('lastWorkout').then(lastWorkout => {
			if (!lastWorkout) return;
			if (!lastWorkout.planId) return;
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
				ref="scrollView"
			>
				{!this.state.workout.startTimestamp ? (
					<DayPicker
						updateDay={this._updateDay}
						title={this.state.workout.planId ? 'Change Plan' : 'Pick from plan'}
					/>
				) : null}
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
							this.setState(
								prevState => {
									prevState.showExercisePicker = true;
									return prevState;
								},
								() => {
									UIManager.measure(
										this.refs.scrollView.getInnerViewNode(),
										(...data) => {
											this.refs.scrollView.scrollTo({
												x: 0,
												y: data[3] - 120,
												animated: true
											});
										}
									);
								}
							);
						}}
						title="Add Exercise"
						style={styles.addExercise}
					>
						<Text style={styles.addExerciseText}>Add Exercise</Text>
					</TouchableHighlight>
				)}
				<View style={styles.actions}>
					{!this.state.workout.startTimestamp ? (
						<View style={styles.button}>
							<Button
								title="Begin Workout"
								onPress={this._beginWorkout}
								color={successGreen}
							/>
						</View>
					) : null}
					{this.state.workout.startTimestamp &&
					!this.state.workout.endTimestamp ? (
						<View style={styles.button}>
							<Button
								title="End Workout"
								onPress={this._endWorkout}
								color="red"
							/>
						</View>
					) : null}
					{!this.state.workout.startTimestamp && this.state.workout.planId ? (
						<View style={styles.button}>
							<Button
								title="Clear Plan"
								onPress={() => {
									this.setState({
										...this.state,
										workout: {
											exercises: []
										}
									});
								}}
								color="red"
							/>
						</View>
					) : null}
				</View>
			</ScrollView>
		);
	}

	_beginWorkout() {
		this.setState(
			(prevState, props) => {
				prevState.workout.startTimestamp = new Date().getTime().toString();
			},
			() => {
				this._saveWorkout().then(workout => {
					localData.setItem('currentWorkout', `workout.${workout.id}`);
				});
			}
		);
	}

	_endWorkout() {
		this._updateHeaviestSet();
		this.setState(
			(prevState, props) => {
				prevState.workout.endTimestamp = new Date().getTime().toString();
				prevState.workout.exercises = prevState.workout.exercises.reduce(
					(acc, exercise) => {
						if (exercise.sets.length > 0) {
							delete exercise.heaviestSet;
							acc.push(exercise);
						}
						return acc;
					},
					[]
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
				localData.deleteItem('currentWorkout');
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
		return localData.saveWorkout(this.state.workout).then(workout => {
			this.setState(prevState => {
				prevState.workout = workout;
				return prevState;
			});
			return workout;
		});
	}

	_updateExercise(exercise, index) {
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

	_updateHeaviestSet() {
		this.state.workout.exercises.forEach(exercise => {
			let heaviestSet = null;
			exercise.sets.forEach(set => {
				if (!heaviestSet || set.weight > heaviestSet.weight) {
					heaviestSet = Object.assign({}, set);
				}
			});
			if (heaviestSet) {
				localData.getItem('exercise.' + exercise.id).then(currentExercise => {
					if (
						!currentExercise.heaviestSet ||
						currentExercise.heaviestSet.weight < heaviestSet.weight
					) {
						localData.mergeItem(
							'exercise.' + exercise.id,
							JSON.stringify({
								heaviestSet: heaviestSet
							})
						);
					}
				});
			}
		});
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
	addExerciseText: {
		color: iosBlue,
		textAlign: 'center',
		fontSize: 16
	}
});
