import React from 'react';
import { StyleSheet, TabBarIOS, View, Text, AsyncStorage } from 'react-native';
import ExercisesView from './views/exercises/exercises';
import SettingsView from './views/settings/settings';
import PlansView from './views/plans/plans';
import WorkoutView from './views/workout/workout';
import WorkoutsView from './views/workouts/workouts';

export default class LivestrongNative extends React.Component {
	constructor() {
		super();
		this.state = {
			selectedTab: 'Workout'
		};
	}

	_selectTab(tab) {
		this.setState({
			selectedTab: tab
		});
	}

	render() {
		return (
			<TabBarIOS>
				<TabBarIOS.Item
					title="Exercises"
					icon={require('../assets/list.png')}
					selected={this.state.selectedTab === 'Exercises'}
					onPress={() => this._selectTab('Exercises')}
				>
					<ExercisesView />
				</TabBarIOS.Item>
				<TabBarIOS.Item
					title="Plans"
					icon={require('../assets/calendar.png')}
					selected={this.state.selectedTab === 'Plans'}
					onPress={() => this._selectTab('Plans')}
				>
					<PlansView />
				</TabBarIOS.Item>
				<TabBarIOS.Item
					title="Workout"
					icon={require('../assets/play.png')}
					selected={this.state.selectedTab === 'Workout'}
					onPress={() => this._selectTab('Workout')}
				>
					<WorkoutView />
				</TabBarIOS.Item>
				<TabBarIOS.Item
					title="Workouts"
					icon={require('../assets/chart.png')}
					selected={this.state.selectedTab === 'Workouts'}
					onPress={() => this._selectTab('Workouts')}
				>
					<WorkoutsView />
				</TabBarIOS.Item>
				<TabBarIOS.Item
					title="Settings"
					icon={require('../assets/gear.png')}
					selected={this.state.selectedTab === 'Settings'}
					onPress={() => this._selectTab('Settings')}
				>
					<SettingsView />
				</TabBarIOS.Item>
			</TabBarIOS>
		);
	}
}
