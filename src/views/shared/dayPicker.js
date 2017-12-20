import React from 'react';
import {
	Button,
	Picker,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from 'react-native';
import localData from '../../utils/localData';
import { iosBlue, borderGray } from '../../globals';

export default class DayPicker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			allPlans: [],
			days: [],
			showPicker: false,
			selectedPlanId: null,
			selectedPlanIndex: -1,
			selectedDayIndex: -1
		};
		this._togglePicker = this._togglePicker.bind(this);
		this._selectDay = this._selectDay.bind(this);
		this._updatePlan = this._updatePlan.bind(this);
		this._updateDay = this._updateDay.bind(this);
		this._updatePlan = this._updatePlan.bind(this);
	}

	componentDidMount() {
		this._updatePlans();
	}

	componentWillReceiveProps() {
		this._updatePlans();
	}

	_updatePlans() {
		localData.getAllPlans().then(plans => {
			this.setState(prevState => {
				prevState.allPlans = plans;
				return prevState;
			});
		});
	}

	render() {
		return (
			<View style={styles.mainView}>
				{this.state.showPicker ? (
					<View>
						<View style={styles.pickers}>
							<View style={styles.picker}>
								<Text style={styles.pickerTitle}>Plan</Text>
								<Picker
									selectedValue={this.state.selectedPlanIndex}
									onValueChange={this._updatePlan}
								>
									<Picker.Item key={-1} label="" value="-1" />
									{this.state.allPlans.map((plan, index) => {
										return (
											<Picker.Item
												key={index}
												label={plan.displayName}
												value={index}
											/>
										);
									})}
								</Picker>
							</View>
							<View style={styles.picker}>
								<Text style={styles.pickerTitle}>Day</Text>
								<Picker
									selectedValue={this.state.selectedDayIndex}
									onValueChange={this._updateDay}
								>
									<Picker.Item key={-1} label="" value="-1" />
									{this.state.days.map((day, index) => {
										if (!day.name) {
											day.name = 'Day ' + (index + 1);
										}
										return (
											<Picker.Item key={index} value={index} label={day.name} />
										);
									})}
								</Picker>
							</View>
						</View>
						<View style={styles.actions}>
							<Button
								title="Cancel"
								onPress={() => {
									this.setState(prevState => {
										prevState.showPicker = false;
										prevState.days = [];
										prevState.selectedPlanId = null;
										prevState.selectedPlanIndex = -1;
										prevState.selectedDayIndex = -1;
										return prevState;
									});
								}}
								color="red"
							/>
							<Button title="Select" onPress={this._selectDay} />
						</View>
					</View>
				) : (
					<TouchableHighlight
						onPress={this._togglePicker}
						style={styles.toggleAction}
					>
						<Text style={styles.toggleActionText}>
							{this.props.title ? this.props.title : 'Choose day'}
						</Text>
					</TouchableHighlight>
				)}
			</View>
		);
	}

	_updatePlan(value) {
		this.setState(prevState => {
			prevState.selectedPlanIndex = value;
			if (value !== '-1') {
				prevState.selectedPlanId = prevState.allPlans[value].id;
				prevState.days = this.state.allPlans[value].days;
			}
			return prevState;
		});
	}

	_updateDay(value) {
		this.setState(prevState => {
			prevState.selectedDayIndex = value;
			return prevState;
		});
	}

	_togglePicker() {
		this.setState(prevState => {
			prevState.showPicker = !prevState.showPicker;
			return prevState;
		});
	}

	_selectDay() {
		if (
			this.state.allPlans[this.state.selectedPlanIndex].days[
				this.state.selectedDayIndex
			]
		) {
			localData
				.getValues(
					this.state.allPlans[this.state.selectedPlanIndex].days[
						this.state.selectedDayIndex
					].exercises.map(exercise => {
						return 'exercise.' + exercise.exerciseId;
					})
				)
				.then(exercises => {
					this.props.updateDay(
						exercises,
						this.state.selectedPlanId,
						this.state.selectedDayIndex
					);
					this.setState(prevState => {
						prevState.showPicker = false;
						return prevState;
					});
				});
		}
	}
}

const styles = StyleSheet.create({
	mainView: {
		backgroundColor: '#f0f0f0'
	},
	toggleAction: {
		paddingTop: 10,
		paddingBottom: 10
	},
	toggleActionText: {
		color: iosBlue,
		fontSize: 16,
		textAlign: 'center'
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	pickers: {
		flexDirection: 'row',
		marginTop: 30
	},
	picker: {
		flex: 1,
		borderColor: borderGray,
		borderRightWidth: 0.5
	},
	pickerTitle: {
		fontSize: 16,
		textAlign: 'center'
	}
});
