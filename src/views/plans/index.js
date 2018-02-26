import React from 'react';
import { Button } from 'react-native';
import Plan from './plan';
import { StackNavigator } from 'react-navigation';
import PlanList from './planList';

const PlansView = StackNavigator({
	Plans: {
		screen: PlanList,
		navigationOptions: ({ navigation }) => {
			const goToNew = () => {
				navigation.push('Plan');
			};
			const newButton = <Button title="New" onPress={goToNew} />;
			return {
				title: 'Plans',
				headerRight: newButton
			};
		}
	},
	Plan: {
		screen: Plan,
		navigationOptions: ({ navigation }) => {
			let title = 'New Plan';
			const plan = navigation.getParam('plan');
			if (plan && plan.displayName) {
				title = plan.displayName;
			}
			return {
				title: title
			};
		}
	}
});

export default PlansView;
