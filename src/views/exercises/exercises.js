import React from 'react';
import {
	FlatList,
	NavigatorIOS,
	Text,
	TouchableHighlight,
	View
} from 'react-native';
import Exercise from './exercise';
import localData from '../../utils/localData';
import { sortByDisplayName } from '../../utils/sorts';
import { FlatListStyles } from '../../styles';

export default class ExercisesView extends React.Component {
	render() {
		return (
			<NavigatorIOS
				ref="nav"
				initialRoute={{
					component: ExerciseList,
					title: 'Exercises',
					rightButtonTitle: 'New',
					onRightButtonPress: () => this._newExerciseButtonPressed()
				}}
				style={FlatListStyles.listView}
			/>
		);
	}

	_newExerciseButtonPressed() {
		this.refs.nav.push({
			component: Exercise,
			title: 'New Exercise'
		});
	}
}

class ExerciseList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			exercises: [],
			refreshing: false
		};
		this._exercisePressed = this._exercisePressed.bind(this);
	}

	_updateList() {
		this.setState({ refreshing: true });
		localData.getAllExercises().then(exercises => {
			exercises = exercises.map((exercise, index) => {
				exercise.key = index;
				return exercise;
			});
			let sortedExercises = exercises.sort(sortByDisplayName);
			this.setState(prevState => {
				prevState.exercises = exercises;
				prevState.refreshing = false;
				return prevState;
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
			<FlatList
				data={this.state.exercises}
				renderItem={({ item }) => this.renderExercise(item)}
				refreshing={this.state.refreshing}
				onRefresh={this._updateList.bind(this)}
			/>
		);
	}

	renderExercise(exercise) {
		return (
			<TouchableHighlight
				onPress={() => this._exercisePressed(exercise)}
				underlayColor="#e2e2e2"
			>
				<View style={FlatListStyles.listItem}>
					<Text style={FlatListStyles.itemTitle}>{exercise.displayName}</Text>
				</View>
			</TouchableHighlight>
		);
	}

	_exercisePressed(exercise) {
		this.props.navigator.push({
			title: exercise.displayName,
			component: Exercise,
			passProps: {
				exercise: exercise
			},
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			leftButtonTitle: '< Back'
		});
	}
}
