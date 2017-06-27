import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this._getTitle = this._getTitle.bind(this);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>{this._getTitle()}</Text>
      </View>
    );
  }

  _getTitle() {
    if (this.state.title && this.state.title !== '') {
      return this.state.title;
    }
    return 'Livestrong';
  }
}

const styles = StyleSheet.create({
  view: {
    height: 60,
    alignSelf: 'stretch',
    backgroundColor: '#FCFCFC',
    borderBottomColor: '#B5B9C2',
    borderBottomWidth: 0.5
  },
  text: {
    marginTop: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17
    // color: '#007AFF'
  }
});
