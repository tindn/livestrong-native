import React from 'react';
import {
	ActionSheetIOS,
	Alert,
	Button,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableHighlight,
	View
} from 'react-native';
import localData from '../../utils/localData';
import TextInputGroup from '../shared/textinputgroup';

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

	_updateType(type) {
		this.setState(prevState => {
			prevState.exercise.type = type;
			return prevState;
		}, this._updateExercise);
	}

	render() {
		return (
			<View style={styles.exerciseView}>
				<View style={styles.nameInput}>
					<TextInputGroup
						labelText="Name"
						inputValue={this.state.exercise.displayName}
						onChangeText={this._updateName}
						placeholderText="Run Forest, Run"
						autoFocus={true}
					/>
				</View>
				<View style={styles.selectList}>
					<View style={styles.selectItem}>
						<TouchableHighlight
							onPress={() => this._updateType('resistance')}
							underlayColor="#007AFF"
						>
							<Text
								style={
									this.state.exercise.type === 'resistance' ? (
										styles.selectText
									) : (
										{}
									)
								}
							>
								Resistance
							</Text>
						</TouchableHighlight>
					</View>
					<View style={styles.selectItem}>
						<TouchableHighlight onPress={() => this._updateType('cardio')}>
							<Text
								style={
									this.state.exercise.type === 'cardio' ? styles.selectText : {}
								}
							>
								Cardio
							</Text>
						</TouchableHighlight>
					</View>
				</View>
				{this.state.exercise.heaviestSet ? (
					<View>
						<Text>Heaviest Set</Text>
						<Text
						>{`${this.state.exercise.heaviestSet.reps.toString()} reps at ${this.state.exercise.heaviestSet.weight.toString()} ${this
							.state.exercise.heaviestSet.weightUnit}`}</Text>
					</View>
				) : null}
				<View style={styles.actions} />
				{this.state.exercise.id === undefined ? (
					<View style={styles.actionButton}>
						<Button title="Create Exercise" onPress={this._createExercise} />
					</View>
				) : null}
				<View style={styles.actionButton}>
					<Button
						title="Delete Exercise"
						onPress={this._deleteExercise}
						color="red"
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	exerciseView: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 64
	},
	nameInput: {
		marginTop: 10,
		marginBottom: 40
	},
	actions: {
		marginTop: 50
	},
	actionButton: {
		borderColor: '#B5B9C2',
		borderTopWidth: 0.5,
		paddingTop: 10,
		paddingBottom: 10
	},
	selectList: {
		borderColor: '#B5B9C2',
		borderBottomWidth: 0.5
	},
	selectItem: {
		borderColor: '#B5B9C2',
		borderTopWidth: 0.5,
		paddingTop: 15,
		paddingBottom: 15
	},
	selectText: {
		color: '#007AFF'
	}
});
