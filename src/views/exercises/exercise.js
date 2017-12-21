import React from 'react';
import {
	ActionSheetIOS,
	Alert,
	Button,
	StyleSheet,
	ScrollView,
	Text,
	TextInput,
	View
} from 'react-native';
import localData from '../../utils/localData';
import TextInputGroup from '../shared/textinputgroup';
import { TextInputGroupStyles, ActionButtonsStyles } from '../../styles';
import { ExerciseTypes } from '../../globals';
import PickerGroup from '../shared/pickerGroup';
import CheckList from '../shared/checkList';

export default class Exercise extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			exercise: props.exercise ? props.exercise : { name: '' }
		};
		this._updateName = this._updateName.bind(this);
		this._updateExercise = this._updateExercise.bind(this);
		this._deleteExercise = this._deleteExercise.bind(this);
		this._createExercise = this._createExercise.bind(this);
		this._updateType = this._updateType.bind(this);
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
		ActionSheetIOS.showActionSheetWithOptions(
			{
				message: 'Are you sure you want to delete this exercise?',
				options: ['Delete', 'Cancel'],
				destructiveButtonIndex: 0,
				cancelButtonIndex: 1
			},
			buttonIndex => {
				if (buttonIndex === 0) {
					localData.deleteExercise(this.state.exercise);
					this.props.navigator.pop();
				}
			}
		);
	}

	_createExercise() {
		localData.saveExercise(this.state.exercise);
		this.props.navigator.pop();
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
