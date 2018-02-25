import React from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from 'react-native';
import localData from '../../utils/localData';
import { sortByDisplayName } from '../../utils/sorts';
import { ListStyles } from '../../styles';
import PropTypes from 'prop-types';

export default class ExerciseList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			exercises: [],
			refreshing: false
		};
		this._exercisePressed = this._exercisePressed.bind(this);
		props.navigation.addListener('willFocus', this._updateList.bind(this));
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
		this.props.navigation.push('Exercise', { exercise });
	}
}

const styles = StyleSheet.create({
	emptyListText: {
		textAlign: 'center',
		marginTop: 10
	}
});

ExerciseList.propTypes = {
	navigation: PropTypes.object
};
