import React from 'react';
import {
	Alert,
	Button,
	StyleSheet,
	ScrollView,
	Text,
	View
} from 'react-native';
import localData from '../../utils/localData';
import TextInputGroup from '../shared/textinputgroup';
import { TextInputGroupStyles, ActionButtonsStyles } from '../../styles';
import { ExerciseTypes } from '../../globals';
import CheckList from '../shared/checkList';
import PropTypes from 'prop-types';

export default class Exercise extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			exercise: this._getExercise(props)
		};
		this._updateName = this._updateName.bind(this);
		this._updateExercise = this._updateExercise.bind(this);
		this._deleteExercise = this._deleteExercise.bind(this);
		this._createExercise = this._createExercise.bind(this);
		this._updateType = this._updateType.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ exercise: this._getExercise(nextProps) });
	}

	render() {
		return (
			<ScrollView style={styles.exerciseView} keyboardDismissMode="on-drag">
				<View style={styles.fieldGroup}>
					<TextInputGroup
						labelText="Name"
						inputValue={this.state.exercise.displayName}
						onChangeText={this._updateName}
						placeholderText="Run Forrest, Run"
						autoFocus={true}
					/>
				</View>
				<CheckList
					options={ExerciseTypes.map(type => ({
						value: type._id,
						name: type.name
					}))}
					onPress={this._updateType}
					selectedValue={this.state.exercise.type}
					labelText="Type"
					style={styles.fieldGroup}
				/>
				{this.state.exercise.heaviestSet ? (
					<View style={[styles.heaviestSet, styles.fieldGroup]}>
						<Text style={TextInputGroupStyles.label}>Heaviest Set</Text>
						<Text style={TextInputGroupStyles.input}>
							{this.state.exercise.heaviestSet.reps} reps at{' '}
							{this.state.exercise.heaviestSet.weight}{' '}
							{this.state.exercise.heaviestSet.weightUnit}
						</Text>
					</View>
				) : null}
				<View style={[ActionButtonsStyles.group]}>
					{this.state.exercise.id === undefined ? (
						<View style={ActionButtonsStyles.button}>
							<Button title="Create Exercise" onPress={this._createExercise} />
						</View>
					) : (
						<View style={ActionButtonsStyles.button}>
							<Button
								title="Delete Exercise"
								onPress={this._deleteExercise}
								color="red"
							/>
						</View>
					)}
				</View>
			</ScrollView>
		);
	}

	_getExercise(props) {
		let exercise = props.navigation.getParam('exercise');
		if (!exercise) {
			exercise = { name: '' };
		}

		return exercise;
	}

	_updateName(name) {
		if (name === '') {
			return;
		}
		this.setState(prevState => {
			prevState.exercise.displayName = name;
			if (prevState.exercise.id === undefined) {
				prevState.exercise.name = name.toLowerCase().replace(/\s/g, '_');
			}
			return prevState;
		}, this._updateExercise);
	}

	_updateType(type) {
		this.setState(prevState => {
			prevState.exercise.type = type;
			return prevState;
		}, this._updateExercise);
	}

	_updateExercise() {
		if (this.state.exercise.displayName === '') {
			Alert.alert(
				'',
				'Name is required',
				[
					{
						text: 'Ok'
					}
				],
				{ cancelable: false }
			);
			return;
		}
		if (this.state.exercise.id !== undefined) {
			localData.saveExercise(this.state.exercise);
		}
	}

	_deleteExercise() {
		Alert.alert('', 'Are you sure you want to delete this exercise?', [
			{
				text: 'Cancel',
				style: 'cancel'
			},
			{
				text: 'Delete',
				style: 'destructive',
				onPress: () => {
					localData.deleteExercise(this.state.exercise).then(() => {
						this.props.navigation.pop();
					});
				}
			}
		]);
	}

	_createExercise() {
		localData.saveExercise(this.state.exercise).then(() => {
			this.props.navigation.pop();
		});
	}
}

const styles = StyleSheet.create({
	exerciseView: {
		flex: 1,
		flexDirection: 'column'
	},
	fieldGroup: {
		marginTop: 10,
		marginBottom: 40
	},
	heaviestSet: {
		paddingLeft: 10
	}
});

Exercise.propTypes = {
	exercise: PropTypes.object,
	navigation: PropTypes.object
};
