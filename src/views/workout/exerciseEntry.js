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
import { iosBlue, textGray } from '../../globals';

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
					<View
						style={{
							flex: 3
						}}
					>
						<TouchableHighlight
							onPress={() => {
								this.setState(prevState => {
									prevState.completed = !prevState.completed;
									return prevState;
								});
							}}
							underlayColor="#ddd"
						>
							<Text style={{ color: iosBlue, paddingLeft: 15 }}>
								{this.state.completed ? 'Edit' : 'Done'}
							</Text>
						</TouchableHighlight>
					</View>
				</View>
				{this.props.exercise.heaviestSet ? (
					<View
						style={[
							{
								paddingLeft: 10
							}
						]}
					>
						<Text style={{ fontStyle: 'italic', color: textGray }}>
							{this.state.exercise.heaviestSet.reps} reps at{' '}
							{this.state.exercise.heaviestSet.weight}{' '}
							{this.state.exercise.heaviestSet.weightUnit}
						</Text>
					</View>
				) : null}
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

				{this.props.workoutStarted && !this.state.completed ? (
					<View
						style={{
							marginTop: 30,
							flexDirection: 'row',
							justifyContent: 'space-between',
							paddingLeft: 10,
							paddingRight: 10
						}}
					>
						<TouchableHighlight
							onPress={() =>
								this.props.removeExercise(this.props.exerciseIndex)
							}
						>
							<Text style={styles.removeText}>Remove Exercise</Text>
						</TouchableHighlight>
						<TouchableHighlight onPress={this._addSet}>
							<Text style={styles.addSetText}>Add set</Text>
						</TouchableHighlight>
					</View>
				) : null}
			</View>
		);
	}

	_addSet() {
		let newSet = { reps: 8, weight: 25, weightUnit: 'lbs' };
		if (this.state.exercise.sets.length) {
			newSet = Object.assign(
				{},
				this.state.exercise.sets[this.state.exercise.sets.length - 1],
				{ completed: false }
			);
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
		paddingRight: 10,
		flexDirection: 'row'
	},
	headerText: {
		fontSize: 17,
		fontWeight: 'bold',
		flex: 8
	},
	removeText: {
		fontSize: 15,
		color: 'red'
	},
	addSetText: {
		color: iosBlue,
		fontSize: 15
	}
});
