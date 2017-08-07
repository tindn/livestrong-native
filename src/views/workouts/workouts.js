import React from 'react';
import {
	View,
	ListView,
	StyleSheet,
	Text,
	TouchableHighlight,
	NavigatorIOS
} from 'react-native';
import localData from '../../utils/localData';

export default class WorkoutsView extends React.Component {
	render() {
		return (
			<NavigatorIOS
				ref="nav"
				initialRoute={{
					component: WorkoutList,
					title: 'Workouts'
				}}
				style={{ flex: 1 }}
			/>
		);
	}
}

class WorkoutList extends React.Component {
	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.state = {
			dataSource: this.ds.cloneWithRows([])
		};
	}

	_updateList() {
		localData.getAllWorkouts().then(workouts => {
			this.setState({
				dataSource: this.ds.cloneWithRows(workouts)
			});
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
			<ListView
				dataSource={this.state.dataSource}
				renderRow={workout => this.renderWorkout(workout)}
				contentInset={{ bottom: 49 }}
				enableEmptySections={true}
			/>
		);
	}

	renderWorkout(workout) {
		return (
			<View>
				<Text>
					{new Date(parseInt(workout.startTimestamp)).toString()}
				</Text>
			</View>
		);
	}
}
