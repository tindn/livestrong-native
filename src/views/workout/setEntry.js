import React from 'react';
import {
	Image,
	Picker,
	Text,
	TouchableHighlight,
	View,
	StyleSheet
} from 'react-native';
import {
	iosBlue,
	borderGray,
	UnitTypes,
	successGreen,
	red
} from '../../globals';
import getRepsInputs from '../../utils/repsInputs';
import getWeightInputs from '../../utils/weightInputs';
import PropTypes from 'prop-types';

export default class SetEntry extends React.Component {
	constructor(props) {
		super(props);
		let weightIncrement = 2.5;
		if (props.set.weightUnit && props.set.weightUnit === 'cnt') {
			weightIncrement = 1;
		}
		this.state = {
			repsInputs: getRepsInputs(props.set.reps),
			weightInputs: getWeightInputs(props.set.weight, weightIncrement),
			isEditing: true
		};
	}
	render() {
		return (
			<View style={styles.mainView} key={this.props.setIndex}>
				<View style={styles.inputGroup}>
					<Text style={[styles.index, styles.readingFont]}>
						{this.props.setIndex + 1}.
					</Text>
					{this.state.isEditing ? (
						<Picker
							style={styles.repsPicker}
							itemStyle={styles.pickerItem}
							selectedValue={this.props.set.reps}
							onValueChange={reps => {
								this.props.updateSet(
									{ ...this.props.set, reps: reps },
									this.props.setIndex
								);
							}}
						>
							{this.state.repsInputs.map(input => (
								<Picker.Item
									key={input}
									label={input.toString()}
									value={input}
								/>
							))}
						</Picker>
					) : (
						<Text style={[styles.readingFont, styles.repsText]}>
							{this.props.set.reps}
						</Text>
					)}
					<Text style={[styles.readingFont]}>reps at</Text>
					{this.state.isEditing ? (
						<Picker
							style={styles.weightPicker}
							itemStyle={styles.pickerItem}
							selectedValue={this.props.set.weight}
							onValueChange={weight => {
								this.props.updateSet(
									{ ...this.props.set, weight: weight },
									this.props.setIndex
								);
							}}
						>
							{this.state.weightInputs.map(input => (
								<Picker.Item
									key={input}
									label={input.toString()}
									value={input}
								/>
							))}
						</Picker>
					) : (
						<Text style={[styles.readingFont, styles.weightText]}>
							{this.props.set.weight}
						</Text>
					)}
					{this.state.isEditing ? (
						<Picker
							style={styles.weightUnit}
							itemStyle={styles.pickerItem}
							selectedValue={this.props.set.weightUnit}
							onValueChange={itemValue => {
								this.props.updateSet(
									{ ...this.props.set, weightUnit: itemValue },
									this.props.setIndex
								);
								let weightIncrement = 2.5;
								if (itemValue === 'cnt') {
									weightIncrement = 1;
								}
								this.setState({
									weightInputs: getWeightInputs(
										this.props.set.weight,
										weightIncrement
									)
								});
							}}
						>
							{UnitTypes.map((type, index) => (
								<Picker.Item key={index} label={type.name} value={type._id} />
							))}
						</Picker>
					) : (
						<Text style={[styles.readingFont, styles.weightUnit]}>
							{this.props.set.weightUnit}
						</Text>
					)}
				</View>
				<View
					style={[
						styles.iconGroup,
						this.state.isEditing && styles.iconGroupEditing
					]}
				>
					{this.state.isEditing
						? [
							<TouchableHighlight
								key={1}
								onPress={() => {
									this.setState({ isEditing: false });
								}}
								underlayColor="#ddd"
							>
								<Image
									source={require('../../../assets/check.png')}
									style={[styles.actionIcon, styles.completeIcon]}
								/>
							</TouchableHighlight>,
							<TouchableHighlight
								key={2}
								onPress={() => {
									this.props.removeSet(this.props.setIndex);
								}}
								underlayColor="#ddd"
							>
								<Image
									source={require('../../../assets/close.png')}
									style={[styles.actionIcon, styles.removeIcon]}
								/>
							</TouchableHighlight>
						]
						: [
							<TouchableHighlight
								key={1}
								onPress={() => {
									this.setState({ isEditing: true });
								}}
								underlayColor="#ddd"
							>
								<Image
									source={require('../../../assets/pencil.png')}
									style={[styles.actionIcon, styles.editIcon]}
								/>
							</TouchableHighlight>,
							<TouchableHighlight
								key={2}
								onPress={() => {
									this.props.removeSet(this.props.setIndex);
								}}
								underlayColor="#ddd"
							>
								<Image
									source={require('../../../assets/close.png')}
									style={[styles.actionIcon, styles.removeIcon]}
								/>
							</TouchableHighlight>
						]}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	mainView: {
		flexDirection: 'row',
		paddingLeft: 10,
		paddingRight: 10,
		marginTop: 5,
		borderColor: borderGray,
		borderTopWidth: 0.5,
		justifyContent: 'space-between'
	},
	readingFont: {
		fontSize: 18
	},
	inputGroup: {
		flexDirection: 'row',
		flex: 8,
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	index: {
		marginRight: 5
	},
	repsText: {
		width: 25,
		textAlign: 'center'
	},
	repsPicker: {
		width: 50
	},
	weightText: {
		width: 70,
		textAlign: 'center'
	},
	weightPicker: {
		width: 80
	},
	weightUnit: {
		width: 50
	},
	iconGroup: {
		flexDirection: 'row',
		flex: 3
	},
	iconGroupEditing: {
		marginTop: 35
	},
	actionIcon: {
		width: 15,
		height: 15,
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 15,
		marginRight: 15
	},
	removeIcon: {
		tintColor: red
	},
	editIcon: {
		tintColor: iosBlue
	},
	completeIcon: {
		tintColor: successGreen,
		width: 17,
		height: 17
	},
	pickerItem: {
		height: 110
	}
});

SetEntry.propTypes = {
	removeSet: PropTypes.func,
	updateSet: PropTypes.func,
	set: PropTypes.object,
	setIndex: PropTypes.number
};
