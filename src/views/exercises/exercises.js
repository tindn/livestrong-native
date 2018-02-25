import React from 'react';
import {
	FlatList,
	NavigatorIOS,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from 'react-native';
import Exercise from './exercise';
import localData from '../../utils/localData';
import { sortByDisplayName } from '../../utils/sorts';
import { ListStyles } from '../../styles';
import PropTypes from 'prop-types';

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
				style={ListStyles.listView}
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
				exercise.key = index.toString();
				return exercise;
			});
			let sortedExercises = exercises.sort(sortByDisplayName);
			this.setState(prevState => {
				prevState.exercises = sortedExercises;
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
				ListEmptyComponent={() => (
					<Text style={styles.emptyListText}>No exercises found</Text>
				)}
			/>
		);
	}

	renderExercise(exercise) {
		return (
			<TouchableHighlight
				onPress={() => this._exercisePressed(exercise)}
				underlayColor="#e2e2e2"
			>
				<View style={ListStyles.listItem}>
					<Text style={ListStyles.itemTitle}>{exercise.displayName}</Text>
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

const styles = StyleSheet.create({
	emptyListText: {
		textAlign: 'center',
		marginTop: 10
	}
});

ExerciseList.propTypes = {
	navigator: PropTypes.shape({
		push: PropTypes.func,
		pop: PropTypes.func
	})
};
