import React from 'react';
import {
	ListView,
	FlatList,
	NavigatorIOS,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from 'react-native';
import localData from '../../utils/localData';
import Plan from './plan';
import { sortByDisplayName } from '../../utils/sorts';
import { ListStyles } from '../../styles';

export default class PlansView extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<NavigatorIOS
				ref="nav"
				initialRoute={{
					component: PlanList,
					title: 'Workout Plans',
					rightButtonTitle: 'New',
					onRightButtonPress: () => this._newPlanButtonPressed()
				}}
				style={ListStyles.listView}
			/>
		);
	}

	_newPlanButtonPressed() {
		this.refs.nav.push({
			component: Plan,
			title: 'New Workout Plan'
		});
	}
}

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
				plan.key = index;
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
					<Text
						style={{
							textAlign: 'center',
							marginTop: 10
						}}
					>
						No plans found
					</Text>
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
		this.props.navigator.push({
			title: plan.displayName,
			component: Plan,
			passProps: {
				plan: plan
			},
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			leftButtonTitle: '< Back'
		});
	}
}
