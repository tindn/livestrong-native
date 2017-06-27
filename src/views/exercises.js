import React from 'react';
import {
  View,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight
} from 'react-native';
import Header from '../header';

export default class ExercisesView extends React.Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    if (props.exercises === null) {
      props.exercises = [];
    }
    this.state = {
      dataSource: this.ds.cloneWithRows([])
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.ds.cloneWithRows(nextProps.exercises)
    });
  }
  render() {
    return (
      <View style={styles.exercisesView}>
        <Header />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={exercise => this.renderExercise(exercise)}
          automaticallyAdjustContentInsets={false}
          contentInset={{ bottom: 49 }}
          enableEmptySections={true}
        />
      </View>
    );
  }
  renderExercise(exercise) {
    return (
      <TouchableHighlight
        onPress={this._exercisePressed(exercise)}
        underlayColor="red"
        activeOpacity={0.3}
      >
        <View style={styles.exercise}>
          <Text style={styles.title}>{exercise.name}</Text>
          <View style={styles.details}>
            <Text style={styles.detail}>
              Rec. weight: {exercise.weight} {exercise.weightUnit}
            </Text>
            <Text style={styles.detail}>Rec. reps: {exercise.repetition}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _exercisePressed(exercise) {
    console.log(exercise.name);
  }
}

const styles = StyleSheet.create({
  exercisesView: {
    flex: 1,
    marginTop: 0
  },
  exercise: {
    borderBottomColor: '#B5B9C2',
    borderBottomWidth: 0.5,
    marginTop: 10,
    marginLeft: 7
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#4B4C4B',
    marginBottom: 5
  },
  details: {
    flexDirection: 'row',
    marginBottom: 10
  },
  detail: {
    flex: 1,
    color: '#79808F'
  }
});
