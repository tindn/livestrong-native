import React from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from 'react-native';
import localData from '../../utils/localData';
import Plan from './plan';
import { sortByDisplayName } from '../../utils/sorts';
import { ListStyles } from '../../styles';
import PropTypes from 'prop-types';

class PlanList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			allPlans: [],
			refreshing: false
		};
		this._planPressed = this._planPressed.bind(this);
	}

	_updateList() {
		this.setState({ refreshing: true });
		localData.getAllPlans().then(plans => {
			plans = plans.map((plan, index) => {
				plan.key = index.toString();
				return plan;
			});
			plans = plans.sort(sortByDisplayName);
			this.setState(prevState => {
				prevState.allPlans = plans;
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
				data={this.state.allPlans}
				renderItem={({ item }) => this.renderPlan(item)}
				refreshing={this.state.refreshing}
				onRefresh={this._updateList.bind(this)}
				ListEmptyComponent={() => (
					<Text style={styles.emptyText}>No plans found</Text>
				)}
			/>
		);
	}

	renderPlan(plan) {
		return (
			<TouchableHighlight
				onPress={() => this._planPressed(plan)}
				underlayColor="#e2e2e2"
			>
				<View style={ListStyles.listItem}>
					<Text style={ListStyles.itemTitle}>{plan.displayName}</Text>
				</View>
			</TouchableHighlight>
		);
	}

	_planPressed(plan) {
		this.props.navigation.push({
			title: plan.displayName,
			component: Plan,
			passProps: {
				plan: plan
			},
			onLeftButtonPress: () => {
				this.props.navigation.pop();
			},
			leftButtonTitle: '< Back'
		});
	}
}

const styles = StyleSheet.create({
	emptyText: {
		textAlign: 'center',
		marginTop: 10
	}
});

PlanList.propTypes = {
	navigation: PropTypes.object
};

export default PlanList;
