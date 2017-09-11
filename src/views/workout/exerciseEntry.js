import React from 'react';
import {
	Button,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableHighlight,
	View
} from 'react-native';
import SetEntry from './setEntry';

export default class ExerciseEntry extends React.Component {
	constructor(props) {
		super(props);
		let exercise = this.props.exercise;
		if (!exercise.sets) {
			exercise.sets = [];
		}
		this.state = {
			exercise: exercise
		};
		this._updateSet = this._updateSet.bind(this);
		this._addSet = this._addSet.bind(this);
		this._removeSet = this._removeSet.bind(this);
	}

	render() {
		return (
			<View style={styles.mainView}>
				<View style={styles.header}>
					<Text style={styles.headerText}>
						{this.props.exercise.displayName}
					</Text>
					<TouchableHighlight
						style={styles.remove}
						onPress={() => this.props.removeExercise(this.props.exerciseIndex)}
					>
						<Text style={styles.removeText}>Remove</Text>
					</TouchableHighlight>
				</View>
				{this.state.exercise.sets.map((set, index) => {
					return (
						<SetEntry
							set={set}
							setIndex={index}
							updateSet={this._updateSet}
							key={index}
							removeSet={this._removeSet}
						/>
					);
				})}
				{this.props.workoutStarted
					? <TouchableHighlight onPress={this._addSet}>
							<Text style={styles.addSetText}>Add set</Text>
						</TouchableHighlight>
					: null}
			</View>
		);
	}

	_addSet() {
		let newSet = { reps: 8, weight: 25, weightUnit: 'lbs' };
		if (this.state.exercise.heaviestSet) {
			newSet = Object.assign({}, this.state.exercise.heaviestSet);
		}
		this.setState(prevState => {
			prevState.exercise.sets.push(newSet);
			return prevState;
		}, this.props.updateExercise(this.state.exercise, this.props.exerciseIndex));
	}

	_updateSet(set, setIndex) {
		if (!set.weightUnit) {
			set.weightUnit = 'lbs';
		}
		this.setState(prevState => {
			prevState.exercise.sets[setIndex] = set;
			return prevState;
		}, this.props.updateExercise(this.state.exercise, this.props.exerciseIndex));
	}

	_removeSet(setIndex) {
		let sets = this.state.exercise.sets;
		sets.splice(setIndex, 1);
		this.setState(prevState => {
			prevState.exercise.sets = sets;
			return prevState;
		}, this.props.updateExercise(this.state.exercise, this.props.exerciseIndex));
	}
}

const styles = StyleSheet.create({
	mainView: {
		marginBottom: 30
	},
	header: {
		paddingLeft: 10,
		flexDirection: 'row'
	},
	headerText: {
		fontSize: 17,
		fontWeight: 'bold',
		flex: 8
	},
	remove: {
		flex: 2,
		alignSelf: 'flex-end'
	},
	removeText: {
		fontSize: 14,
		color: 'red'
	},
	addSetText: {
		marginTop: 15,
		color: '#007AFF',
		fontSize: 15,
		textAlign: 'center'
	}
});
