import React from 'react';
import {
	FlatList,
	NavigatorIOS,
	Text,
	TouchableHighlight,
	View
} from 'react-native';
import localData from '../../utils/localData';
import WorkoutView from './workoutView';
import { sortByStartTimestamp } from '../../utils/sorts';
import { ListStyles } from '../../styles';

export default class WorkoutsView extends React.Component {
	render() {
		return (
			<NavigatorIOS
				ref="nav"
				initialRoute={{
					component: WorkoutList,
					title: 'Workouts'
				}}
				style={ListStyles.listView}
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
		const workoutDate = new Date(parseInt(workout.startTimestamp));
		return (
			<TouchableHighlight
				onPress={() =>
					this._workoutPressed(workoutDate.toDateString(), workout)}
				underlayColor="#e2e2e2"
			>
				<View style={ListStyles.listItem}>
					<Text>
						{`${workoutDate.toDateString()} ${workoutDate.toLocaleTimeString()}`}
					</Text>
				</View>
			</TouchableHighlight>
		);
	}

	_workoutPressed(title, workout) {
		this.props.navigator.push({
			title,
			component: WorkoutView,
			passProps: {
				workout
			}
		});
	}
}
