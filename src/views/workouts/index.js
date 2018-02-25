import { StackNavigator } from 'react-navigation';
import WorkoutList from './workoutList';
import WorkoutView from './workoutView';

const WorkoutsView = StackNavigator({
	Workouts: {
		screen: WorkoutList
	},
	WorkoutView: {
		screen: WorkoutView
	}
});

export default WorkoutsView;
