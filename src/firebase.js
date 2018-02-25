import firebase from 'firebase';
const firebaseConfig = {
	apiKey: 'AIzaSyADkMtF8ghoUNJWHAQJRg8DkA0bXmQfWSQ',
	authDomain: 'livestrong-native.firebaseapp.com',
	databaseURL: 'https://livestrong-native.firebaseio.com',
	projectId: 'livestrong-native',
	storageBucket: 'livestrong-native.appspot.com',
	messagingSenderId: '804834349247'
};

firebase.initializeApp(firebaseConfig);

export default firebase;
