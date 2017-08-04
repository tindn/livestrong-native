import React from 'react';
import {
	Button,
	View,
	Text,
	ScrollView,
	StyleSheet,
	AsyncStorage
} from 'react-native';
import localData from '../../utils/localData';
import { sortByDisplayName } from '../../utils/sorts';

export default class WorkoutView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activePlan: null,
			lastWorkout: null,
			workoutDayIndex: 0,
			workoutStarted: false,
			workout: {
				exercises: []
			}
		};
		this._beginWorkout = this._beginWorkout.bind(this);
	}

	componentDidMount() {
		localData
			.getItem('activePlan')
			.then(activePlan => {
				if (activePlan) {
					localData.getItem(activePlan).then(plan => {
						this.setState((prevState, props) => {
							prevState.activePlan = plan;
							return prevState;
						});
					});
				}
			})
			.then(() => {
				return localData.getItem('lastWorkout').then(lastWorkout => {
					return this.setState((prevState, props) => {
						prevState.lastWorkout = lastWorkout;
						return prevState;
					});
				});
			})
			.then(() => {
				if (this.state.activePlan.id === this.state.lastWorkout.planId) {
					let dayIndex =
						(this.state.lastWorkout.dayIndex + 1) %
						this.state.activePlan.days.length;
					this.setState((prevState, props) => {
						prevState.workoutDayIndex = dayIndex;
						return prevState;
					});
					let exerciseIds = this.state.activePlan.days[
						dayIndex
					].exercises.map(ex => {
						return 'exercise.' + ex.exerciseId;
					});
					localData.getValues(exerciseIds).then(exercises => {
						this.setState((prevState, props) => {
							prevState.workout.exercises = exercises;
							return prevState;
						});
					});
				}
			});
	}

	componentWillReceiveProps() {
		console.log('received props');
	}
	render() {
		let plan = null;
		if (!this.state.activePlan) {
			plan = (
				<View>
					<Text>Please choose an active plan</Text>
				</View>
			);
		} else {
			plan = (
				<View>
					<Text>
						Current active plan is {this.state.activePlan.displayName}
					</Text>
					<View>
						<Text>
							{`Upcoming workout is day # ${this.state.workoutDayIndex + 1}`}
						</Text>
					</View>
					<Button title="Begin Workout" onPress={this._beginWorkout} />
					<Button
						title="Remove Active Plan"
						onPress={() => {
							AsyncStorage.removeItem('activePlan');
						}}
					/>
				</View>
			);
		}
		return (
			<ScrollView style={{ flex: 1, marginTop: 0 }}>
				{plan}
				{this.state.workout.exercises.map(exercise => {
					return (
						<View>
							<Text>
								{exercise.displayName}
							</Text>
						</View>
					);
				})}
			</ScrollView>
		);
	}

	_beginWorkout() {
		this.setState((prevState, props) => {
			prevState.workoutStarted = true;
		});
		localData.setItem(
			'lastWorkout',
			JSON.stringify({
				planId: this.state.activePlan.id,
				dayIndex: this.state.workoutDayIndex
			})
		);
	}
}
