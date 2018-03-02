import { StackNavigator } from 'react-navigation';
import Workout from './workout';

export default StackNavigator({
	Workout: {
		screen: Workout,
		navigationOptions: {
			title: 'Workout'
		}
	}
});
