import React from 'react';
import {
	FlatList,
	NavigatorIOS,
	Text,
	StyleSheet,
	TouchableHighlight,
	View
} from 'react-native';
import localData from '../../utils/localData';
import WorkoutView from './workoutView';
import { sortByStartTimestamp } from '../../utils/sorts';

export default class WorkoutsView extends React.Component {
	render() {
		return (
			<NavigatorIOS
				ref="nav"
				initialRoute={{
					component: WorkoutList,
					title: 'Workouts'
				}}
				style={styles.workoutsView}
			/>
		);
	}
}

class WorkoutList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			workouts: [],
			refreshing: false
		};
	}

	_updateList() {
		this.setState({ refreshing: true });
		localData.getAllWorkouts().then(workouts => {
			workouts = workouts.map((workout, index) => {
				workout.key = index;
				return workout;
			});
			let sortedWorkouts = workouts.sort(sortByStartTimestamp);
			this.setState(prevState => {
				prevState.workouts = sortedWorkouts;
				return prevState;
			}, this.setState({ refreshing: false }));
		});
	}

	componentDidMount() {
		this._updateList();
	}

	componentWillReceiveProps() {
		this._updateList();
	}

	render() {
		return (
			<FlatList
				data={this.state.workouts}
				renderItem={({ item }) => this.renderWorkout(item)}
				refreshing={this.state.refreshing}
				onRefresh={this._updateList.bind(this)}
			/>
		);
	}

	renderWorkout(workout) {
		return (
			<TouchableHighlight
				onPress={() => this._workoutPressed(workout)}
				underlayColor="#e2e2e2"
			>
				<View style={styles.workout}>
					<Text>
						{new Date(parseInt(workout.startTimestamp)).toString()}
					</Text>
				</View>
			</TouchableHighlight>
		);
	}

	_workoutPressed(workout) {
		this.props.navigator.push({
			title: 'Workout',
			component: WorkoutView,
			passProps: {
				workout: workout
			}
		});
	}
}

const styles = StyleSheet.create({
	workoutsView: {
		flex: 1
	},
	workout: {
		borderColor: '#B5B9C2',
		borderBottomWidth: 0.5,
		paddingLeft: 7,
		paddingBottom: 15,
		paddingTop: 20,
		marginLeft: 10
	}
});
