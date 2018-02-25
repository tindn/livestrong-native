import { createStore, combineReducers, applyMiddleware } from 'redux';
import WorkoutReducer from './Workout/reducer';
import thunk from 'redux-thunk';

export default createStore(
	combineReducers({
		Workout: WorkoutReducer
	}),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
	applyMiddleware(thunk)
);
